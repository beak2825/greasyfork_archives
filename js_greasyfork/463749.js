// ==UserScript==
// @name         New Brofistio Cheats
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  Brofist.io Hack
// @author       Troll
// @match        http://brofist.io/modes/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463749/New%20Brofistio%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/463749/New%20Brofistio%20Cheats.meta.js
// ==/UserScript==
 
/*
 * Authored by CuteLifeBot
 * Updated by Troll
 * 10 December 2017
 */
 
(function() {
 
    var oldGravity = -9.77;
    var zoomCoeff = 1600;
    var verts = [];
    var imgURLText = "";
    var smallestDiff;
    var closestColour;
    window.denyNormalness = false;
 
    // Minimap Coefficients
    var MC = {
        x: {
            p: [
                41,
                4110
            ],
            a: [
                -151.68,
                930.08
            ]
        },
        y: {
            p: [
                74,
                691
            ],
            a: [
                26.64,
                -137.46
            ]
        },
        width: 5168,
        height: 1016
    };
 
    mode = false;
 
    function waitForPlay() {
        if(!mode) {
            setTimeout(waitForPlay, 500);
            return;
        }
 
        if(mode.player === undefined) {
            setTimeout(waitForPlay, 500);
            return;
        }
 
        if(mode.player.gpData === undefined) {
            setTimeout(waitForPlay, 500);
            return;
        }
 
        if(mode.player.gpData.p === undefined) {
            setTimeout(waitForPlay, 500);
            return;
        }
 
        doCheats();
    }
 
    function doCheats() {
        console.log("Added cheats!");
 
        // Print in console the key name
        var keyNameDebug = false;
 
        ////// LEFT
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num4", function(e) {
                if (keyNameDebug) console.log("Left Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("Left Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[0] += -0.03;
            }, 10);
        })();
        ////// RIGHT
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num6", function(e) {
                if (keyNameDebug) console.log("Right Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("Right Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[0] += 0.03;
            }, 10);
        })();
        ////// UP
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num8", function(e) {
                if (keyNameDebug) console.log("Up Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("Up Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[1] += 0.03;
            }, 10);
        })();
        ////// DOWN
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num5", function(e) {
                if (keyNameDebug) console.log("Down Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("Down Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[1] += -0.03;
            }, 10);
        })();
 
 
        ////// SUPER UP
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num/", function(e) {
                if (keyNameDebug) console.log("SuperUp Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("SuperUp Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[1] += 0.15;
            }, 10);
        })();
        ////// SUPER DOWN
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num2", function(e) {
                if (keyNameDebug) console.log("SuperDown Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("SuperDown Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[1] += -0.15;
            }, 10);
        })();
        ////// SUPER LEFT
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num1", function(e) {
                if (keyNameDebug) console.log("SuperLeft Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("SuperLeft Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                };
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[0] += -0.15;
            }, 10);
        })();
        ////// SUPER RIGHT
        (function() {
            var repeat = 0;
            var pastFirst = false;
 
            window.keyboardJS.bind("num3", function(e) {
                if (keyNameDebug) console.log("SuperRight Down");
                (repeat = 1);
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
            }, function(e) {
                if (keyNameDebug) console.log("SuperRight Up");
                (repeat = 0, 1) && resetNormalness();
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            setInterval(function() {
                if (!repeat) {
                    return;
                }
                mode.player.gpData.p.world.gravity = [0, 0];
                mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
                mode.player.gpData.p.position[0] += 0.15;
            }, 10);
        })();
 
        // Text box functions
        (function() {
            // Prepend html
            // imgur / ptZVIHV alternative
            var textHtml="";
            textHtml += "<div id=\"cheats\" style=\"position: absolute; background-color: lightgrey; padding: 5px;\">";
            textHtml += "    X: <input type=\"text\" id=\"positionX\" maxlength=\"8\" size=\"10\"><br\/>";
            textHtml += "    Y: <input type=\"text\" id=\"positionY\" maxlength=\"8\" size=\"10\"><hr\/>";
            textHtml += "    <input type=\"checkbox\" id=\"minimapcb\"> minimap<br\/>";
            textHtml += "    <input type=\"checkbox\" id=\"gravitycb\"> gravity<br\/>";
            textHtml += "    <input type=\"checkbox\" id=\"noclipcb\"> noclip<hr\/>";
            textHtml += "    Say: <input type=\"text\" id=\"msgSay\" size=\"10\"><hr\/>";
            textHtml += "    <input type=\"checkbox\" id=\"degrees\"> 180 degrees skin<br\/>";
            textHtml += "    <input type=\"checkbox\" id=\"ghost\"> ghost<br\/>";
            textHtml += "    NC: <input type=\"checkbox\" id=\"redNick\">R<input type=\"checkbox\" id=\"greenNick\">G<input type=\"checkbox\" id=\"blueNick\">B<input type=\"checkbox\" id=\"lightblueNick\">LB<input type=\"checkbox\" id=\"yellowNick\">Y<br\/>";
            textHtml += "    CC: <input type=\"checkbox\" id=\"redChat\">R<input type=\"checkbox\" id=\"greenChat\">G<input type=\"checkbox\" id=\"blueChat\">B<input type=\"checkbox\" id=\"lightblueChat\">LB<input type=\"checkbox\" id=\"yellowChat\">Y<br\/>";
            textHtml += "    NTA: <input type=\"checkbox\" id=\"A_ctfs\">45<input type=\"checkbox\" id=\"B_ctfs\">135<input type=\"checkbox\" id=\"C_ctfs\">180<br\/>";
            textHtml += "    CTA: <input type=\"checkbox\" id=\"D_ctfs\">45<input type=\"checkbox\" id=\"E_ctfs\">135<input type=\"checkbox\" id=\"F_ctfs\">180<br\/>";
            textHtml += "    NFS: <input type=\"checkbox\" id=\"Nck_A\">A<input type=\"checkbox\" id=\"Nck_B\">B<input type=\"checkbox\" id=\"Nck_C\">C<br\/>";
            textHtml += "    CFS: <input type=\"checkbox\" id=\"Cht_A\">A<input type=\"checkbox\" id=\"Cht_B\">B<input type=\"checkbox\" id=\"Cht_C\">C<br\/>";;
            textHtml += "    <a href=\"https:\/\/gist.github.com\/CuteLifeBot\/f509039ff6259baa32473a362fcda2cf\" style=\"position: relative; float: right; text-decoration: none;\">Help<\/a>";
            textHtml += "<\/div>";
            textHtml += "<div id=\"minimap\" style=\"position: fixed; top: 0; right: 0; width: 50%\">";
            textHtml += "    <img id=\"minimapimg\" src=\"http:\/\/i.imgur.com\/fjM6WpB.png\" width=\"100%\" height=\"100%\" style=\"position: relative; top: 0; left: 0;\"\/>";
            textHtml += "    <svg id=\"minimapsvg\" width=\"100%\" height=\"100%\" style=\"position: absolute; top: 0; left: 0; z-index: 1;\">";
            textHtml += "    <circle id=\"posMarker\" cx=\"0\" cy=\"0\" r=\"3\" stroke=\"red\" stroke-width=\"2\" fill=\"black\"><\/circle>";
            textHtml += "    <\/svg>";
            textHtml += "<\/div>";
            document.body.insertBefore(createFragment(textHtml), document.body.childNodes[0]);
            // Done prepending html
 
            window.keyboardJS.bind("enter", function(e) {
                if(document.getElementById("positionX") === document.activeElement) {
                    document.getElementById("positionY").focus();
                    document.getElementById("positionY").select();
                } else if(document.getElementById("positionY") === document.activeElement) {
                    document.getElementById("positionY").blur();
                    mode.player.gpData.p.position = [
                        parseFloat(document.getElementById("positionX").value) || -75,
                        parseFloat(document.getElementById("positionY").value) || 0
                    ];
                }
            });
 
            window.keyboardJS.bind("esc", function(e) {
                document.getElementById("positionX").focus();
                document.getElementById("positionX").select();
            });
 
            window.keyboardJS.bind("alt", function(e) {
                if(document.getElementById("msgSay") === document.activeElement) {
                    document.getElementById("positionY").blur();
 
                    var text = document.getElementById("msgSay").value;
 
                    mode.updateChatText(text, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [text];
                }
            });
 
            setInterval(function() {
                if (!positionFocused()) {
                    document.getElementById("positionX").value = mode.player.gpData.p.position[0].toFixed(2);
                    document.getElementById("positionY").value = mode.player.gpData.p.position[1].toFixed(2);
                }
            }, 100);
        })();
 
        // Minimap functions
        (function () {
            var pastFirst = false;
 
            // Toggle minimap with "7" on numpad
            window.keyboardJS.bind("num7", function(e) {
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
                if (document.getElementById('minimapcb').checked) {
                    document.getElementById("minimap").style.display = "none";
                    document.getElementById("minimap").style.visibility = "hidden";
                } else {
                    document.getElementById("minimap").style.display = "";
                    document.getElementById("minimap").style.visibility = "visible";
                }
                document.getElementById('minimapcb').checked = !document.getElementById('minimapcb').checked;
            }, function(e) {
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            document.getElementById("minimap").style.display = "none";
            document.getElementById("minimap").style.visibility = "hidden";
 
            setInterval(function() {
                if (document.getElementById('minimapcb').checked) {
                    updateMinimapPosition();
                }
            }, 100);
        })();
 
        // Gravity toggle
        (function () {
            var pastFirst = false;
 
            // Toggle gravity with "9" on numpad
            window.keyboardJS.bind("num9", function(e) {
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
 
                enableGravity(document.getElementById('gravitycb').checked);
                document.getElementById('gravitycb').checked = !document.getElementById('gravitycb').checked;
            }, function(e) {
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            document.getElementById('gravitycb').checked = true;
        })();
 
        // Noclip toggle
        (function () {
            var pastFirst = false;
 
            // Toggle noclip with "0" on numpad
            window.keyboardJS.bind("num0", function(e) {
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
 
                enableNoclip(!document.getElementById('noclipcb').checked);
                document.getElementById('noclipcb').checked = !document.getElementById('noclipcb').checked;
            }, function(e) {
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            document.getElementById('gravitycb').checked = true;
        })();
 
        // Degrees toggle
        (function () {
            var pastFirst = false;
 
            // Toggle degrees with "*" on numpad
            window.keyboardJS.bind("Insert", function(e) {
                if (pastFirst) {
                    mode.updateChatText(8, mode.player.gpData.chat);
                    mode.player.gpData.chatBuffer = [8];
                }
                pastFirst = true;
 
                degrees(!document.getElementById('degrees').checked);
                document.getElementById('degrees').checked = !document.getElementById('degrees').checked;
            }, function(e) {
                mode.updateChatText(8, mode.player.gpData.chat);
                mode.player.gpData.chatBuffer = [8];
                pastFirst = false;
            });
 
            document.getElementById('gravitycb').checked = true;
        })();
 
        // Toggle minimap
        document.getElementById('minimapcb').onclick = function() {
            if (document.getElementById('minimapcb').checked) {
                document.getElementById("minimap").style.display = "";
                document.getElementById("minimap").style.visibility = "visible";
                document.getElementById('minimapcb').blur();
            } else {
                document.getElementById("minimap").style.display = "none";
                document.getElementById("minimap").style.visibility = "hidden";
                document.getElementById('minimapcb').blur();
            }
        };
 
        // Toggle gravity
        document.getElementById('gravitycb').onclick = function() {
            enableGravity(!document.getElementById('gravitycb').checked);
            document.getElementById('gravitycb').blur();
        };
 
        // Toggle noclip
        document.getElementById('noclipcb').onclick = function() {
            enableNoclip(document.getElementById('noclipcb').checked);
            document.getElementById('noclipcb').blur();
        };
 
        // Toggle degrees
        document.getElementById('degrees').onclick = function() {
            degrees(document.getElementById('degrees').checked);
            document.getElementById('degrees').blur();
        };
 
        // Toggle redNick
        document.getElementById('redNick').onclick = function() {
            redNick(document.getElementById('redNick').checked);
            document.getElementById('redNick').blur();
        };
 
        // Toggle greenNick
        document.getElementById('greenNick').onclick = function() {
            greenNick(document.getElementById('greenNick').checked);
            document.getElementById('greenNick').blur();
        };
 
        // Toggle blueNick
        document.getElementById('blueNick').onclick = function() {
            blueNick(document.getElementById('blueNick').checked);
            document.getElementById('blueNick').blur();
        };
 
        // Toggle lightblueNick
        document.getElementById('lightblueNick').onclick = function() {
            lightblueNick(document.getElementById('lightblueNick').checked);
            document.getElementById('lightblueNick').blur();
        };
 
        // Toggle yellowNick
        document.getElementById('yellowNick').onclick = function() {
            yellowNick(document.getElementById('yellowNick').checked);
            document.getElementById('yellowNick').blur();
        };
 
        // Toggle redNick
        document.getElementById('redChat').onclick = function() {
            redChat(document.getElementById('redChat').checked);
            document.getElementById('redChat').blur();
        };
 
        // Toggle greenNick
        document.getElementById('greenChat').onclick = function() {
            greenChat(document.getElementById('greenChat').checked);
            document.getElementById('greenChat').blur();
        };
 
        // Toggle blueNick
        document.getElementById('blueChat').onclick = function() {
            blueChat(document.getElementById('blueChat').checked);
            document.getElementById('blueChat').blur();
        };
 
        // Toggle lightblueNick
        document.getElementById('lightblueChat').onclick = function() {
            lightblueChat(document.getElementById('lightblueChat').checked);
            document.getElementById('lightblueChat').blur();
        };
 
        // Toggle yellowNick
        document.getElementById('yellowChat').onclick = function() {
            yellowChat(document.getElementById('yellowChat').checked);
            document.getElementById('yellowChat').blur();
        };
 
        // Toggle ctfs
        document.getElementById('A_ctfs').onclick = function() {
            A_ctfs(document.getElementById('A_ctfs').checked);
            document.getElementById('A_ctfs').blur();
        };
 
        // Toggle ctfs
        document.getElementById('B_ctfs').onclick = function() {
            B_ctfs(document.getElementById('B_ctfs').checked);
            document.getElementById('B_ctfs').blur();
        };
 
        // Toggle ctfs
        document.getElementById('C_ctfs').onclick = function() {
            C_ctfs(document.getElementById('C_ctfs').checked);
            document.getElementById('C_ctfs').blur();
        };
 
        // Toggle ctfs
        document.getElementById('D_ctfs').onclick = function() {
            D_ctfs(document.getElementById('D_ctfs').checked);
            document.getElementById('D_ctfs').blur();
        };
 
        // Toggle ctfs
        document.getElementById('E_ctfs').onclick = function() {
            E_ctfs(document.getElementById('E_ctfs').checked);
            document.getElementById('E_ctfs').blur();
        };
 
        // Toggle ctfs
        document.getElementById('F_ctfs').onclick = function() {
            F_ctfs(document.getElementById('F_ctfs').checked);
            document.getElementById('F_ctfs').blur();
        };
 
        // Toggle NCK
        document.getElementById('Nck_A').onclick = function() {
            Nck_A(document.getElementById('Nck_A').checked);
            document.getElementById('Nck_A').blur();
        };
 
        // Toggle NCK2
        document.getElementById('Nck_B').onclick = function() {
            Nck_B(document.getElementById('Nck_B').checked);
            document.getElementById('Nck_B').blur();
        };
 
        // Toggle NCK3
        document.getElementById('Nck_C').onclick = function() {
            Nck_C(document.getElementById('Nck_C').checked);
            document.getElementById('Nck_C').blur();
        };
 
        // Toggle CHT1
        document.getElementById('Cht_A').onclick = function() {
            Cht_A(document.getElementById('Cht_A').checked);
            document.getElementById('Cht_A').blur();
        };
 
        // Toggle CHT2
        document.getElementById('Cht_B').onclick = function() {
            Cht_B(document.getElementById('Cht_B').checked);
            document.getElementById('Cht_B').blur();
        };
 
        // Toggle CHT3
        document.getElementById('Cht_C').onclick = function() {
            Cht_C(document.getElementById('Cht_C').checked);
            document.getElementById('Cht_C').blur();
        };
 
        // Toggle ghost
        document.getElementById('ghost').onclick = function() {
            ghost(document.getElementById('ghost').checked);
            document.getElementById('ghost').blur();
        };
 
 
        // Minimap handle clicks
        document.getElementById('minimap').onmouseup = function(e) {
            var relative_pixel_pos = getRelativeXY(e, 'minimap');
            warpToLocation(relative_pixel_pos);
        };
 
    }
 
    function enableGravity(on) {
        if (on) {
            mode.player.gpData.p.world.gravity = [0, 0];
            mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = false;
            mode.ghost = !0;
            window.denyNormalness = true;
        } else {
            if (mode.player.gpData.getAlpha() == 1) mode.ghost = !1;
            window.denyNormalness = false;
            resetNormalness();
        }
    }
 
    function enableNoclip(on) {
        if (on) {
            mode.player.gpData.p.shapes[0].vertices = [0];
        } else {
            mode.player.gpData.p.shapes[0].vertices = [[-0.15000000596046448, -0.5], [0.15000000596046448, -0.5], [0.15000000596046448, 0.5], [-0.15000000596046448, 0.5]];
        }
    }
 
    function degrees(on) {
        if (on) {
            mode.player.gpData.playerShape.refP.setAngle(180);
        } else {
            mode.player.gpData.playerShape.refP.setAngle(0);
        }
    }
 
    function ghost(on) {
        if (on) {
            mode.onSpt();
        } else {
            mode.player.gpData.playerShape.refP.setAngle(0);
        }
    }
 
    function redNick(on) {
        if (on) {
            mode.player.gpData.shapes[1].setColor("red");
        } else {
            mode.player.gpData.shapes[1].setColor("white");
        }
    }
 
    function greenNick(on) {
        if (on) {
            mode.player.gpData.shapes[1].setColor("lime");
        } else {
            mode.player.gpData.shapes[1].setColor("white");
        }
    }
 
    function blueNick(on) {
        if (on) {
            mode.player.gpData.shapes[1].setColor("blue");
        } else {
            mode.player.gpData.shapes[1].setColor("white");
        }
    }
 
    function lightblueNick(on) {
        if (on) {
            mode.player.gpData.shapes[1].setColor("lightblue");
        } else {
            mode.player.gpData.shapes[1].setColor("white");
        }
    }
 
    function yellowNick(on) {
        if (on) {
            mode.player.gpData.shapes[1].setColor("yellow");
        } else {
            mode.player.gpData.shapes[1].setColor("white");
        }
    }
 
    function redChat(on) {
        if (on) {
            mode.player.gpData.shapes[0].setColor("red");
        } else {
            mode.player.gpData.shapes[0].setColor("black");
        }
    }
 
    function greenChat(on) {
        if (on) {
            mode.player.gpData.shapes[0].setColor("lime");
        } else {
            mode.player.gpData.shapes[0].setColor("black");
        }
    }
 
    function blueChat(on) {
        if (on) {
            mode.player.gpData.shapes[0].setColor("blue");
        } else {
            mode.player.gpData.shapes[0].setColor("black");
        }
    }
 
    function lightblueChat(on) {
        if (on) {
            mode.player.gpData.shapes[0].setColor("lightblue");
        } else {
            mode.player.gpData.shapes[0].setColor("black");
        }
    }
 
    function yellowChat(on) {
        if (on) {
            mode.player.gpData.shapes[0].setColor("yellow");
        } else {
            mode.player.gpData.shapes[0].setColor("black");
        }
    }
 
    function A_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setAngle(45);
        } else {
            mode.player.gpData.p.ref.shapes[1].setAngle(0);
        }
    }
 
    function B_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setAngle(135);
        } else {
            mode.player.gpData.p.ref.shapes[1].setAngle(0);
        }
    }
 
    function C_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setAngle(180);
        } else {
            mode.player.gpData.p.ref.shapes[1].setAngle(0);
        }
    }
 
    function D_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setAngle(45);
        } else {
            mode.player.gpData.p.ref.shapes[0].setAngle(0);
        }
    }
 
    function E_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setAngle(135);
        } else {
            mode.player.gpData.p.ref.shapes[0].setAngle(0);
        }
    }
 
    function F_ctfs(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setAngle(180);
        } else {
            mode.player.gpData.p.ref.shapes[0].setAngle(0);
        }
    }
 
    function Nck_A(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setFontSize(23);
        } else {
            mode.player.gpData.p.ref.shapes[1].setFontSize(18);
        }
    }
 
    function Nck_B(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setFontSize(29);
        } else {
            mode.player.gpData.p.ref.shapes[1].setFontSize(18);
        }
    }
 
    function Nck_C(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[1].setFontSize(35);
        } else {
            mode.player.gpData.p.ref.shapes[1].setFontSize(18);
        }
    }
 
    function Cht_A(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setFontSize(23);
        } else {
            mode.player.gpData.p.ref.shapes[0].setFontSize(18);
        }
    }
 
    function Cht_B(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setFontSize(29);
        } else {
            mode.player.gpData.p.ref.shapes[0].setFontSize(18);
        }
    }
 
    function Cht_C(on) {
        if (on) {
            mode.player.gpData.p.ref.shapes[0].setFontSize(35);
        } else {
            mode.player.gpData.p.ref.shapes[0].setFontSize(18);
        }
    }
 
    function resetNormalness() {
        if (!window.denyNormalness) {
            mode.player.gpData.p.world.gravity = [0, oldGravity];
            mode.player.gpData.p.world.useFrictionGravityOnZeroGravity = true;
        }
        return true;
    }
 
    function positionFocused() {
        return (document.getElementById("positionX") === document.activeElement || document.getElementById("positionY") === document.activeElement);
    }
 
    function createFragment(htmlStr) {
        var frag = document.createDocumentFragment(),
            temp = document.createElement('div');
        temp.innerHTML = htmlStr;
        while (temp.firstChild) {
            frag.appendChild(temp.firstChild);
        }
        return frag;
    }
 
    // World location to pixel location on minimap
    function aToPminimap(a) {
        var mx = (MC.x.p[1] - MC.x.p[0])/(MC.x.a[1] - MC.x.a[0]);
        var my = (MC.y.p[1] - MC.y.p[0])/(MC.y.a[1] - MC.y.a[0]);
        var bx = MC.x.p[0] - mx*MC.x.a[0];
        var by = MC.y.p[0] - my*MC.y.a[0];
        return {
            x: mx*a.x + bx,
            y: my*a.y + by
        };
    }
 
    // Pixel location on minimap to world location
    // (inverse of the above function)
    function pToAminimap(p) {
        var mx = (MC.x.a[1] - MC.x.a[0])/(MC.x.p[1] - MC.x.p[0]);
        var my = (MC.y.a[1] - MC.y.a[0])/(MC.y.p[1] - MC.y.p[0]);
        var bx = MC.x.a[0] - mx*MC.x.p[0];
        var by = MC.y.a[0] - my*MC.y.p[0];
        return {
            x: mx*p.x + bx,
            y: my*p.y + by
        };
    }
 
    // Update minimap position
    function updateMinimapPosition() {
        var scale_x = document.getElementById("minimapimg").width / MC.width;
        var scale_y = document.getElementById("minimapimg").height / MC.height;
        var p = aToPminimap({
            x: mode.player.gpData.p.position[0],
            y: mode.player.gpData.p.position[1]
        });
        p.x = scale_x * p.x;
        p.y = scale_y * p.y;
 
        document.getElementById("minimapsvg").remove();
        var textHtml = "";
        textHtml += "<svg id=\"minimapsvg\" width=\"100%\" height=\"100%\" style=\"position: absolute; top: 0; left: 0; z-index: 1;\">";
        textHtml += "<circle id=\"posMarker\" cx=\"" + p.x + "\" cy=\"" + p.y + "\" r=\"3\" stroke=\"red\" stroke-width=\"2\" fill=\"black\"><\/circle>";
        textHtml += "<\/svg>";
        document.getElementById("minimap").insertBefore(createFragment(textHtml), document.getElementById("minimap").childNodes[0]);
 
    }
 
    // Warp to position, given a pixel location on the minimap
    function warpToLocation(pos) {
        var scale_x = MC.width / document.getElementById("minimapimg").width;
        var scale_y = MC.height / document.getElementById("minimapimg").height;
        var p = {
            x: pos.x * scale_x,
            y: pos.y * scale_y
        };
        var a = pToAminimap(p);
        mode.player.gpData.p.position[0] = a.x;
        mode.player.gpData.p.position[1] = a.y;
    }
 
    // Generic relative mouse clicks
    function getRelativeXY(evt, id) {
        var element = document.getElementById(id);  //replace elementId with your element's Id.
        var rect = element.getBoundingClientRect();
        var scrollTop = document.documentElement.scrollTop?
            document.documentElement.scrollTop:document.body.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft?
            document.documentElement.scrollLeft:document.body.scrollLeft;
        var elementLeft = rect.left+scrollLeft;
        var elementTop = rect.top+scrollTop;
 
        if (document.all){ //detects using IE
            x = event.clientX+scrollLeft-elementLeft; //event not evt because of IE
            y = event.clientY+scrollTop-elementTop;
        }
        else{
            x = evt.pageX-elementLeft;
            y = evt.pageY-elementTop;
        }
        return {"x":x, "y":y};
    }
 
    waitForPlay();
})();