// Made by voyager, improved by Armağan
// ==UserScript==
// @name         OWOP voider for ourworldofpixels
// @match        *.ourworldofpixels.com/*
// @description Automatically voids an area you specify. Cursor movements are currently not supported
// @version 1.7
// @namespace https://greasyfork.org/users/220233
// @downloadURL https://update.greasyfork.org/scripts/373407/OWOP%20voider%20for%20ourworldofpixels.user.js
// @updateURL https://update.greasyfork.org/scripts/373407/OWOP%20voider%20for%20ourworldofpixels.meta.js
// ==/UserScript==
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
var r;
var g;
var b;
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
function run()
{
    var running = setInterval(function() {
        loop:
        for (var i = 0; i < Math.abs(x2 - x1); i++) {
            for (var j = 0; j < Math.abs(y2 - y1); j++) {
                if (OWOP.world.getPixel(i + x1, j + y1)[0] != r && OWOP.world.getPixel(i + x1, j + y1)[1] != g && OWOP.world.getPixel(i + x1, j + y1)[2] != b) {
                    if((i + x1)<=(OWOP.mouse.tileX+30) && (i + x1)>=(OWOP.mouse.tileX-30) && (j + y1)>=(OWOP.mouse.tileY-30) && (j + y1)<=(OWOP.mouse.tileY+30))
                    {
                        OWOP.world.setPixel(i + x1, j + y1, [r, g, b], false)
                        break loop;
                    }
                }
            }
        }
    }, 1);
}
function openSeekbarWindow() {
    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window('VOIDER BY VOYAGER', {}, function(win) {
        win.container.title = 'Voids an area';
        win.container.style.height = 'auto';
        win.container.style.width = '100px';
        win.container.style.overflow = 'hidden';
        win.addObj(document.createTextNode('X1 : '));
        var inputx1 = OWOP.util.mkHTML('input', {
            id: 'x1input',
            oninput: function() {
                x1 = parseInt(this.value);
            }
        });
        win.addObj(inputx1);
        win.addObj(document.createTextNode('Y1 : '));
        var inputy1 = OWOP.util.mkHTML('input', {
            id: 'y1input',
            oninput: function() {
                y1 = parseInt(this.value);
            }
        });
        win.addObj(inputy1);
        win.addObj(document.createTextNode('X2 : '));
        var inputx2 = OWOP.util.mkHTML('input', {
            id: 'x2input',
            oninput: function() {
                x2 = parseInt(this.value);
            }
        });
        win.addObj(inputx2);
        win.addObj(document.createTextNode('Y2 : '));
        var inputy2 = OWOP.util.mkHTML('input', {
            id: 'y2input',
            oninput: function() {
                y2 = parseInt(this.value);
            }
        });
        win.addObj(inputy2);
        win.addObj(document.createTextNode('Color : '));
        var colorin = OWOP.util.mkHTML('input', {
            type: 'color',
            id: 'voidcolor',
            onchange: function() {
                r = hexToRgb(this.value).r;
                g = hexToRgb(this.value).g;
                b = hexToRgb(this.value).b;
            }
        });
        win.addObj(colorin);
        var button = OWOP.util.mkHTML('button', {
            id: 'voidbutton',
            innerHTML: 'Void!',
            onclick: function() {
                if (document.getElementById("x1input").value != "") {
                    if (document.getElementById("y1input").value != "") {
                        if (document.getElementById("x2input").value != "") {
                            if (document.getElementById("y2input").value != "") {
                                run();
                            }
                        }
                    }
                }
            }
        });
        win.addObj(button);
    }).move(window.innerWidth - 500, 32));
}

if (typeof OWOP != 'undefined') openSeekbarWindow();
window.addEventListener('load', function() {
    setTimeout(openSeekbarWindow, 1234);
});