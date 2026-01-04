// ==UserScript==
// @name         Matrix Mod for MooMoo.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  View Details At: https://matrixmod.glitch.me
// @author       Dot
// @match        https://moomoo.io/*
// @match        https://*.moomoo.io/*
// @icon         https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b/cursor12.png
// @grant        none
// @license      Copying this script and selling (in any capacity) and/or calling it your own will not be tolerated, Doing so will result in consequences.
// @downloadURL https://update.greasyfork.org/scripts/436191/Matrix%20Mod%20for%20MooMooio.user.js
// @updateURL https://update.greasyfork.org/scripts/436191/Matrix%20Mod%20for%20MooMooio.meta.js
// ==/UserScript==

location.href =
`javascript:` +
`
document.getElementById("mapDisplay").style.background =
        "url(https://cdn.discordapp.com/attachments/374333551858155530/376303720540930048/moomooio-background.png)",
    document.querySelector("#leaderboard").appendChild(
        (function() {
            let text = "Ping: ";
            let text2 = " ms";
            let oldPing = 0;
            const pingSpan = document.createElement("span");
            pingSpan.id = "pingTime";
            pingSpan.textContent = text;
            pingSpan.style.display = "inline-block";
            pingSpan.style.fontSize = "x-large";
            setInterval(function() {
                typeof pingTime !== "undefined" &&
                    oldPing !== pingTime &&
                    ((oldPing = pingTime),
                        (pingSpan.textContent = text + oldPing + text2),
                        (function() {
                            if (oldPing <= 100) {
                                pingSpan.style.color = "green";
                            }
                            if (oldPing >= 101 && oldPing <= 250) {
                                pingSpan.style.color = "Orange";
                            }
                            if (oldPing >= 251) {
                                pingSpan.style.color = "red";
                            }
                        })());
            });
            return pingSpan;
        })()
    );
    let hue = 0;
    let replaceInterval = setInterval(() => {
        if (CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = (oldFunc =>
                function() {
                    if (this.fillStyle == "#8ecc51")
                        this.fillStyle = 'hsl('+hue+', 100%, 50%)';
                    return oldFunc.call(this, ...arguments);
                })(CanvasRenderingContext2D.prototype.roundRect);
            clearInterval(replaceInterval);
        }
    }, 20);

    function changeHue() {
        hue += Math.random() * 3;
    }
    setInterval(changeHue, 20);
    setInterval(() => {
        setTimeout(() => {
            document.getElementById("chatBox").placeholder = "Writing";
            setTimeout(() => {
                document.getElementById("chatBox").placeholder = "Writing.";
                setTimeout(() => {
                    document.getElementById("chatBox").placeholder = "Writing..";
                    setTimeout(() => {
                        document.getElementById("chatBox").placeholder = "Writing...";
                    }, 200);
                }, 200);
            }, 200);
        }, 200);
    }, 1000);
    document.getElementById("loadingText").innerHTML = "Mod Loading...";
function Anamation() {
    document.getElementById("gameName").style.fontFamily = "Courier New, monospace";
    document.getElementById("gameName").style.fontWeight = "600";
    document.getElementById("loadingText").innerHTML = "Game Loading...";
    setTimeout(() => {
        document.getElementById("gameName").innerHTML = "1010101010";
        setTimeout(() => {
            document.getElementById("gameName").innerHTML = "2200220202";
            setTimeout(() => {
                document.getElementById("gameName").innerHTML = "2020200220";
                setTimeout(() => {
                    document.getElementById("gameName").innerHTML = "2020202202";
                    setTimeout(() => {
                        document.getElementById("gameName").innerHTML = "M220022020";
                        setTimeout(() => {
                            document.getElementById("gameName").innerHTML = "M202020020";
                            setTimeout(() => {
                                document.getElementById("gameName").innerHTML = "MA20202022";
                                setTimeout(() => {
                                    document.getElementById("gameName").innerHTML = "MA20202020";
                                    setTimeout(() => {
                                        document.getElementById("gameName").innerHTML = "MAT2020202";
                                        setTimeout(() => {
                                            document.getElementById("gameName").innerHTML = "MAT0202200";
                                            setTimeout(() => {
                                                document.getElementById("gameName").innerHTML = "MATR202002";
                                                setTimeout(() => {
                                                    document.getElementById("gameName").innerHTML = "MATRI20202";
                                                    setTimeout(() => {
                                                        document.getElementById("gameName").innerHTML = "MATRI20020";
                                                        setTimeout(() => {
                                                            document.getElementById("gameName").innerHTML = "MATRIX0220";
                                                            setTimeout(() => {
                                                                document.getElementById("gameName").innerHTML = "MATRIX0202";
                                                                setTimeout(() => {
                                                                    document.getElementById("gameName").innerHTML = "MATRIX 202";
                                                                    setTimeout(() => {
                                                                        document.getElementById("gameName").innerHTML = "MATRIX 202";
                                                                        setTimeout(() => {
                                                                            document.getElementById("gameName").innerHTML = "MATRIX M20";
                                                                            setTimeout(() => {
                                                                                document.getElementById("gameName").innerHTML = "MATRIX M02";
                                                                                setTimeout(() => {
                                                                                    document.getElementById("gameName").innerHTML = "MATRIX MO2";
                                                                                    setTimeout(() => {
                                                                                        document.getElementById("gameName").innerHTML = "MATRIX MO0";
                                                                                        setTimeout(() => {
                                                                                            document.getElementById("gameName").innerHTML = "MATRIX MOD";
                                                                                        }, 100);
                                                                                    }, 100);
                                                                                }, 100);
                                                                            }, 100);
                                                                        }, 100);
                                                                    }, 100);
                                                                }, 100);
                                                            }, 100);
                                                        }, 100);
                                                    }, 100);
                                                }, 100);
                                            }, 100);
                                        }, 100);
                                    }, 100);
                                }, 100);
                            }, 100);
                        }, 100);
                    }, 100);
                }, 100);
            }, 100);
        }, 100);
    }, 100);
}
    var Padding4Nullz = "60px";
    var keycolor = "white";
    var keys = [];
    keys[13] = "entr";
    keys[27] = "esc";
    keys[32] = "space";
    keys[49] = 1;
    keys[50] = 2;
    keys[51] = 3;
    keys[52] = 4;
    keys[53] = 5;
    keys[54] = 6;
    keys[55] = 7;
    keys[56] = 8;
    keys[57] = 9;
    keys[65] = "a";
    keys[67] = "c";
    keys[68] = "d";
    keys[69] = "e";
    keys[81] = "Q";
    keys[87] = "w";
    keys[83] = "s";
    keys[88] = "x";
    keys[82] = "r";

    function checkKey(event, background) {
        let keyCode = event.keyCode;
        if (keys[keyCode]) {
            document.getElementById(keys[keyCode]).style.background = background;
        }
    }
    document.addEventListener("keydown", event => checkKey(event, keycolor));
    document.addEventListener("keyup", event =>
        checkKey(event, "rgb(0, 0, 0, .2)")
    );
    var onMousedown = function(e) {
        if (e.which === key3) {
            buyAndEquip(Bull);
            document.getElementById("r-c").style.background = keycolor;
        } else if (e.which === key1) {
            buyAndEquip(Bull);
            document.getElementById("l-c").style.background = keycolor;
        }
    };
    var onMouseup = function(e) {
        if (e.which === key3) {
            buyAndEquip(Moo_u);
            document.getElementById("r-c").style.background = "rgb(0, 0, 0, .2)";
        } else if (e.which === key1) {
            buyAndEquip(Moo_u);
            document.getElementById("l-c").style.background = "rgb(0, 0, 0, .2)";
        }
    };
    window.addEventListener("mousedown", onMousedown);
    window.addEventListener("mouseup", onMouseup);

        function ShowSettingsBoxen() {
        document.getElementById("Boxen").style.marginLeft = "-408px";
        document.getElementById("HackBoxen").style.marginLeft = "-408px";
        document.getElementById("SettingsBoxen").style.marginLeft = "0";
        document.getElementById("X").style.display = "block";
        document.getElementById("Check").style.display = "none";
        document.getElementById("OpenAndClose").style.borderRadius =
            "0px 8px 8px 0px";
        document.getElementById("OpenAndClose").style.marginLeft = "0px";
        document.getElementById("SettingsTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("SettingsTab").style.marginLeft = "0px";
        document.getElementById("S-X").style.display = "block";
        document.getElementById("HackTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("HackTab").style.marginLeft = "0px";
        document.getElementById("Hack-X").style.display = "none";
        document.getElementById("X").style.display = "none";
        document.getElementById("timeOfDay").style.visibility = "hidden";
        document.getElementById("mapDisplay").style.visibility = "hidden";
        document.getElementById("scoreDisplay").style.visibility = "hidden";
    }

    function HideSettingsBoxen() {
        document.getElementById("SettingsBoxen").style.marginLeft = "-408px";
        document.getElementById("Boxen").style.marginLeft = "0";
        document.getElementById("HackBoxen").style.marginLeft = "-408px";
        document.getElementById("X").style.display = "block";
        document.getElementById("Check").style.display = "none";
        document.getElementById("OpenAndClose").style.borderRadius =
            "0px 8px 8px 0px";
        document.getElementById("OpenAndClose").style.marginLeft = "0px";
        document.getElementById("SettingsTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("SettingsTab").style.marginLeft = "0px";
        document.getElementById("S-X").style.display = "none";
        document.getElementById("mapDisplay").style.visibility = "visible";
        document.getElementById("scoreDisplay").style.visibility = "visible";
        Check();
    }

    function ShowHackBoxen() {
        document.getElementById("Boxen").style.marginLeft = "-408px";
        document.getElementById("SettingsBoxen").style.marginLeft = "-408px";
        document.getElementById("HackBoxen").style.marginLeft = "0";
        document.getElementById("X").style.display = "block";
        document.getElementById("Check").style.display = "none";
        document.getElementById("OpenAndClose").style.borderRadius =
            "0px 8px 8px 0px";
        document.getElementById("OpenAndClose").style.marginLeft = "0px";
        document.getElementById("HackTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("SettingsTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("HackTab").style.marginLeft = "0px";
        document.getElementById("SettingsTab").style.marginLeft = "0px";
        document.getElementById("Hack-X").style.display = "block";
        document.getElementById("X").style.display = "none";
        document.getElementById("S-X").style.display = "none";
        document.getElementById("mapDisplay").style.visibility = "visible";
        document.getElementById("scoreDisplay").style.visibility = "visible";
        Check();
    }

    function HideHackBoxen() {
        document.getElementById("HackBoxen").style.marginLeft = "-408px";
        document.getElementById("Boxen").style.marginLeft = "0";
        document.getElementById("X").style.display = "block";
        document.getElementById("Check").style.display = "none";
        document.getElementById("OpenAndClose").style.borderRadius =
            "0px 8px 8px 0px";
        document.getElementById("OpenAndClose").style.marginLeft = "0px";
        document.getElementById("HackTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("HackTab").style.marginLeft = "0px";
        document.getElementById("Hack-X").style.display = "none";
        document.getElementById("mapDisplay").style.visibility = "visible";
        document.getElementById("scoreDisplay").style.visibility = "visible";
        Check();
    }

    function ShowBoxen() {
        document.getElementById("Boxen").style.marginLeft = "0";
        document.getElementById("X").style.display = "block";
        document.getElementById("Check").style.display = "none";
        document.getElementById("OpenAndClose").style.borderRadius =
            "0px 8px 8px 0px";
        document.getElementById("OpenAndClose").style.marginLeft = "0px";
        document.getElementById("SettingsTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("SettingsTab").style.marginLeft = "0px";
        document.getElementById("S-X").style.display = "none";
        document.getElementById("HackTab").style.borderRadius = "0px 8px 8px 0px";
        document.getElementById("HackTab").style.marginLeft = "0px";
        document.getElementById("Hack-X").style.display = "none";
        document.getElementById("mapDisplay").style.visibility = "visible";
        document.getElementById("scoreDisplay").style.visibility = "visible";
        Check();
    }

    function HideBoxen() {
        document.getElementById("X").style.display = "none";
        document.getElementById("Check").style.display = "block";
        document.getElementById("OpenAndClose").style.marginLeft = "-405px";
        document.getElementById("Boxen").style.marginLeft = "-408px";
        document.getElementById("OpenAndClose").style.borderRadius =
            "8px 8px 8px 8px";
        document.getElementById("SettingsTab").style.marginLeft = "-405px";
        document.getElementById("SettingsTab").style.borderRadius = "8px 8px 8px 8px";
        document.getElementById("SettingsBoxen").style.marginLeft = "-407px";
        document.getElementById("S-X").style.display = "none";
        document.getElementById("HackTab").style.marginLeft = "-405px";
        document.getElementById("HackTab").style.borderRadius = "8px 8px 8px 8px";
        document.getElementById("HackBoxen").style.marginLeft = "-407px";
        document.getElementById("Hack-X").style.display = "none";
        document.getElementById("mapDisplay").style.visibility = "visible";
        document.getElementById("scoreDisplay").style.visibility = "visible";
        Check();
    }

    function rrrr() {
        keycolor = "red";
    }

    function oooo() {
        keycolor = "orange";
    }

    function yyyy() {
        keycolor = "yellow";
    }

    function gggg() {
        keycolor = "green";
    }

    function bbbb() {
        keycolor = "blue";
    }

    function pppp() {
        keycolor = "purple";
    }

    function pppp2() {
        keycolor = "pink";
    }

    function wwww() {
        keycolor = "white";
    }

    function bbbb2() {
        keycolor = "black";
    }

    function lblb() {
        keycolor = "cornflowerblue";
    }
    function trrrr() {
        document.getElementById("Boxen").style.color = "Red";
    }

    function toooo() {
        document.getElementById("Boxen").style.color = "orange";
    }

    function tyyyy() {
        document.getElementById("Boxen").style.color = "yellow";
    }

    function tgggg() {
        document.getElementById("Boxen").style.color = "green";
    }

    function tbbbb() {
        document.getElementById("Boxen").style.color = "blue";
    }

    function tpppp() {
        document.getElementById("Boxen").style.color = "purple";
    }

    function tpppp2() {
        document.getElementById("Boxen").style.color = "pink";
    }

    function twwww() {
        document.getElementById("Boxen").style.color = "white";
    }

    function tbbbb2() {
        document.getElementById("Boxen").style.color = "black";
    }

    function tlblb() {
        document.getElementById("Boxen").style.color = "cornflowerblue";
    }
    function rHax() {
        document.getElementById("leaderboard").style.color = "red";
        document.getElementById("leaderboardData").style.color = "red";
        document.getElementById("allianceButton").style.color = "red";
        document.getElementById("storeButton").style.color = "red";
        document.getElementById("chatButton").style.color = "red";
        document.getElementById("killCounter").style.color = "red";
        document.getElementById("foodDisplay").style.color = "red";
        document.getElementById("woodDisplay").style.color = "red";
        document.getElementById("stoneDisplay").style.color = "red";
        document.getElementById("scoreDisplay").style.color = "red";
        document.getElementById("ageBarBody").style.background = "red";
        document.getElementById("timeOfDay").style.color = "red";
    }

    function oHax() {
        document.getElementById("leaderboard").style.color = "orange";
        document.getElementById("leaderboardData").style.color = "orange";
        document.getElementById("allianceButton").style.color = "orange";
        document.getElementById("storeButton").style.color = "orange";
        document.getElementById("chatButton").style.color = "orange";
        document.getElementById("killCounter").style.color = "orange";
        document.getElementById("foodDisplay").style.color = "orange";
        document.getElementById("woodDisplay").style.color = "orange";
        document.getElementById("stoneDisplay").style.color = "orange";
        document.getElementById("scoreDisplay").style.color = "orange";
        document.getElementById("ageBarBody").style.background = "orange";
        document.getElementById("timeOfDay").style.color = "orange";
    }

    function yHax() {
        document.getElementById("leaderboard").style.color = "yellow";
        document.getElementById("leaderboardData").style.color = "yellow";
        document.getElementById("allianceButton").style.color = "yellow";
        document.getElementById("storeButton").style.color = "yellow";
        document.getElementById("chatButton").style.color = "yellow";
        document.getElementById("killCounter").style.color = "yellow";
        document.getElementById("foodDisplay").style.color = "yellow";
        document.getElementById("woodDisplay").style.color = "yellow";
        document.getElementById("stoneDisplay").style.color = "yellow";
        document.getElementById("scoreDisplay").style.color = "yellow";
        document.getElementById("ageBarBody").style.background = "yellow";
        document.getElementById("timeOfDay").style.color = "yellow";
    }

    function gHax() {
        document.getElementById("leaderboard").style.color = "green";
        document.getElementById("leaderboardData").style.color = "green";
        document.getElementById("allianceButton").style.color = "green";
        document.getElementById("storeButton").style.color = "green";
        document.getElementById("chatButton").style.color = "green";
        document.getElementById("killCounter").style.color = "green";
        document.getElementById("foodDisplay").style.color = "green";
        document.getElementById("woodDisplay").style.color = "green";
        document.getElementById("stoneDisplay").style.color = "green";
        document.getElementById("scoreDisplay").style.color = "green";
        document.getElementById("ageBarBody").style.background = "green";
        document.getElementById("timeOfDay").style.color = "green";
    }

    function bHax() {
        document.getElementById("leaderboard").style.color = "blue";
        document.getElementById("leaderboardData").style.color = "blue";
        document.getElementById("allianceButton").style.color = "blue";
        document.getElementById("storeButton").style.color = "blue";
        document.getElementById("chatButton").style.color = "blue";
        document.getElementById("killCounter").style.color = "blue";
        document.getElementById("foodDisplay").style.color = "blue";
        document.getElementById("woodDisplay").style.color = "blue";
        document.getElementById("stoneDisplay").style.color = "blue";
        document.getElementById("scoreDisplay").style.color = "blue";
        document.getElementById("ageBarBody").style.background = "blue";
        document.getElementById("timeOfDay").style.color = "blue";
    }

    function pHax() {
        document.getElementById("leaderboard").style.color = "purple";
        document.getElementById("leaderboardData").style.color = "purple";
        document.getElementById("allianceButton").style.color = "purple";
        document.getElementById("storeButton").style.color = "purple";
        document.getElementById("chatButton").style.color = "purple";
        document.getElementById("killCounter").style.color = "purple";
        document.getElementById("foodDisplay").style.color = "purple";
        document.getElementById("woodDisplay").style.color = "purple";
        document.getElementById("stoneDisplay").style.color = "purple";
        document.getElementById("scoreDisplay").style.color = "purple";
        document.getElementById("ageBarBody").style.background = "purple";
        document.getElementById("timeOfDay").style.color = "purple";
    }

    function pHax2() {
        document.getElementById("leaderboard").style.color = "pink";
        document.getElementById("leaderboardData").style.color = "pink";
        document.getElementById("allianceButton").style.color = "pink";
        document.getElementById("storeButton").style.color = "pink";
        document.getElementById("chatButton").style.color = "pink";
        document.getElementById("killCounter").style.color = "pink";
        document.getElementById("foodDisplay").style.color = "pink";
        document.getElementById("woodDisplay").style.color = "pink";
        document.getElementById("stoneDisplay").style.color = "pink";
        document.getElementById("scoreDisplay").style.color = "pink";
        document.getElementById("ageBarBody").style.background = "pink";
        document.getElementById("timeOfDay").style.color = "pink";
    }

    function wHax() {
        document.getElementById("leaderboard").style.color = "white";
        document.getElementById("leaderboardData").style.color = "white";
        document.getElementById("allianceButton").style.color = "white";
        document.getElementById("storeButton").style.color = "white";
        document.getElementById("chatButton").style.color = "white";
        document.getElementById("killCounter").style.color = "white";
        document.getElementById("foodDisplay").style.color = "white";
        document.getElementById("woodDisplay").style.color = "white";
        document.getElementById("stoneDisplay").style.color = "white";
        document.getElementById("scoreDisplay").style.color = "white";
        document.getElementById("ageBarBody").style.background = "white";
        document.getElementById("timeOfDay").style.color = "white";
    }

    function bHax2() {
        document.getElementById("leaderboard").style.color = "black";
        document.getElementById("leaderboardData").style.color = "black";
        document.getElementById("allianceButton").style.color = "black";
        document.getElementById("storeButton").style.color = "black";
        document.getElementById("chatButton").style.color = "black";
        document.getElementById("killCounter").style.color = "black";
        document.getElementById("foodDisplay").style.color = "black";
        document.getElementById("woodDisplay").style.color = "black";
        document.getElementById("stoneDisplay").style.color = "black";
        document.getElementById("scoreDisplay").style.color = "black";
        document.getElementById("ageBarBody").style.background = "black";
        document.getElementById("timeOfDay").style.color = "black";
    }

    function lbHax() {
        document.getElementById("leaderboard").style.color = "cornflowerblue";
        document.getElementById("leaderboardData").style.color = "cornflowerblue";
        document.getElementById("allianceButton").style.color = "cornflowerblue";
        document.getElementById("storeButton").style.color = "cornflowerblue";
        document.getElementById("chatButton").style.color = "cornflowerblue";
        document.getElementById("killCounter").style.color = "cornflowerblue";
        document.getElementById("foodDisplay").style.color = "cornflowerblue";
        document.getElementById("woodDisplay").style.color = "cornflowerblue";
        document.getElementById("stoneDisplay").style.color = "cornflowerblue";
        document.getElementById("scoreDisplay").style.color = "cornflowerblue";
        document.getElementById("ageBarBody").style.background = "cornflowerblue";
        document.getElementById("timeOfDay").style.color = "cornflowerblue";
    }

    function CheckDaCheckBoxen1() {
        var checkbox = document.getElementById("CheckBoxen1");
        if (checkbox.checked != false) {
            document.querySelector("html").style.filter = "blur(2px)";
        } else {
            document.querySelector("html").style.filter = "blur(0px)";
        }
    }

    function CheckDaCheckBoxen2() {
        var checkbox = document.getElementById("CheckBoxen2");
        if (checkbox.checked != true) {
            document.querySelector("html").style.filter = "saturate(100%)";
        } else {
            document.querySelector("html").style.filter = "saturate(0%)";
        }
    }

    function CheckDaCheckBoxen3() {
        var checkbox = document.getElementById("CheckBoxen3");
        if (checkbox.checked != false) {
            document.querySelector("html").style.filter = "sepia(10000%)";
        } else {
            document.querySelector("html").style.filter = "sepia(0%)";
        }
    }

    function CheckDaCheckBoxen4() {
        var checkbox = document.getElementById("CheckBoxen4");
        if (checkbox.checked != false) {
            document.querySelector("html").style.filter = "hue-rotate(90deg)";
        } else {
            document.querySelector("html").style.filter = "hue-rotate(0deg)";
        }
    }

    function CheckDaCheckBoxen5() {
        var checkbox = document.getElementById("CheckBoxen5");
        if (checkbox.checked != false) {
            document.querySelector("html").style.filter = "invert(70%)";
        } else {
            document.querySelector("html").style.filter = "invert(0%)";
        }
    }

    function CheckDaCheckBoxen6() {
        var checkbox = document.getElementById("CheckBoxen6");
        if (checkbox.checked != false) {
            document.querySelector("html").style.filter = "brightness(70%)";
        } else {
            document.querySelector("html").style.filter = "brightness(100%)";
        }
    }

    function CheckDaCheckBoxen7() {
        var checkbox = document.getElementById("CheckBoxen7");
        if (checkbox.checked != false) {
            Pop_up("Ping: On");
            document.getElementById("pingTime").style.display = "block";
        } else {
            Pop_up("Ping: Off");
            document.getElementById("pingTime").style.display = "none";
        }
    }

    function CheckDaCheckBoxen8() {
        var checkbox = document.getElementById("CheckBoxen8");
        if (checkbox.checked != false) {
            document.getElementById("mapDisplay").style.background =
                "url(https://cdn.discordapp.com/attachments/374333551858155530/376303720540930048/moomooio-background.png)";
            Pop_up("Advanced Map: On");
        } else {
            document.getElementById("mapDisplay").style.background = "rgb(0,0,0, .25)";
            Pop_up("Advanced Map: Off");
        }
    }

    function CheckDaCheckBoxen9() {
        var checkbox = document.getElementById("CheckBoxen9");
        if (checkbox.checked != true) {
            document.getElementById("infoBox").style.display = "none";
            key16 = NaN;
            key84 = NaN;
            key85 = NaN;
            key32 = NaN;
            key89 = NaN;
            key73 = NaN;
            key79 = NaN;
            key80 = NaN;
            key69 = NaN;
            key1 = NaN;
            key3 = NaN;
            key70 = NaN;
            key71 = NaN;
            key192 = NaN;
            key88 = NaN;
            document.getElementById("actionBar").style.marginBottom = "0px";
            document.getElementById("ageBarContainer").style.marginBottom = "0px";
            document.getElementById("ageText").style.marginBottom = "0px";
            Pop_up("Hat Macro: Off");
        } else {
            document.getElementById("infoBox").style.display = "block";
            key16 = 16;
            key84 = 84;
            key85 = 85;
            key32 = 32;
            key89 = 89;
            key73 = 73;
            key79 = 79;
            key80 = 80;
            key69 = 69;
            key1 = 1;
            key3 = 3;
            key70 = 70;
            key71 = 71;
            key192 = 192;
            key88 = 88;
            document.getElementById("actionBar").style.marginBottom = "24px";
            document.getElementById("ageBarContainer").style.marginBottom = "24px";
            document.getElementById("ageText").style.marginBottom = "24px";
            Pop_up("Hat Macro: On");
        }
    }

    function CheckDaCheckBoxen10() {
        var checkbox = document.getElementById("CheckBoxen10");
        if (checkbox.checked != false) {
            document.querySelector(".Nullz").style.display = "block";
            Pop_up("Hit Radius: On");
        } else {
            Pop_up("Hit Radius: Off");
            document.querySelector(".Nullz").style.display = "none";
        }
    }

    function CheckDaCheckBoxen11() {
        var checkbox = document.getElementById("CheckBoxen11");
        var x = document.getElementById("Pop-up");
        if (checkbox.checked != false) {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }

    function CheckDaCheckBoxen12() {
        var checkbox = document.getElementById("CheckBoxen12");
        if (checkbox.checked != false) {
            document.getElementById("darkness").style.visibility = "hidden";
            document.getElementById("timeOfDay").style.visibility = "hidden";
            Pop_up("Anti Dark: On");
        } else {
            Pop_up("Anti Dark: Off");
            document.getElementById("darkness").style.visibility = "visible";
            document.getElementById("timeOfDay").style.visibility = "visible";
        }
    }

    function Check() {
        var checkbox = document.getElementById("CheckBoxen12");
        if (checkbox.checked != false) {
            document.getElementById("darkness").style.visibility = "hidden";
            document.getElementById("timeOfDay").style.visibility = "hidden";
        } else {
            document.getElementById("darkness").style.visibility = "visible";
            document.getElementById("timeOfDay").style.visibility = "visible";
        }
    }

    function cursor1() {
        document.getElementById("gameCanvas").style.cursor = "default";
    }

    function cursor2() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor.ico'), auto";
    }

    function cursor3() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor2.ico'), auto";
    }

    function cursor4() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor3.ico'), auto";
    }

    function cursor5() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor4.ico'), auto";
    }

    function cursor6() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor5.ico'), auto";
    }

    function cursor7() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor6.ico'), auto";
    }

    function cursor8() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor7.png'), auto";
    }

    function cursor9() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor8.ico'), auto";
    }

    function cursor10() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor9.ico'), auto";
    }

    function cursor11() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor10.png'), auto";
    }

    function cursor12() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor12.png'), auto";
    }

    function cursor13() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor13.png'), auto";
    }

    function cursor14() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor14.png'), auto";
    }

    function cursor15() {
        document.getElementById("gameCanvas").style.cursor =
            "url('https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor15.png'), auto";
    }

    var Hat_Cycler;
    var NullOne = true;
    var NullTwo = true;
    var NullThree = true;
    var NullFour = true;
    var NullFive = true;
    var NullSix = true;
    var NullSeven = true;
    var NullEight = true;
    var switchTime = 50;
    var key3 = 3;
    var key1 = 1;
    var key16 = 16;
    var key84 = 84;
    var key85 = 85;
    var key32 = 32;
    var key89 = 89;
    var key73 = 73;
    var key79 = 79;
    var key80 = 80;
    var key69 = 69;
    var key71 = 71;
    var key70 = 70;
    var key192 = 192;
    var key88 = 88;
    var unequip = 0;
    var Tank = 40;
    var Soldier = 6;
    var Bull = 7;
    var Booster = 12;
    var Flipper = 31;
    var Blood = 55;
    var Emp = 22;
    var Samurai = 20;
    var Winter = 15;
    var Invis = 56;
    var TankOn = false;
    var Moo_u = 0;

    document.body.onkeyup = function(event) {
        event = event || window.event;
        var keycode = event.charCode || event.keyCode;
        if (keycode === key32) {
            buyAndEquip(Moo_u);
        }
    };
    document.addEventListener("keydown", function(e) {
        if (e.keyCode === key16) {
            buyAndEquip(unequip);
            Moo_u = unequip;
        } else if (e.keyCode === key69) {
            toggleTank();
        } else if (e.keyCode === key85) {
            buyAndEquip(Soldier);
            Moo_u = Soldier;
        } else if (e.keyCode === key32) {
            buyAndEquip(Bull);
        } else if (e.keyCode === key89) {
            buyAndEquip(Booster, 11);
            (Moo_u = Booster), 11;
        } else if (e.keyCode === key73) {
            buyAndEquip(Flipper);
            Moo_u = Flipper;
        } else if (e.keyCode === key79) {
            buyAndEquip(Blood);
            Moo_u = Blood;
        } else if (e.keyCode === key71) {
            buyAndEquip(Emp);
            Moo_u = Emp;
        } else if (e.keyCode === key84) {
            buyAndEquip(Samurai);
            Moo_u = Samurai;
        } else if (e.keyCode === key80) {
            buyAndEquip(Winter);
            Moo_u = Winter;
        } else if (e.keyCode === key70) {
            buyAndEquip(Invis);
            Moo_u = Invis;
            Pop_up("Hide!");
        } else if (e.keyCode === 13) {
            check2();
        } else if (e.keyCode === 27) {
            check();
            check1();
            check2();
        } else if (e.keyCode === key192) {
            Toggle_Hat();
        } else if (e.keyCode === key88) {
            toggleMove();
        }
    });

    function Pop_up(Message) {
        document.getElementById("Pop-up").innerHTML = Message;
        document.getElementById("Pop-up").style.marginTop = "5px";
        setTimeout(() => {
            document.getElementById("Pop-up").style.marginTop = "-110px";
        }, 1500);
    }

    function buyAndEquip(name) {
        storeBuy(name);
        storeEquip(name);
    }

    function toggleTank() {
        TankOn ? Tank0n() : TankOff();
        TankOn = !TankOn;
    }

    function Tank0n() {
        buyAndEquip(Tank);
    }

    function TankOff() {
        buyAndEquip(Moo_u);
    }

    function check() {
        var x = document.getElementById("storeMenu");
        if (x.style.display === "block") {
            key16 = null;
            key84 = null;
            key85 = null;
            key32 = null;
            key89 = null;
            key73 = null;
            key79 = null;
            key80 = null;
            key69 = null;
            key1 = null;
            key3 = null;
            key70 = null;
            key71 = null;
            key192 = null;
            key88 = null;
        } else if (x.style.display === "none") {
            check3();
        }
    }

    function check1() {
        var z = document.getElementById("allianceMenu");
        if (z.style.display === "block") {
            key16 = null;
            key84 = null;
            key85 = null;
            key32 = null;
            key89 = null;
            key73 = null;
            key79 = null;
            key80 = null;
            key69 = null;
            key1 = null;
            key3 = null;
            key70 = null;
            key71 = null;
            key192 = null;
            key88 = null;
        } else if (z.style.display === "none") {
            check3();
        }
    }

    function check2() {
        var y = document.getElementById("chatHolder");
        if (y.style.display === "block") {
            key16 = null;
            key84 = null;
            key85 = null;
            key32 = null;
            key89 = null;
            key73 = null;
            key79 = null;
            key80 = null;
            key69 = null;
            key1 = null;
            key3 = null;
            key70 = null;
            key71 = null;
            key192 = null;
            key88 = null;
        } else if (y.style.display === "none") {
            check3();
        }
    }

    function check3() {
        var y = document.getElementById("chatHolder");
        var x = document.getElementById("storeMenu");
        var z = document.getElementById("allianceMenu");
        if (
            y.style.display === "none" &&
            x.style.display === "none" &&
            z.style.display === "none"
        ) {
            Check6();
        }
    }

    function check4() {
        if (
            document.getElementById("actionBarItem0").style.display === "inline-block"
        ) {
            Padding4Nullz = "55px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
        } else if (
            document.getElementById("actionBarItem3").style.display === "inline-block"
        ) {
            Padding4Nullz = "90px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullOne) {
                Pop_up("Sword!");
                NullOne = false;
            }
        } else if (
            document.getElementById("actionBarItem4").style.display === "inline-block"
        ) {
            Padding4Nullz = "105px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullTwo) {
                Pop_up("Katina!");
                NullTwo = false;
            }
        } else if (
            document.getElementById("actionBarItem1").style.display === "inline-block"
        ) {
            Padding4Nullz = "65px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullThree) {
                Pop_up("Axe!");
                NullThree = false;
            }
        } else if (
            document.getElementById("actionBarItem2").style.display === "inline-block"
        ) {
            Padding4Nullz = "68px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullFour) {
                Pop_up("Battle Axe!");
                NullFour = false;
            }
        } else if (
            document.getElementById("actionBarItem5").style.display === "inline-block"
        ) {
            Padding4Nullz = "100px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullFive) {
                Pop_up("Polearm!");
                NullFive = false;
            }
        } else if (
            document.getElementById("actionBarItem6").style.display === "inline-block"
        ) {
            Padding4Nullz = "90px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullSix) {
                Pop_up("Bat!");
                NullSix = false;
            }
        } else if (
            document.getElementById("actionBarItem7").style.display === "inline-block"
        ) {
            Padding4Nullz = "65px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullSeven) {
                Pop_up("Daggers!");
                NullSeven = false;
            }
        } else if (
            document.getElementById("actionBarItem8").style.display === "inline-block"
        ) {
            Padding4Nullz = "60px";
            document.querySelector(".Nullz").style.padding = Padding4Nullz;
            if (NullEight) {
                Pop_up("Stick");
                NullEight = false;
            }
        }
    }

let KillCount = 1;
document.getElementById("killCounter").addEventListener("DOMSubtreeModified", Update);
function Update() {
	if (document.getElementById("killCounter").innerHTML == KillCount) {
		Pop_up("Nice kill! You have " + KillCount + " Kills");
		++KillCount;
	}
  if (document.getElementById("foodDisplay").innerHTML < 150 ) {
    document.getElementById("foodDisplay").innerHTML = document.getElementById("foodDisplay").innerHTML + ' <span style="color:red" class="material-icons Blinkz">warning</span>';
  }
  if (document.getElementById("woodDisplay").innerHTML < 150 ) {
    document.getElementById("woodDisplay").innerHTML = document.getElementById("woodDisplay").innerHTML + ' <span style="color:red" class="material-icons Blinkz">warning</span>';
  }
  if (document.getElementById("stoneDisplay").innerHTML < 150 ) {
    document.getElementById("stoneDisplay").innerHTML = document.getElementById("stoneDisplay").innerHTML + ' <span style="color:red" class="material-icons Blinkz">warning</span>';
  }
};

    function check5() {
        var o = document.getElementById("mainMenu");
        if (o.style.display === "block" && TankOn == false) {
            TankOn = true;
        }
        if (o.style.display === "block" && MoveOn == false) {
            MoveOn = true;
        }
        if (o.style.display === "block") {
            document.getElementById("Pop-up").style.display = "none";
            NullOne = true;
            NullTwo = true;
            NullThree = true;
            NullFour = true;
            NullFive = true;
            NullSix = true;
            NullSeven = true;
            NullEight = true;
            KillCount = 1;
        }
        if (o.style.display === "none") {
            CheckDaCheckBoxen11();
        }
    }

    function Check6() {
        var checkbox = document.getElementById("CheckBoxen9");
        if (checkbox.checked != true) {
            document.getElementById("infoBox").style.display = "none";
            key16 = NaN;
            key84 = NaN;
            key85 = NaN;
            key32 = NaN;
            key89 = NaN;
            key73 = NaN;
            key79 = NaN;
            key80 = NaN;
            key69 = NaN;
            key1 = NaN;
            key3 = NaN;
            key70 = NaN;
            key71 = NaN;
            key192 = NaN;
            key88 = NaN;
            document.getElementById("actionBar").style.marginBottom = "0px";
            document.getElementById("ageBarContainer").style.marginBottom = "0px";
            document.getElementById("ageText").style.marginBottom = "0px";
        } else {
            document.getElementById("infoBox").style.display = "block";
            key16 = 16;
            key84 = 84;
            key85 = 85;
            key32 = 32;
            key89 = 89;
            key73 = 73;
            key79 = 79;
            key80 = 80;
            key69 = 69;
            key1 = 1;
            key3 = 3;
            key70 = 70;
            key71 = 71;
            key192 = 192;
            key88 = 88;
            document.getElementById("actionBar").style.marginBottom = "24px";
            document.getElementById("ageBarContainer").style.marginBottom = "24px";
            document.getElementById("ageText").style.marginBottom = "24px";
        }
    }

    var HatOn = true;

    function Toggle_Hat() {
        HatOn ? Hat0n() : HatOff();
        HatOn = !HatOn;
    }

    function Hat0n() {
        Hat_Cycler = setInterval(function() {
            Hat_Cycler_On();
        }, 2700);
        Pop_up("Hat Cycler: On");
    }

    function HatOff() {
        Pop_up("Hat Cycler: Off");
        clearInterval(Hat_Cycler);
    }

    function Hat_Cycler_On() {
        setTimeout(() => {
            buyAndEquip(Math.floor(Math.random() * 58) + 1);
        }, switchTime);
    }

    setInterval(function() {
        check();
        check1();
        check2();
        check4();
        check5();
        document.getElementById("pre-content-container").style.display = "none";
    }, 10);

    var Test_If_Connected = window.setInterval(function() {
        if (
            document.getElementById("loadingText").innerHTML ==
            'disconnected<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>'
        ) {
            document.title = "Reloading...";
            window.location.href = window.location.href;
            clearInterval(Test_If_Connected);
        } else if (
            document.getElementById("loadingText").innerHTML ==
            'Invalid Connection<a href="javascript:window.location.href=window.location.href" class="ytLink">reload</a>'
        ) {
            document.title = "Reloading...";
            window.location.href = window.location.href;
            clearInterval(Test_If_Connected);
        }
    }, 1000);
    document.querySelector("#gameCanvas").addEventListener("mousemove", Null);

    function Null() {
        if (!MoveOn) {
            return;
        }
        var Null = document.querySelectorAll(".Nullz");
        var Null2 = document.querySelectorAll(".Nullz2");
        Null2.forEach(function(Null2) {
            let x = Null2.getBoundingClientRect().left + Null2.clientWidth / 2;
            let y = Null2.getBoundingClientRect().top + Null2.clientHeight / 2;
            let radian = Math.atan2(event.pageX - x, event.pageY - y);
            let rot = radian * (180 / Math.PI) * -1 + 270;
            Null.forEach(function(Null) {
                Null.style.transform = "rotate(" + rot + "deg)";
            });
        });
    }
    var MoveOn = true;

    function toggleMove() {
        MoveOn = !MoveOn;
    }
    localStorage.moofoll = !0;

    setTimeout(() => {
        console.clear();
    }, 50);
    setTimeout(() => {
        console.log(
            "%cMatrix Mod%c By Dot",
            "padding:3px 5px;background:#880808;color:white;border-radius:3px;font-size:1.07em;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto, Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-weight:500",
            "font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto, Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;font-weight:500"
        );
        selectSkinColor(4);
    }, 100);
setTimeout(() => {
    Anamation();
    document.querySelector("head").innerHTML += '<link rel="stylesheet" type="text/css" href="https://matrixmod.glitch.me/style.css">';
    document.querySelector("#onetrust-consent-sdk").innerHTML += '<div id="Pop-up"></div><div class="Nullz2"></div><div class="Nullz"></div><center><div id="infoBox" class="infoBox"> Shift - Clear Hat | Tank Gear - Auto | Bull Helmet - Auto | T - Samurai Armor | Y - Booster | U - Soldier | I - Flipper | O - Bloodthirster | P - Winter Hat <br/> F - Assassin Gear | G - Emp Helmet | ~ - Hat Cycler </div></center><a onclick="ShowSettingsBoxen()" ><div id="SettingsTab" class="SettingsTab"><font-plus><span class="material-icons" style="color:#4c4c4c;">settings</span></font-plus></div></a><div id="HackTab" class="HackTab"> <a onclick="ShowHackBoxen()" ><img style="Width:25px;hieght:25px;padding:5px;" src="https://moomoo.io/img/favicon.png?v=1"/></a></div> <div id="OpenAndClose" class="OpenAndClose"> <a id="X" onclick="HideBoxen()"><font-plus><i class="material-icons" style="color:#4c4c4c;">keyboard_hide</i></font-plus></a ><a id="Check" onclick="ShowBoxen()" style="display: none;" ><font-plus><font-plus><i class="material-icons" style="color:#4c4c4c;">keyboard_alt</i></font-plus></a > <a id="S-X" onclick="HideSettingsBoxen()" style="display: none;" ><font-plus><i class="material-icons" style="color:#D2042D;">close</i></font-plus></a > <a id="Hack-X" onclick="HideHackBoxen()" style="display: none;" ><font-plus><i class="material-icons" style="color:red;">close</i></font-plus></a > </div><div class="HackBoxen" id="HackBoxen"> <text stye="Font-size:70px;font-weight:1000px;">Hacks:</text> <br/> <texte>Show Notifications</texte> <texte>Show ping</texte> <texte>Advanced map</texte> <texte>Hat Macro</texte> <texte>Hit Radius</texte> <texte>Anti Dark</texte> <br/> <br/> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen11()" id="CheckBoxen11" checked/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen7()" id="CheckBoxen7" checked/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen8()" id="CheckBoxen8" checked/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen9()" id="CheckBoxen9" checked/> </texta ><texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen10()" id="CheckBoxen10" checked/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen12()" id="CheckBoxen12"/> </texta>  </div><div class="SettingsBoxen" id="SettingsBoxen"> <text stye="Font-size:70px;font-weight:1000px;" >Keyboard Background Colors:</text > <br/> <a onclick="rrrr()"> <textz>Red</textz> </a> <a onclick="oooo()"> <textz>Orange</textz> </a> <a onclick="yyyy()"> <textz>Yellow</textz> </a> <a onclick="gggg()"> <textz>Green</textz> </a> <a onclick="bbbb()"> <textz>Blue</textz> </a> <a onclick="pppp()"> <textz>Purple</textz> </a> <a onclick="pppp2()"> <textz>Pink</textz> </a> <a onclick="wwww()"> <textz>White</textz> </a> <a onclick="bbbb2()"> <textz>Black</textz> </a> <a onclick="lblb()"> <textz>sky blue</textz> </a> <text stye="Font-size:70px;font-weight:1000px;">Keyboard Font Colors:</text> <br/> <a onclick="trrrr()"> <textz>Red</textz> </a> <a onclick="toooo()"> <textz>Orange</textz> </a> <a onclick="tyyyy()"> <textz>Yellow</textz> </a> <a onclick="tgggg()"> <textz>Green</textz> </a> <a onclick="tbbbb()"> <textz>Blue</textz> </a> <a onclick="tpppp()"> <textz>Purple</textz> </a> <a onclick="tpppp2()"> <textz>Pink</textz> </a> <a onclick="twwww()"> <textz>White</textz> </a> <a onclick="tbbbb2()"> <textz>Black</textz> </a> <a onclick="tlblb()"> <textz>sky blue</textz> </a> <text stye="Font-size:70px;font-weight:1000px;">Texture Packs:</text> <br/> <a onclick="rHax()"> <textz>Red</textz> </a> <a onclick="oHax()"> <textz>Orange</textz> </a> <a onclick="yHax()"> <textz>Yellow</textz> </a> <a onclick="gHax()"> <textz>Green</textz> </a> <a onclick="bHax()"> <textz>Blue</textz> </a> <a onclick="pHax()"> <textz>Purple</textz> </a> <a onclick="pHax2()"> <textz>pink</textz> </a> <a onclick="wHax()"> <textz>White</textz> </a> <a onclick="bHax2()"> <textz>Black</textz> </a> <a onclick="lbHax()"> <textz>Sky Blue</textz> </a> <text stye="Font-size:70px;font-weight:1000px;">Cursors:</text><br/><a onclick="cursor1()" > <textz>Default</textz> </a ><a onclick="cursor2()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor.ico?v=1630075321624"/></textz> </a ><a onclick="cursor3()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor2.ico?v=1630075884214"/></textz> </a ><a onclick="cursor4()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor3.ico?v=1630079130625"/></textz> </a ><a onclick="cursor5()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor4.ico?v=1630078890106"/></textz> </a ><a onclick="cursor6()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor5.ico?v=1630190211146"/></textz> </a> <a onclick="cursor7()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor6.ico"/></textz> </a ><a onclick="cursor9()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor8.ico"/></textz> </a ><a onclick="cursor10()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor9.ico"/></textz> </a><a onclick="cursor11()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor10.png"/></textz> </a ><a onclick="cursor8()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor7.png"/></textz> </a ><a onclick="cursor12()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor12.png"/></textz> </a ><a onclick="cursor13()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor13.png"/></textz> </a ><a onclick="cursor14()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor14.png"/></textz> </a ><a onclick="cursor15()"> <textz ><img src="https://cdn.glitch.com/82ae8945-dcc6-4276-98a9-665381b4cd2b%2Fcursor15.png"/></textz> </a><text stye="Font-size:70px;font-weight:1000px;">Filters:</text> <br/> <texte>Dark</texte> <texte>inverted</texte> <texte>Hue</texte> <texte>sepia</texte> <texte>saturated</texte> <texte>Blury</texte> <texta style="border-radius:0 0 0 8px;"> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen1()" id="CheckBoxen1"/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen2()" id="CheckBoxen2"/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen3()" id="CheckBoxen3"/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen4()" id="CheckBoxen4"/> </texta> <texta> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen5()" id="CheckBoxen5"/> </texta> <texta style="border-radius:0 0 8px 0;"> <input class="inputBoxen" type="checkbox" onclick="CheckDaCheckBoxen6()" id="CheckBoxen6"/> </texta> <br/></div><div id="Boxen" class="Boxen"> <textz class="text" style="border-radius:8px 0 0 0;" id="1">1</textz> <textz id="2">2</textz> <textz id="3">3</textz> <textz id="4">4</textz> <textz id="5">5</textz> <textz id="6">6</textz> <textz id="7">7</textz> <textz id="8">8</textz> <textz id="9">9</textz> <textz id="Q">Q</textz> <textz id="e">E</textz> <textz id="x">X</textz> <textz id="r">R</textz> <textz id="c">C</textz> <textz id="entr" style="width:80px">Enter</textz> <textz id="esc" style="width:80px">ESC</textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz id="w">W</textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz id="a">A</textz> <textz id="s">S</textz> <textz id="d">D</textz> <textz style="background:transparent;"></textz> <textz style="background:transparent;"></textz> <textz id="l-c">L-C</textz> <textz id="r-c">R-C</textz> <textz style="background:transparent;"></textz> <textz id="space" style="border-radius:0px 0px 8px 8px;width:97%;" >Space</textz ></div>';
    document.getElementById("Check").style.display = "none";
    document.getElementById("SettingsBoxen").style.marginLeft = "-407px";
    document.getElementById("S-X").style.display = "none";
    document.getElementById("HackBoxen").style.marginLeft = "-407px";
    document.getElementById("Hack-X").style.display = "none";
    document.getElementById("ot-sdk-btn-floating").style.display = "none";
    document.getElementById("youtuberOf").style.display = "none";
    document.getElementById("actionBar").style.marginBottom = "24px";
    document.getElementById("ageBarContainer").style.marginBottom = "24px";
    document.getElementById("ageText").style.marginBottom = "24px";
    document.getElementById("gameName").style.color = "red";
    let adCardOldContents = (document.getElementById("adCard").style.display =
        "none");
    document.getElementById("adCard").style.display = "none";
    document.getElementById("adCard").dataset.oldContents = adCardOldContents;
    document.getElementsByClassName("menuCard")[5].style.display = "none";
    let promoImgHolderOldContents = (document.getElementById(
        "promoImgHolder"
    ).style.display = "one");
    document.getElementById("promoImgHolder").style.display = "none";
    document.getElementById(
        "promoImgHolder"
    ).dataset.oldContents = promoImgHolderOldContents;
    document.getElementById("linksContainer2").innerHTML = "~Legion";
    document.getElementById("linksContainer2").style.padding = "5px";
    document.getElementById("linksContainer2").style.color = "red";
    document.getElementById("linksContainer2").style.background = "black";
    document.querySelector(".Nullz").style.padding = Padding4Nullz;
    document.getElementById("Pop-up").style.marginTop = "-110px";
    document.getElementById("Pop-up").style.display = "block";
    document.getElementById("itemInfoHolder").style.visibility = "hidden";
}, 10000)
`;