// ==UserScript==
// @name         r26's modloader for Istrolid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  a modloader for the game Istrolid
// @author       Rio6
// @match        *://*.istrolid.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444776/r26%27s%20modloader%20for%20Istrolid.user.js
// @updateURL https://update.greasyfork.org/scripts/444776/r26%27s%20modloader%20for%20Istrolid.meta.js
// ==/UserScript==

// A mod loader for Istrolid
// To install, download asar file from https://www.dropbox.com/sh/loia3j5gryzyoga/AACC2FOEO_rB1iacyxT1TKUga?dl=0
// then replace Steam/steamapps/common/Istrolid/resources/app.asar with that file
// Alternatively, you can use whatever way you want to load this script at start up (Temper Monkey, Grease Monkey, whatever)

//edited from src/challanges.js
r26_modloader = window.r26_modloader || {
    account_signinReply: account.signinReply
};

(function() {

    eval(onecup["import"]());

    var mods = [];

    var change = {
        id: -1,
        changing: false,
        push_back: false,

        online: true,
        name: "",
        data: "",

        edit: function(id) {
            if(!mods[id]) id = -1;
            change.id = id;
            change.online = mods[id].online;
            change.name = mods[id].name;
            change.data = mods[id].data;
            change.changing = true;
        },
        add: function(push) {
            change.id = -1;
            change.push_back = push;
            change.changing = true;
        },
        reset: function() {
            change.id = -1;
            change.name = "";
            change.data = "";
            change.changing = false;
        },
        switchType: function() {
            change.online = !change.online;
        }
    }

    var httpGet = function(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false);
        // false for synchronous request
        xmlHttp.send( null );
        return xmlHttp.responseText;
    }

    var runMod = r26_modloader.runMod = function(mod) {
        try {
            let data = mod.online ? httpGet(mod.data) : mod.data;
            (0, eval)(data);
        } catch(e) {
            console.error(e);
        }
    }

    r26_modloader.loadModInfo = function() {
        if(!window.commander) return;
        if(!commander.fleet.mods || commander.fleet.mods.length === 0) {
            // compat
            let localMods = JSON.parse(localStorage.getItem("mods")) || [];
            mods = localMods;
            r26_modloader.saveModInfo();
            localStorage.removeItem("mods");
        } else {
            mods = commander.fleet.mods || [];
        }

        // compat
        for(let mod of mods) {
            if(mod.type) {
                mod.online = mod.type === "online";
                delete mod.type;
            }
        }
    }

    r26_modloader.saveModInfo = function() {
        commander.fleet.mods = mods;
        account.rootSave();
    }

    r26_modloader.loadEnabledMods = function() {
        if(r26_modloader.loaded) return;
        mods.forEach(mod => {
            if(mod.enabled)
                runMod(mod);
        });
        r26_modloader.loaded = true;
    }

    ui.modManagerView = function() {
        ui.inScreen("menu", "Mods", function() {
            overflow_y("scroll");
            width(820);
            height(window.innerHeight);
            text_align("center");

            var editBox = function() {
                div(() => {
                    position("fixed");
                    top(window.innerHeight / 2 - 100);
                    left(window.innerWidth / 2 - 225);
                    width(450);
                    padding(20);
                    text_align("center");
                    background_color("rgba(0,0,0,.8)");
                    text("Name");
                    br();
                    textarea("#modname", () => {
                        width("100%");
                        margin(5);
                        background_color("rgba(0,0,0,.8)");
                        color("white");
                        text(change.name);
                        oninput(e => {
                            change.name = e.target.value;
                        });
                    });
                    br();
                    text(change.online ? "URL" : "Code");
                    br();
                    textarea("#moddata", () => {
                        width("100%");
                        margin(5);
                        background_color("rgba(0,0,0,.8)");
                        color("white");
                        text(change.data);
                        oninput(e => {
                            change.data = e.target.value;
                        });
                    });
                    br();
                    div(() => {
                        margin(5);
                        color("white");
                        text("Online ");
                        span(".hover-white", () => text(change.online ? "☑ " : "☐"));
                        onclick(e => {
                            change.switchType();
                        });
                    });
                    br();

                    div(() => {
                        padding(10);
                        span(".hover-white", () => {
                            text("Cancel");
                            text_align("center");
                            padding(10);
                            onclick(change.reset);
                        });
                        span(".hover-white", () => {
                            text("Done");
                            text_align("center");
                            padding(10);
                            onclick(e => {
                                if(change.data.trim().length != 0) {
                                    let mod = {
                                        name: change.name,
                                        data: change.data,
                                        online: change.online,
                                    }
                                    if(change.id >= 0) {
                                        mod.enabled = mods[change.id].enabled;
                                        mods[change.id] = mod;
                                    } else {
                                        mod.enabled = false;
                                        if(change.push_back)
                                            mods.push(mod);
                                        else
                                            mods.unshift(mod);
                                    }
                                    r26_modloader.saveModInfo(mods);
                                }

                                change.reset();
                            });
                        });
                    });
                });
            };

            text("To unload a mod, disable it, then restart Istrolid");

            let addBtn = function(push) {
                div(".hover-white", () => {
                    text("Add");
                    text_align("center");
                    padding(10);
                    margin(5);
                    onclick(e => {
                        change.add(push);
                    });
                });
            }

            addBtn(false);
            drawMod();
            addBtn(true);

            if(change.changing) {
                editBox();
            }
        });
    };

    var drawMod = function() {
        for(let mod of mods) {
            let index = mods.indexOf(mod);
            div(".hover-white", () => {
                position("relative");
                text_align("left");
                padding(5);
                padding_left(40);

                img(".hover-fade", {
                    src: "img/ui/upVote.png",
                    width: 16,
                    height: 16
                }, function() {
                    position("absolute");
                    top(5);
                    left(8);
                    onclick(function(e) {
                        let toSwap = index-1;
                        if(toSwap >= 0) {
                            tmp = mods[toSwap];
                            mods[toSwap] = mods[index];
                            mods[index] = tmp;
                        }
                    });
                });
                img(".hover-fade", {
                    src: "img/ui/downVote.png",
                    width: 16,
                    height: 16
                }, function() {
                    position("absolute");
                    top(28);
                    left(8);
                    onclick(function(e) {
                        let toSwap = index+1;
                        if(toSwap < mods.length) {
                            tmp = mods[toSwap];
                            mods[toSwap] = mods[index];
                            mods[index] = tmp;
                        }
                    });
                });

                text(mod.name);
                br();

                let data = mod.data;
                if(data.length > 32)
                    text(mod.data.substring(0, 32) + "...");
                else
                    text(mod.data);

                div(() => {
                    position("absolute");
                    top(8);
                    right(314);
                    padding(5);
                    text_align("right");
                    i(() => text(mod.online ? "Online" : "Local"));
                });

                div(".hover-black", () => {
                    position("absolute");
                    top(8);
                    right(234);
                    padding(5);
                    text_align("center");
                    text("Load");
                    onclick(e => {
                        runMod(mod);
                    });
                });

                div(".hover-black", () => {
                    position("absolute");
                    top(5);
                    right(154);
                    padding(8);
                    text_align("center");
                    if(mod.enabled) {
                        text("Disable");
                        onclick(e => {
                            mod.enabled = false;
                            r26_modloader.saveModInfo(mods);
                        });
                    } else {
                        text("Enable");
                        onclick(e => {
                            mod.enabled = true;
                            r26_modloader.saveModInfo(mods);
                        });
                    }
                });

                div(".hover-black", () => {
                    position("absolute");
                    top(5);
                    right(94);
                    padding(8);
                    text_align("center");
                    text("Edit");
                    onclick(e => {
                        change.edit(index);
                    });
                });

                div(".hover-black", () => {
                    position("absolute");
                    top(5);
                    right(14);
                    padding(8);
                    text_align("center");
                    text("Remove");
                    onclick(e => {
                        mods.splice(index, 1);
                        r26_modloader.saveModInfo(mods);
                    });
                });
            });
        }
    }

    var window_body_orig = window.body;
    window.body = function() {
        var ref;
        if (ui.error === "webGL") {
            webGLErrorMessage();
            return;
        }
        if (!(typeof baseAtlas !== "undefined" && baseAtlas !== null ? baseAtlas.ready : void 0) || !ui.loaded) {
            ui.loadingMessage();
            return;
        } else {
            document.body.style.backgroundColor = "#6B7375";
        }
        if (account.signedIn === false) {
            ui.mode === "authenticate";
            account.signinOrRegisterMenu();
            return;
        }
        if (!ui.show) {
            return;
        }

        if(ui.mode === "modMgmt") {
            ui.modManagerView();
        }

        return window_body_orig.call(this);
    }

    var ui_menu_orig = ui.menu;
    ui.menu = function() {
        var ret = ui_menu_orig.call(this);

        ui.div_hover_blur(() => {
            position("absolute");
            left(5);
            bottom(5);
            text_align("center");
            color("white");
            padding(5);
            div(() => raw_img({
                src: "img/ui/add@2x.png",
                width: 48,
                height: 48
            }));
            text("Mods");
            onclick(e => ui.go("modMgmt"));
        });

        return ret;
    }

}).call(this);

account.signinReply = function(rootPlayer) {
    var ret = r26_modloader.account_signinReply.call(this, rootPlayer);
    if(account.signedIn) {
        r26_modloader.loadModInfo();
        if(!onecup.params["r26-noautoload"]) {
            r26_modloader.loadEnabledMods();
        }
    }
    return ret;
}

setTimeout(r26_modloader.loadModInfo, 500);