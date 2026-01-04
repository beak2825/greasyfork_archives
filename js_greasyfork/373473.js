// ==UserScript==
// @name         OWOP BGPainter & Voider
// @namespace    *.ourworldofpixels.com/*
// @version      0.1.b1
// @description  By Armağan
// @author       Armağan
// @match        *.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373473/OWOP%20BGPainter%20%20Voider.user.js
// @updateURL https://update.greasyfork.org/scripts/373473/OWOP%20BGPainter%20%20Voider.meta.js
// ==/UserScript==

// Owner: voyage
// Edited By Armağan


var R = window.prompt("Void Color\n[R],G,B\n0 - 255","0"); // please don't touch anything :)
var G = window.prompt("Void Color\nR,[G],B\n0 - 255","0");
var B = window.prompt("Void Color\nR,G,[B]\n0 - 255","0");
alert("Color is set to " + R + ", " + G + ", " + B + "!");
alert("Edited by Armağan\n\n\n\n\nOwner: voyage")
var x1 = 0;
var y1 = 0;
var x2 = 0;
var y2 = 0;
function run()
{
    var running = setInterval(function() {
        for (var i = 0; i < Math.abs(x2 - x1); i++) {
            for (var j = 0; j < Math.abs(y2 - y1); j++) {
                if (OWOP.world.getPixel(i + x1, j + y1) != [R, G, B]) {
                    OWOP.world.setPixel(i + x1, j + y1, [R, G, B], false);
                }
            }
        }
    }, 1);
}
function openSeekbarWindow() {
    OWOP.windowSys.addWindow(new OWOP.windowSys.class.window("Color: " + R + ", " + G + ", " + B, {closeable: true}, function(win) {
        win.container.title = 'kek';
        win.container.style.height = 'auto';
        win.container.style.width = '150px';
        win.container.style.overflow = 'hidden';
        win.addObj(document.createTextNode('X1:'));
        var inputx1 = OWOP.util.mkHTML('input', {
            id: 'x1input',
            oninput: function() {
                x1 = parseInt(this.value);
            }
        });
        win.addObj(inputx1);
        win.addObj(document.createTextNode('Y1:'));
        var inputy1 = OWOP.util.mkHTML('input', {
            id: 'y1input',
            oninput: function() {
                y1 = parseInt(this.value);
            }
        });
        win.addObj(inputy1);
        win.addObj(document.createTextNode('X2:'));
        var inputx2 = OWOP.util.mkHTML('input', {
            id: 'x2input',
            oninput: function() {
                x2 = parseInt(this.value);
            }
        });
        win.addObj(inputx2);
        win.addObj(document.createTextNode('Y2:'));
        var inputy2 = OWOP.util.mkHTML('input', {
            id: 'y2input',
            oninput: function() {
                y2 = parseInt(this.value);
            }
        });
        win.addObj(inputy2);
        var button = OWOP.util.mkHTML('button', {
            id: 'voidbutton',
            innerHTML: '<big>Paint!</big>',
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
    }).move(window.innerWidth - 600, 32));
}

if (typeof OWOP != 'undefined') openSeekbarWindow();
window.addEventListener('load', function() {
    setTimeout(openSeekbarWindow, 1234);
});