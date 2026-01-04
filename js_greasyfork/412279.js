// ==UserScript==
// @name         DH3 HUD
// @namespace    com.anwinity.dh3
// @version      1.1.1
// @description  Highly customizable heads up display for DH3
// @author       Anwinity
// @match        dh3.diamondhunt.co
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412279/DH3%20HUD.user.js
// @updateURL https://update.greasyfork.org/scripts/412279/DH3%20HUD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEY_CONTENT = "dh3-hud.content";
    const KEY_SETTINGS = "dh3-hud.settings";
    const HELP_URL = "https://anwinity.com/dh3/hudhelp.html";
    const DEFAULT_SETTINGS = {
        hideInCombat: false,
        hideInCombatMap: false
    };
    const settings = Object.assign({}, DEFAULT_SETTINGS);
    const DEFAULT = `
Default/Example HUD

[color=red]Hello! I'm red![/color]
[style=font-size: 12pt]i am smol[/style]

This is how many gems you've found: [icon=bloodDiamond][var=bloodDiamondMined] [icon=diamond][var=diamondMined] [icon=ruby][var=rubyMined] [icon=emerald][var=emeraldMined] [icon=sapphire][var=sapphireMined]

Here's your combat cooldown: [icon=combatSkill][time=heroCooldown]

Oh boy, this one is complex. Let's take a look at your rocket status:
[if=return var_rocketStatus=="1"][gif=rocket][/if][if=return var_rocketStatus=="3"][gif=rocketBack][/if] [eval=if(var_rocketStatus==1) return formatTime((384000-var_rocketKm)/2); else if(var_rocketStatus==3) return formatTime(var_rocketKm/2); else return "--:--:--"; ]

You can also use some of lassebrus's functions, which are included with this script:
[fn=hud.rocketTimer]
    `.trim();
    let hud = "";
    let hudUndo = null;
    let hudParsed = [];

    function load() {
        hud = localStorage.getItem(KEY_CONTENT);
        if(typeof hud !== "string") {
            hud = DEFAULT;
        }
        hudParsed = parseHud(hud);
    }

    function save() {
        localStorage.setItem(KEY_CONTENT, hud);
        hudParsed = parseHud(hud);
    }

    function update() {
        let html = ""; // hud.replace(/\r?\n/g, "<br />");
        function transform(text) {
            return text.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\r?\n/g, "<br />");
        };
        hudParsed.forEach(piece => {
            try {
                if(piece.type == "text") {
                    html += transform(piece.text);
                }
                else if(piece.type == "tag") {
                    let text = piece.text.substr(1, piece.text.length-2);
                    let tag;
                    let value;
                    let eq = text.indexOf("=");
                    if(eq >= 0) {
                        tag = text.substr(0, eq);
                        value = text.substr(eq+1);
                    }
                    else {
                        tag = text;
                        value = null;
                    }
                    tag = tag.toLowerCase();
                    switch(tag) {
                        case "color": {
                            html += `<span style="color: ${value}">`;
                            break;
                        }
                        case "/color": {
                            html += "</span>";
                            break;
                        }
                        case "var": {
                            html += window["var_"+value];
                            break;
                        }
                        case "icon":
                        case "png": {
                            html += `<img class="dh3-hud-icon" src="images/${value}.png" />`;
                            break;
                        }
                        case "gif": {
                            html += `<img class="dh3-hud-icon" src="images/${value}.gif" />`;
                            break;
                        }
                        case "time": {
                            let time = formatTime(window["var_"+value]);
                            if(time=="0") {
                                time = "--:--:--";
                            }
                            html += time;
                            break;
                        }
                        case "number": {
                            let n = formatNumber(window["var_"+value]);
                            if(!n || n=="undefined") {
                                n = "0";
                            }
                            html += n;
                            break;
                        }
                        case "style": {
                            html += `<span style="${value}">`;
                            break;
                        }
                        case "/style": {
                            html += "</span>";
                            break;
                        }
                        case "class": {
                            html += `<span class="${value}">`;
                            break;
                        }
                        case "/class": {
                            html += "</span>";
                            break;
                        }
                        case "if": {
                            let b = Function("return function() {" + value + "}")()();
                            if(b) {
                                html += "<span>";
                            }
                            else {
                                html += '<span style="display: none">';
                            }
                            break;
                        }
                        case "/if": {
                            html += "</span>";
                            break;
                        }
                        case "button": {
                            value = value.replace(/"/g, "&quot;");
                            html += `<button type="button" class="dh3-hud-button" onclick="${value}">`;
                            break;
                        }
                        case "/button": {
                            html += "</button>";
                            break;
                        }
                        case "eval": {
                            let evalFunction = `return function() { ${value} }`;
                            let evalResult = Function(evalFunction)()();
                            html += evalResult;
                            break;
                        }
                        case "fn": {
                            let evalFunction = `return ${value}`;
                            let evalResult = Function(evalFunction)();
                            if(typeof evalResult === "function") {
                                evalResult = evalResult();
                            }
                            html += evalResult;
                            break;
                        }
                        case "html": {
                            html += value;
                            break;
                        }
                    }
                }
            }
            catch(err) {
                console.log(err);
                html += '<span style="color: red; font-weight: bold;>ERROR</span>';
            }
        });
        $("#dh3-hud-content").html(html);
    }

    function initExtraFunctions() {
        /* Other scripts can add functions to window.hud for easy access within the hud */

        window.hud = {
            /* Credits: Lassebrus */
            rocketTimer: function() {
                // if the rocket isn't in use atm, return a timer with no time
                const rocketStatus = window.getItem('rocketStatus');
                if (rocketStatus != 1 && rocketStatus != 3) {
                    return '--:--:--';
                }
                // what's the destination?
                const dest = window.getItem('rocketDestination');
                // rocket km is?
                const rocketKm = window.getItem('rocketKm');
                // the avg. speed is?
                let speed = 0,
                    // and the end destination is x km away
                    end = 0;
                // get the correct values:
                switch (dest) {
                    case 'moon':
                        speed = 2;
                        end = 384e3;
                        break;
                    case 'mars':
                        speed = 140;
                        end = 54e6;
                        break;
                    default:
                        speed = 0;
                }
                const kmLeft = rocketStatus === 1 ? end - rocketKm : rocketKm;
                return window.formatTime(kmLeft / speed);
            },

            /* Credits: Lassebrus */
            marketCollectable: function(slot = 1) {
                const slotEl = document.querySelector(`#market-slot-collect-${slot}`);
                if (!(slotEl instanceof HTMLSpanElement)) {
                    return 'Error! Check your BB-code!';
                }
                return slotEl.innerText;
            }
        };
    }

    function init() {
        if(!window.var_username) {
            setTimeout(init, 1000);
            return;
        }

        initExtraFunctions();

        // adds currentTab variable
        window.var_currentTab = "home";
        const originalNavigate = window.navigate;
        window.navigate = function(tab) {
            originalNavigate.apply(this, arguments);
            if(tab.startsWith("right-")) {
                window.var_currentTab = tab.slice(6);
            }
            else {
                window.var_currentTab = tab;
            }
        };

        setTimeout(function(){
            const originalSetItems = window.setItems;
            window.setItems = function() {
                originalSetItems.apply(this, arguments);
                update();
            }
        }, 5000);

        const styles = document.createElement("style");
        styles.textContent = `
          #dh3-hud-container {
            font-size: 14pt;
            padding: 0.25em;
            margin-top: 0.25em;
            margin-bottom: 0.125em;
            margin-right: 1px;
            border: 1px solid rgb(64, 64, 64);
            border-radius: 2px;
            background-color: rgb(26, 26, 26);
          }
          #dh3-hud-toolbar {
            text-align: right;
            border-bottom: 1px solid rgb(64, 64, 64);
            padding-bottom: 0.25em;
            margin-bottom: 0.25em;
          }
          div.dh3-hud-button {
            display: inline-block;
            text-align: center;
            vertical-align: middle;
            padding: 2px;
            cursor: pointer;
            opacity: 0.75;
          }
          div.dh3-hud-button:hover {
            background-color: rgb(39, 39, 39);
            opacity: 1.0;
          }
          #dh3-hud-content {
            font-family: "Lucida Console", Monaco, monospace;
          }
          img.dh3-hud-icon {
            display: inline-block;
            height: 18px;
            width: auto;
          }
          button.dh3-hud-button {
            background-color: rgb(26, 26, 26);
            color: white;
            border: 1px solid rgb(64, 64, 64);
            cursor: pointer;
            opacity: 0.75;
          }
          button.dh3-hud-button:hover {
            opacity: 1;
          }
        `;
        $("head").append(styles);

        let fontAwesome = document.createElement("script");
        fontAwesome.src = "https://kit.fontawesome.com/044e12ee28.js"
        fontAwesome.crossorigin = "anonymous";
        fontAwesome.type = "text/javascript";
        $("head").append(fontAwesome);

        $("#table-top-main-items").after(`
          <div id="dh3-hud-container">
            <div id="dh3-hud-toolbar">
              <div id="dh3-hud-button-help" class="dh3-hud-button" title="Help"><i class="far fa-question-circle"></i></div>
              <div id="dh3-hud-button-save" class="dh3-hud-button" title="Save" style="display: none"><i class="far fa-save"></i></div>
              <div id="dh3-hud-button-cancel" class="dh3-hud-button" title="Cancel" style="display: none"><i class="fas fa-undo-alt"></i></div>
              <div id="dh3-hud-button-edit" class="dh3-hud-button" title="Edit"><i class="fas fa-pencil-alt"></i></div>
              <div id="dh3-hud-button-hide" class="dh3-hud-button" title="Hide"><i class="far fa-minus-square"></i></div>
              <div id="dh3-hud-button-show" class="dh3-hud-button" title="Show" style="display: none"><i class="far fa-plus-square"></i></div>
            </div>
            <div id="dh3-hud-bottom">
              <div id="dh3-hud-content"></div>
              <textarea id="dh3-hud-editor" rows="10" style="width: 100%; display: none;"></textarea>
            </div>
          </div>
        `);

        $("#dh3-hud-button-help").click(function() {
            const w = 500;
            const h = 700;
            const dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : window.screenX;
            const dualScreenTop = window.screenTop !==  undefined ? window.screenTop : window.screenY;
            const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
            const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
            const systemZoom = width / window.screen.availWidth;
            const left = (width - w) / 2 / systemZoom + dualScreenLeft
            const top = (height - h) / 2 / systemZoom + dualScreenTop
            const win = window.open(HELP_URL, "DH3 HUD Help",
            `
            scrollbars=yes,
            menubar=no,
            toolbar=no,
            location=no,
            status=no,
            resizable=yes,
            width=${w / systemZoom},
            height=${h / systemZoom},
            top=${top},
            left=${left}
            `);
            if (typeof win.focus === "function") {
                win.focus();
            }
        });
        $("#dh3-hud-button-save").click(function() {
            hud = $("#dh3-hud-editor").val();
            save();
            $("#dh3-hud-content").show();
            $("#dh3-hud-editor").hide();
            $("#dh3-hud-button-edit").show();
            $("#dh3-hud-button-save").hide();
            $("#dh3-hud-button-cancel").hide();
            update();
        });
        $("#dh3-hud-button-cancel").click(function() {
            hud = hudUndo;
            $("#dh3-hud-content").show();
            $("#dh3-hud-editor").hide();
            $("#dh3-hud-button-edit").show();
            $("#dh3-hud-button-save").hide();
            $("#dh3-hud-button-cancel").hide();
        });
        $("#dh3-hud-button-edit").click(function() {
            hudUndo = hud;
            $("#dh3-hud-content").hide();
            $("#dh3-hud-editor").show().val(hud);
            $("#dh3-hud-button-edit").hide();
            $("#dh3-hud-button-save").show();
            $("#dh3-hud-button-cancel").show();
            $("#dh3-hud-editor").focus();
        });

        let hideShowAnimating = false;
        $("#dh3-hud-button-hide").click(function() {
            if(!hideShowAnimating) {
                hideShowAnimating = true;
                $("#dh3-hud-bottom").hide("slide", {
                    direction: "up",
                    complete: function() {
                        $("#dh3-hud-button-hide").hide();
                        $("#dh3-hud-button-show").show();
                        hideShowAnimating = false;
                    }
                });
            }
        });
        $("#dh3-hud-button-show").click(function() {
            if(!hideShowAnimating) {
                hideShowAnimating = true;
                $("#dh3-hud-bottom").show("slide", {
                    direction: "up",
                    complete: function() {
                        $("#dh3-hud-button-hide").show();
                        $("#dh3-hud-button-show").hide();
                        hideShowAnimating = false;
                    }
                });
            }
        });

        load();
        update();

    }

    function parseHud(str) {
        let result = [];
        if(typeof str === "string") {
            let buf = "";
            let bracket = false;
            for(let i = 0; i < str.length+1; i++) {
                let c = str.charAt(i);
                let next = str.charAt(i+1);
                if(bracket) {
                    if(c == '\\') {
                        buf += next;
                        i++;
                    }
                    else if(c == ']') {
                        buf += c;
                        result.push({type: "tag", text: buf});
                        buf = "";
                        bracket = false;
                    }
                    else if(!c) {
                        result.push({type: "tag", text: buf+"]"});
                    }
                    else {
                        buf += c;
                    }
                }
                else {
                    if(c == '\\') {
                        if(next != '\n') {
                            buf += next;
                        }
                        i++;
                    }
                    else if(c == '[') {
                        result.push({type: "text", text: buf});
                        buf = c;
                        bracket = true;
                    }
                    else if(!c) {
                        result.push({type: "text", text: buf});
                    }
                    else {
                        buf += c;
                    }
                }
            }
        }
        return result;
    }

    $(init);
    
})();