// ==UserScript==
// @name nOwOtify
// @description Yes
// @namespace Violentmonkey Scripts
// @match *://*/*
// @grant none
// @run-at document-start
// @version 0.1
// @downloadURL https://update.greasyfork.org/scripts/387901/nOwOtify.user.js
// @updateURL https://update.greasyfork.org/scripts/387901/nOwOtify.meta.js
// ==/UserScript==

(function() {
    // Basically taken/modified from: https://github.com/Nepeta/OwO/blob/master/Tweak/Tweak.xm
    var prefixes = {
        "furry": ["", "OwO ", "H-hewwo?? ", "Huohhhh. ", "Haiiii! ", "UwU ", "OWO ", "HIIII! ", "<3 "]
    };
    
    var suffixes = {
        "furry": ["", " :3", " UwU", " ʕʘ‿ʘʔ", " >_>", " ^_^", "..", /*" Huoh.",*/ " ^-^", " ;_;", " ;-;", " xD", " x3", " :D", " :P", " ;3", " XDDD", ", fwendo", " ㅇㅅㅇ", " (人◕ω◕)", "（＾ｖ＾）", /*" Sigh.",*/ " >_<", " ><"]
    };
    
    var replacements = {
        "furry": {
            "r": "w",
            "l": "w",
            "R": "W",
            "L": "W",
            "ow": "OwO",
            "no": "nu",
            "No": "Nu",
            "has": "haz",
            "Has": "Haz",
            "have": "haz",
            "Have": "Haz",
            "you": "uu",
            "You": "U",
            "the ": ["da ", "de "],
            "The ": ["Da ", "De "],
            "these": "dez",
            "These": "Dez",
            "this": "dis",
            "This": "Dis",
            "your": "ur",
            "Your": "Ur",
            "you're": "ur",
            "You're": "Ur",
            "hi ": "hai ",
            "Hi ": "Hai ",
            "please": ["plz", "pwease"],
            "Please": ["Plz", "Pwease"],
            "friend": ["fwendo", "fwend", "fwiend"],
            "Friend": ["Fwendo", "Fwend", "Fwiend"]
        }
    }
    
    function irand(num) {
        return Math.floor(Math.random() * num)|0;
    }
    
    function pick(list) {
        return list[irand(list.length)];
    }
    
    function owoify_repl(msg) {
        var owoed = "";
        for (var i = 0; i < msg.length; i++) {
            var found = false;
            for (var rep in replacements["furry"]) {
                if (msg.substr(i, rep.length) === rep) {
                    var repl = replacements["furry"][rep];
                    if (repl instanceof Array)
                        repl = pick(repl);
                    owoed += repl;
                    found = true;
                    i += rep.length - 1;
                    break;
                }
            }
            
            if (!found) {
                var lastchar = (i + 1) == msg.length;
                if (!lastchar) {
                    if (/[- .!@#$%^&*()\|]/.test(msg[i+1]))
                        lastchar = true;
                }

                owoed += msg[i];
                if (lastchar && /[saeiouy!?]/.test(msg[i])) {
                    var randadd = irand(6) - 3;
                    if (randadd > 0) {
                        for (var j = 0; j < randadd; j++) {
                            owoed += msg[i];
                        }
                    }
                }
            }
        }
        
        return owoed;
    }
    
    function owoify_full(msg) {
        msg = owoify_repl(msg);
        
        if (irand(3) == 0)
            msg = pick(prefixes["furry"]) + msg;
        if (irand(2) == 0)
            msg += pick(suffixes["furry"]);
        return msg;
    }
    
    var oldnotif = window.Notification;
    window.Notification = class Nowotification extends oldnotif {
        constructor(title, options) {
            if (options && options.body)
                options.body = owoify_full(options.body);
            super(owoify_full(title), options)
        }
    };
    
    // For testing
    //window.owo = owoify_full;
})();