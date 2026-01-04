// 0.2: Obfuscation removed (-4500 bytes), improved menu options
// 0.3: Added zoom seekbar, fix teleport X and Y being inverted
// 0.4: Added rainbow mode, fixed trackpad history scroll bug (an OWOP bug)
// 0.5.0: Switched to semantic versioning (semver)
// 0.5.1: Removed zoom (added to OWOT itself), added warning for execute code

// ==UserScript==
// @name         OWOT Extras
// @namespace    https://greasyfork.org/users/200700
// @version      0.5.1
// @description  Improves & Adds more stuff to the menu (rainbow,paint,paste,teleport,js) and fixes a bug
// @author       SuperOP535
// @match        *.ourworldoftext.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371327/OWOT%20Extras.user.js
// @updateURL https://update.greasyfork.org/scripts/371327/OWOT%20Extras.meta.js
// ==/UserScript==

(function() {
    window.addEventListener('wheel', function (e) { e.preventDefault(); });
    var _writeChar = writeChar;
    function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min)) + min;}
    writeChar = function(a, b) {
        if(rainbowmode) YourWorld.Color = getRandomInt(0, 16777216);
        _writeChar(a, b);
    };
    var paintmode = false, rainbowmode = false;
    var char = '█';
    document.addEventListener('mouseup', function(e) {
        if(!paintmode) return;
        writeChar(char, true);
    });
    var nav = document.getElementById('nav');
    nav.style.width = '150px';
    nav.style.textAlign = 'center';
    menu.addCheckboxOption(' Allow paste', function(){Permissions.can_paste = function(){return true;};},
                           function(){Permissions.can_paste = function(){return false;};});
    menu.addCheckboxOption(' Paint mode', function(){paintmode = true;}, function(){paintmode = false;});
    menu.addCheckboxOption(' Rainbow mode', function(){rainbowmode = true;}, function(){rainbowmode = false;});
    menu.addOption('Change paint char', function() {
        var c = prompt('Enter character', char);
        char = c.slice(0,1) || char;
    });
    menu.addOption('Teleport', function() {
        var x = +prompt('Enter X coordinate'), y = +prompt('Enter Y coordinate');
        if(isNaN(x)) return alert('Invalid X coordinate');
        if(isNaN(y)) return alert('Invalid Y coordinate');
        w.doGoToCoord(y, x);
    });
    menu.addOption('Execute code', function() {
        var code = prompt('Enter JavaScript code. **Don\'t paste anything random!**');
        if(!code) return;
        try {
            alert(eval(code));
        } catch(e) {
            alert('Error: ' + e);
        }
    });
})();