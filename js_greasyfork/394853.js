// ==UserScript==
// @name		diep.io Spade Script - Public
// @namespace	spade-squad.com
// @author		DiE ♠ BiTCH // ♠-squad
// @version		1.0.0
// @description	Press TAB to show Server Selector.
// @homepage	http://spade-squad.com
// @icon		http://spade-squad.com/pub/userscript/icon64.png
// @match		*://*.diep.io/*
// @run-at      document-start
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @grant		GM_setClipboard
// @grant		GM_notification
// @grant		unsafeWindow
// @require     http://code.jquery.com/jquery-3.2.1.slim.min.js
// @resource	spadeCSS http://spade-squad.com/pub/userscript/spadeuserscript.css
// @downloadURL https://update.greasyfork.org/scripts/394853/diepio%20Spade%20Script%20-%20Public.user.js
// @updateURL https://update.greasyfork.org/scripts/394853/diepio%20Spade%20Script%20-%20Public.meta.js
// ==/UserScript==

//TODO: handle keypress fix partycache

/* eslint-disable */
let spadeCSS = GM_getResourceText("spadeCSS");
GM_addStyle(spadeCSS);
/* eslint-enable */

(function () {
    "use strict";

    let defaultConfig = {
        "hotkey": {
            "connectUI": "\t" // TAB
        },
        "gameModeName": {
            "ffa": "FFA",
            "survival": "Survival",
            "teams": "2TDM",
            "4teams": "4TDM",
            "dom": "Domination",
            "maze": "Maze",
            "tag": "Tag",
            "sandbox": "Sandbox"
        },
        "team": {
            "blue": [[0, 178, 225, 255], [76, 201, 234, 255]],
            "red": [[241, 78, 84, 255], [245, 131, 135, 255]],
            "green": [[0, 225, 110, 255], [76, 234, 153, 255]],
            "purple": [[191, 127, 245, 255], [210, 165, 248, 255]]
        },
        "settings": {
            "firstRunDisable": false
        },
        "script": {
            "currentServer": {},
            "debugging": false
        }
    };

    const isObject = (obj) => {
        return obj instanceof Object && obj.constructor === Object;
    };

    const dataStorage = {
        set (key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get (key) {
            const value = localStorage.getItem(key);
            return value && JSON.parse(value);
        }
    };

    (function () {
        let privateConfig;
        unsafeWindow.Config = {};
        const proxify = (obj) => {
            for (const subkey in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, subkey)) {
                    unsafeWindow.Config[subkey] = new Proxy(obj[subkey], {
                        get (target, propKey, receiver) {
                            if (propKey in target) {
                                return Reflect.get(target, propKey, receiver);
                            }
                            throw new ReferenceError("Unknown property: " + propKey);
                        },
                        set (target, propKey, value, receiver) {
                            target[propKey] = value;
                            dataStorage.set("spadepublic", obj);
                            return Reflect.set(target, propKey, value, receiver);
                        }
                    });
                }
            }
        };

        if (dataStorage.get("spadepublic")) {
            privateConfig = dataStorage.get("spadepublic");
        } else {
            dataStorage.set("spadepublic", defaultConfig);
            privateConfig = defaultConfig;
        }

        proxify(privateConfig);

        unsafeWindow.resetConfig = () => {
            dataStorage.set("spadepublic", defaultConfig);
            unsafeWindow.Config = {};
            privateConfig = defaultConfig;
            proxify(privateConfig);
        };
    })();

    let playing = () => {
        return false;
    };

    $(window).on("load", () => {
        (function setBack () {
            try {
                if (unsafeWindow.input.should_prevent_unload) {
                    playing = () => {
                        return !!unsafeWindow.input.should_prevent_unload();
                    };
                }
            } catch (error) {
                setTimeout(() => {
                    setBack();
                }, 100);
            }
        })();
    });

    let canvas, ctx;
    $(() => {
        canvas = $("#canvas").get(0);
        ctx = canvas.getContext("2d");
    });

    HTMLElement.prototype.focus = () => {};
    HTMLElement.prototype.blur = () => {};

    const capitalizeFirstLetter = (string) => {
        return string && string[0].toUpperCase() + string.slice(1);
    };

    const createEl = (elObj, parent) => {
        let element;
        if (typeof elObj === "string") {
            element = $(document.createTextNode(elObj));
        } else {
            element = $(`<${elObj.node}>`);
            if (elObj.att) {
                let attributes = elObj.att;
                for (let key in attributes) {
                    if (attributes.hasOwnProperty(key)) {
                        if (key.charAt(0) === "@") {
                            element.attr(key.substring(1), attributes[key]);
                        } else {
                            element.text(attributes[key]);
                        }
                    }
                }
            }
            if (elObj.evl) {
                element.on(elObj.evl.type, elObj.evl.f);
            }
            if (elObj.child) {
                elObj.child.forEach((node) => {
                    createEl(node, element.get(0));
                });
            }
        }
        if (parent) {
            parent.append(element.get(0));
        }
        return element;
    };

    const scriptBody = $("<body>").get(0);
    createEl({
        node: "div", att: {"@id": "main", "@class": "base"},
        child: [ {
            node: "div", att: {"@class": "top"},
            child: [ {
                node: "h2", att: {"@class": "title"},
                child: [ {
                    node: "span", att: {"@class": "spadesymbol", textContent: "♠"}
                }, " Select diep.io Server ", {
                    node: "span", att: {"@class": "spadesymbol", textContent: "♠"}
                }, {
                } ]
            }, {
                node: "span", att: {"@class": "menu"},
                child: [ {
                    node: "a", att: {"@class": "menuButton close", textContent: "X"},
                    evl: {
                        type: "click",
                        f: () => {
                            $(".appear").removeClass("appear");
                        }}
                } ]
            }]
        }, {
            node: "lable", att: {textContent: "Gamemode"},
            child: [ {
                node: "select", att: {"@id": "gamemode"}
            } ]
        }, {
            node: "lable", att: {textContent: "Server"},
            child: [ {
                node: "select", att: {"@id": "server"}
            } ]
        }, {
            node: "span", att: {"@id": "more", textContent: "+"}
        }, {
            node: "div",
            child: [ {
                node: "button", att: {"@type": "button", "@id": "connect", "@class": "commandButton", textContent: "Connect"},
                evl: {
                    type: "click",
                    f: () => {
                        connectServer();
                        setTimeout(() => {
                            $(".appear").removeClass( "appear" );
                        }, 800);
                    }}
            }, {
                node: "button", att: {"@type": "button", "@id": "disconnect", "@class": "commandButton", textContent: "Disconnect"},
                evl: {
                    type: "click",
                    f: () => {
                        unsafeWindow.m28nOverride = false;
                        unsafeWindow.input.execute("lb_reconnect");
                    }}
            } ]
        }, {
            node: "p", att: {"@class": "ctag", textContent: "// © "},
            child: [ {
                node: "a", att: {"@class": "spadeweb", "@href": "http://spade-squad.com", "@target": "_blank", textContent: "spade-squad.com"}
            } ]
        } ]
    }, scriptBody);

    $(() => {
        // View script info only on firstRun
        if (!unsafeWindow.Config.settings.firstRunDisable) {
            createEl({
                node: "div", att: {"@id": "firstrun", "@class": "base appear"},
                child: [ {
                    node: "div", att: {"@class": "top"},
                    child: [ {
                        node: "h2", att: {"@class": "title"},
                        child: [ {
                            node: "span", att: {"@class": "spadesymbol", textContent: "♠"}
                        }, " Spade Script - First Run ", {
                            node: "span", att: {"@class": "spadesymbol", textContent: "♠"}
                        } ]
                    }, {
                        node: "span", att: {"@class": "menu"},
                        child: [ {
                            node: "a", att: {"@class": "menuButton close", textContent: "X"},
                            evl: {
                                type: "click",
                                f: () => {
                                    $("#firstrun").removeClass("appear");
                                    unsafeWindow.Config.settings.firstRunDisable = true;
                                }}
                        } ]
                    } ]
                }, {
                    node: "ul", att: {"@class": "settingslist"},
                    child: [ {
                        node: "h3", att: {"@class": "intro", textContent: "Spade Script was successfully installed and started"}
                    }, {
                        node: "li",
                        child: ["- Press TAB to toggle the Server Selector."]
                    }, {
                        node: "li",
                        child: ["- In the top right corner of a window is a X-Button to close it and O-Button so accesss aditional options."]
                    }, {
                        node: "li",
                        child: ["- You are using the PUBLIC version with reduced features. Check out our Website/Discord for updates and please report any bugs."]
                    }, {
                        node: "li",
                        child: ["- This info is only shown on the first start. Just close it and it won't appear again."]
                    }
                    ]
                } ]
            }, scriptBody);
        }
    });

    $("body").after(scriptBody);

    /* jshint ignore:start */
    const fetchServer = async (mode, times, ids = []) => {
        const url = "https://api.n.m28.io";
        const $serverSelect = $("#server");
        const $moreButton = $("#more");
        $moreButton.addClass("spin");

        for (let i = 0; i < times; i++) {
            try {
                const response = await fetch(`${url}/endpoint/diepio-${mode}/findEach/`);
                const body = await response.json();
                if (body.hasOwnProperty("servers")) {
                    Object.entries(body.servers).forEach(([key, val]) => {
                        if (!ids.some((id) => {
                            return id === val.id;
                        })) {
                            ids.push(val.id);
                            const txt = key.replace(/(linode-|vultr-)/, "") + ` - ${val.id.toUpperCase()}`;
                            $serverSelect.append($("<option>", {
                                "value": JSON.stringify(val),
                                "text": capitalizeFirstLetter(txt)
                            }));
                        }
                    });
                }
            } catch (err) {
                console.error(err);
            }
        }
        $("#server option").detach().sort((a, b) => {
            a = $(a);
            b = $(b);
            return ((a.text() > b.text()) ?
                1 :
                (a.text() < b.text()) ?
                    -1 :
                    0);
        }).appendTo($serverSelect).filter(":first").attr("selected", true);
        $moreButton.on("click", () => {
            fetchServer(mode, 4, ids);
        }).removeClass("spin");
    };
    /* jshint ignore:end */

    $(() => {
        const $gamemode = $("#gamemode");
        Object.entries(unsafeWindow.Config.gameModeName).forEach(([key, val]) => {
            $gamemode.append($("<option>", {
                "value": key,
                "text": val
            }));
        });
        $gamemode.change((event) => {
            $("#server").empty();
            fetchServer($(event.currentTarget).val(), 8, []);
        }).trigger("change");
    });

    $(() => {
        unsafeWindow.m28n.findServerPreference = (endpoint, options, cb) => {
            if (unsafeWindow.m28nOverride)
                options(null, [JSON.parse($( "#server option:selected" ).val())]);
            if (typeof options == "function") {
                cb = options;
                options = {};
            }
            unsafeWindow.m28n.findServers(endpoint, (err, r) => {
                if (err)
                    return cb(err);
                var availableRegions = [];
                for (var region in r.servers) {
                    availableRegions.push(region);
                }
                if (availableRegions.length === 0) {
                    cb("Couldn't find any servers in any region");
                    return;
                }
                if (availableRegions.length === 1) {
                    for (var region in r.servers) {
                        cb(null, [r.servers[region]]);
                        return;
                    }
                }
                unsafeWindow.m28n.findRegionPreference(availableRegions, options, (err, regionList) => {
                    if (err)
                        return cb(err);
                    var serverList = regionList.map((region) => {
                        return r.servers[region];
                    });
                    cb(null, serverList);
                });
            });
        };
    });

    const connectServer = () => {
        if ($("#server option:selected").length === 1) {
            const $autojoin = $("#autojoin");
            const $connect = $("#connect");

            let Observer = new MutationObserver(mutation => {
                mutation.forEach(mutation => {
                    if (mutation.target.style.display === "block") {
                        if ($autojoin.prop("checked")) {
                            const sequence = ["keydown", "keyup"];
                            sequence.forEach(event => {
                                $(canvas).trigger($.Event(event, {
                                    "keyCode": "\r".charCodeAt(0)
                                }));
                            });
                            $(".appear").removeClass("appear");
                        }
                        $connect.removeClass("connecting");
                    } else if (mutation.target.style.display === "none") {
                        if (playing()) {
                            Observer.disconnect();
                        }
                        unsafeWindow.m28nOverride = false;
                    }
                });
            });
            $connect.addClass("connecting");
            unsafeWindow.m28nOverride = true;
            unsafeWindow.input.execute("lb_reconnect");
            Observer.observe($("#textInputContainer").get(0), {
                "attributes": true,
                "attributeFilter": ["style"]
            });
        }
    };

    const WebSocketProxy = new Proxy(unsafeWindow.WebSocket, {
        construct (Target, args) {
            const instance = new Target(...args);

            const messageHandler = (event) => {
                const buffer = new DataView(event.data);
                const opcode = buffer.getUint8(0);
                switch (opcode) {
                case 4:
                    if (typeof unsafeWindow.Config.script.currentServer === "object") {
                        const decoded = new TextDecoder("utf-8").decode(event.data);
                        unsafeWindow.Config.script.currentServer = (/\W*(\w+).?((linode|vultr)-(\w+))/).exec(decoded);
                        unsafeWindow.Config.script.currentServer[4] = capitalizeFirstLetter(unsafeWindow.Config.script.currentServer[4]);
                    }
                    break;
                default:
                    break;
                }
            };

            instance.addEventListener("message", messageHandler);
            return instance;
        }
    });

    unsafeWindow.WebSocket = WebSocketProxy;

    const drawServer = () => {
        const x = window.innerWidth * window.devicePixelRatio / 2;
        const y = window.innerHeight * window.devicePixelRatio * 0.575;
        if (unsafeWindow.Config.script.currentServer.length === 5) {
            ctx.textAlign = "center";
            ctx.font = "25px Ubuntu";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.strokeText("Server:", x, y);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText("Server:", x, y);

            ctx.font = "35px Ubuntu";
            ctx.lineWidth = 5;
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            ctx.strokeText(unsafeWindow.Config.script.currentServer[2], x, y + 45);
            ctx.fillStyle = "rgba(255, 255, 255, 1)";
            ctx.fillText(unsafeWindow.Config.script.currentServer[2], x, y + 45);
        }
    };

    unsafeWindow.requestAnimFrame = (function () {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback, element) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    $(window).on("load", function animate () {
        if ($("#textInputContainer").css("display") === "block" && !playing()) {
            drawServer();
        }
        unsafeWindow.requestAnimFrame(animate);
    });

    const handleKeypress = (event) => {
        const key = String.fromCharCode(event.keyCode);
        switch (key) {
        case unsafeWindow.Config.hotkey.connectUI:
            event.preventDefault();
            event.stopPropagation();
            $("#main").toggleClass("appear");
            break;
        }
    };

    $(document).keydown((event) => {
        handleKeypress(event);
    });

})();
