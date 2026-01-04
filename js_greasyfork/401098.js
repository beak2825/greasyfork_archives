// ==UserScript==
// @name         Abs0rb.me Mod
// @namespace    http://tampermonkey.net/
// @version      1.8.7
// @description  Mod for Tricksplitting with Minions and more on abs0rb.me!
// @author       nyone
// @match        http://abs0rb.me/*
// @grant        none
// @run-at       document-end
// @icon         https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftoppng.com%2Fuploads%2Fthumbnail%2Fcowboy-emojis-for-discord-11549513500kpbvi9p8dy.png&f=1&nofb=1
// @downloadURL https://update.greasyfork.org/scripts/401098/Abs0rbme%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/401098/Abs0rbme%20Mod.meta.js
// ==/UserScript==
window.addEventListener('load', function() {
    const e = document.getElementById.bind(document);
    const f = document.getElementsByName("body");
    window.addEventListener('keydown', keydown);
    e("didyouknow").innerHTML = ('<p style="margin-top: 10px;">You need a Keybind in Settings Tab for 16-split, Minion 16-split for these to work.</p><p style="margin-top: 15px;">When you change Keybinds below reload the page for them to update!</p><button id="b"style="background-color: white;margin-top: 10px;margin-bottom: 15px;border: none;border-radius: 5px;outline: none;color: black;vertical-align: 3px;padding: 8px 16px;cursor: pointer;">Set Popsplit Delay</button>');
    e("didyouknowtext").innerHTML = ('<p>Press <select class="ss" id="tswpistb"> </select> to Tricksplit when bot is bigger than you</p><p>Press <select class="ss" id="dstswbibtp"> </select> to Double Split Tricksplit when bot is bigger than you</p><p>Press <select class="ss" id="tswbibtp"> </select> to Tricksplit when bot is smaller than you</p><p>Press <select class="ss" id="ps"> </select> to Popsplit</p>');
    e("client-panel-body").style = "height: 696px; color: #5bc0de; line-height: 1;";
    e("client-panel").style = "height: 740px;";
    const s = document.getElementsByClassName('ss');
    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '`', 'Alt', 'Shift', 'Control', 'Space'];
    for (let i = 0; i < s.length; i++) {
        for (let j = 0; j < options.length; j++) {
            const option = document.createElement("OPTION");
            option.innerText = options[j];
            s[i].appendChild(option)
        }
    }
    var keyBind1 = e("tswpistb");
    var keyBind1ID = keyBind1.options.selectedIndex;
    if (typeof localStorage.lastKeyBind1 === "undefined") {
        keyBind1ID = 10;
        e("tswpistb").options.selectedIndex = 10;
        localStorage.lastKeyBind1 = keyBind1ID
    } else {
        e("tswpistb").options.selectedIndex = localStorage.lastKeyBind1;
        keyBind1 = e("tswpistb");
        keyBind1ID = keyBind1.options.selectedIndex;
        var keyBind1KC = "";
        var keyBind1Key = keyBind1.options[keyBind1ID].value;
        if (keyBind1Key == "Space") {
            keyBind1KC = 32
        } else if (keyBind1Key == "Alt") {
            keyBind1KC = 18
        } else if (keyBind1Key == "Control") {
            keyBind1KC = 17
        } else if (keyBind1Key == "Shift") {
            keyBind1KC = 16
        } else if (keyBind1Key == "`") {
            keyBind1KC = 192
        } else {
            keyBind1KC = keyBind1Key.charCodeAt(0)
        }
    }
    keyBind1.addEventListener("change", function(e) {
        var keyBind1ID = keyBind1.options.selectedIndex;
        localStorage.lastKeyBind1 = keyBind1ID
    });
    var keyBind2 = e("dstswbibtp");
    var keyBind2ID = keyBind2.options.selectedIndex;
    if (typeof localStorage.lastKeyBind2 === "undefined") {
        keyBind2ID = 12;
        e("dstswbibtp").options.selectedIndex = 12;
        localStorage.lastKeyBind2 = keyBind2ID
    } else {
        e("dstswbibtp").options.selectedIndex = localStorage.lastKeyBind2;
        keyBind2 = e("dstswbibtp");
        keyBind2ID = keyBind2.options.selectedIndex;
        var keyBind2KC = "";
        var keyBind2Key = keyBind2.options[keyBind2ID].value;
        if (keyBind2Key == "Space") {
            keyBind2KC = 32
        } else if (keyBind2Key == "Alt") {
            keyBind2KC = 18
        } else if (keyBind2Key == "Control") {
            keyBind2KC = 17
        } else if (keyBind2Key == "Shift") {
            keyBind2KC = 16
        } else if (keyBind2Key == "`") {
            keyBind2KC = 192
        } else {
            keyBind2KC = keyBind2Key.charCodeAt(0)
        }
    }
    keyBind2.addEventListener("change", function(e) {
        var keyBind2ID = keyBind2.options.selectedIndex;
        localStorage.lastKeyBind2 = keyBind2ID
    });
    var keyBind3 = e("tswbibtp");
    var keyBind3ID = keyBind3.options.selectedIndex;
    if (typeof localStorage.lastKeyBind3 === "undefined") {
        keyBind3ID = 38;
        e("tswbibtp").options.selectedIndex = 38;
        localStorage.lastKeyBind3 = keyBind3ID
    } else {
        e("tswbibtp").options.selectedIndex = localStorage.lastKeyBind3;
        keyBind3 = e("tswbibtp");
        keyBind3ID = keyBind3.options.selectedIndex;
        var keyBind3KC = "";
        var keyBind3Key = keyBind3.options[keyBind3ID].value;
        if (keyBind3Key == "Space") {
            keyBind3KC = 32
        } else if (keyBind3Key == "Alt") {
            keyBind3KC = 18
        } else if (keyBind3Key == "Control") {
            keyBind3KC = 17
        } else if (keyBind3Key == "Shift") {
            keyBind3KC = 16
        } else if (keyBind3Key == "`") {
            keyBind3KC = 192
        } else {
            keyBind3KC = keyBind3Key.charCodeAt(0)
        }
    }
    keyBind3.addEventListener("change", function(e) {
        var keyBind3ID = keyBind3.options.selectedIndex;
        localStorage.lastKeyBind3 = keyBind3ID
    });
    var keyBind4 = e("ps");
    var keyBind4ID = keyBind4.options.selectedIndex;
    if (typeof localStorage.lastKeyBind4 === "undefined") {
        keyBind4ID = 29;
        e("ps").options.selectedIndex = 29;
        localStorage.lastKeyBind4 = keyBind4ID
    } else {
        e("ps").options.selectedIndex = localStorage.lastKeyBind4;
        keyBind4 = e("ps");
        keyBind4ID = keyBind4.options.selectedIndex;
        var keyBind4KC = "";
        var keyBind4Key = keyBind4.options[keyBind4ID].value;
        if (keyBind4Key == "Space") {
            keyBind4KC = 32
        } else if (keyBind4Key == "Alt") {
            keyBind4KC = 18
        } else if (keyBind4Key == "Control") {
            keyBind4KC = 17
        } else if (keyBind4Key == "Shift") {
            keyBind4KC = 16
        } else if (keyBind4Key == "`") {
            keyBind4KC = 192
        } else {
            keyBind4KC = keyBind4Key.charCodeAt(0)
        }
    }
    keyBind4.addEventListener("change", function(e) {
        var keyBind4ID = keyBind4.options.selectedIndex;
        localStorage.lastKeyBind4 = keyBind4ID
    });
    var splitKeyCode = "";
    var splitKey = e('keybind-split').innerHTML;
    if (splitKey == "Space") {
        splitKeyCode = 32
    } else if (splitKey == "Alt") {
        splitKeyCode = 18
    } else if (splitKey == "Control") {
        splitKeyCode = 17
    } else if (splitKey == "Shift") {
        splitKeyCode = 16
    } else if (splitKey == "`") {
        splitKeyCode = 192
    } else {
        splitKeyCode = splitKey.charCodeAt(0)
    }
    var botSplitKeyCode = "";
    var botSplitKey = e('keybind-msplit').innerHTML;
    if (botSplitKey == "Space") {
        botSplitKeyCode = 32
    } else if (botSplitKey == "Alt") {
        botSplitKeyCode = 18
    } else if (botSplitKey == "Control") {
        botSplitKeyCode = 17
    } else if (botSplitKey == "Shift") {
        botSplitKeyCode = 16
    } else if (botSplitKey == "`") {
        botSplitKeyCode = 192
    } else {
        botSplitKeyCode = botSplitKey.charCodeAt(0)
    }
    var split16KeyCode = "";
    var split16Key = e('keybind-quad').innerHTML;
    if (split16Key == "Space") {
        split16KeyCode = 32
    } else if (split16Key == "Alt") {
        split16KeyCode = 18
    } else if (split16Key == "Control") {
        split16KeyCode = 17
    } else if (split16Key == "Shift") {
        split16KeyCode = 16
    } else if (split16Key == "`") {
        split16KeyCode = 192
    } else {
        split16KeyCode = split16Key.charCodeAt(0)
    }
    var botSplit16KeyCode = "";
    var botSplit16Key = e('keybind-mquad').innerHTML;
    if (botSplit16Key == "Space") {
        botSplit16KeyCode = 32
    } else if (botSplit16Key == "Alt") {
        botSplit16KeyCode = 18
    } else if (botSplit16Key == "Control") {
        botSplit16KeyCode = 17
    } else if (botSplit16Key == "Shift") {
        botSplit16KeyCode = 16
    } else if (botSplit16Key == "`") {
        botSplit16KeyCode = 192
    } else {
        botSplit16KeyCode = botSplit16Key.charCodeAt(0)
    }

    function split() {
        $("body").trigger($.Event("keydown", {
            keyCode: splitKeyCode
        }));
        $("body").trigger($.Event("keyup", {
            keyCode: splitKeyCode
        }))
    }

    function botsplit() {
        $("body").trigger($.Event("keydown", {
            keyCode: botSplitKeyCode
        }));
        $("body").trigger($.Event("keyup", {
            keyCode: botSplitKeyCode
        }))
    }

    function split16() {
        $("body").trigger($.Event("keydown", {
            keyCode: split16KeyCode
        }));
        $("body").trigger($.Event("keyup", {
            keyCode: split16KeyCode
        }))
    }

    function doublesplit() {
        $("body").trigger($.Event("keydown", {
            keyCode: splitKeyCode
        }));
        setTimeout(split, 160);
        $("body").trigger($.Event("keyup", {
            keyCode: splitKeyCode
        }))
    }

    function botSplit16() {
        $("body").trigger($.Event("keydown", {
            keyCode: botSplit16KeyCode
        }));
        $("body").trigger($.Event("keyup", {
            keyCode: botSplit16KeyCode
        }))
    }
    var popsplitDelay = 160;
    if (typeof localStorage.lastPopsplitDelay === "undefined") {
        localStorage.lastPopsplitDelay = popsplitDelay
    } else {
        popsplitDelay = localStorage.lastPopsplitDelay
    }
    e("b").addEventListener("click", function() {
        localStorage.lastPopsplitDelay = prompt("Enter Popsplit Delay in MS (1000 MS = 1 second)")
    });

    function keydown(event) {
        if (event.keyCode == keyBind1KC) {
            botSplit16();
            setTimeout(split, 80);
            setTimeout(botSplit16, 160);
            setTimeout(botSplit16, 160);
            setTimeout(botSplit16, 160)
        }
        if (event.keyCode == keyBind2KC) {
            split();
            setTimeout(split, 80);
            botSplit16();
            setTimeout(botSplit16, 80);
            setTimeout(botSplit16, 80);
            setTimeout(botSplit16, 80)
        }
        if (event.keyCode == keyBind3KC) {
            botsplit();
            split16();
            setTimeout(split16, 80);
            setTimeout(split16, 80);
            setTimeout(split16, 80)
        }
        if (event.keyCode == keyBind4KC) {
            split();
            setTimeout(split, localStorage.lastPopsplitDelay)
        }
    }
}, false);