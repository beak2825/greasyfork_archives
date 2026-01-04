// ==UserScript==
// @name         Macro_To_Win+Bots
// @namespace    http://tampermonkey.net/
// @version      666.1337
// @description  Fuck you
// @author       <>FL3X<>
// @match        http://oib.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395907/Macro_To_Win%2BBots.user.js
// @updateURL https://update.greasyfork.org/scripts/395907/Macro_To_Win%2BBots.meta.js
// ==/UserScript==
// ---------- KEYS ----------
// Pause Break = Move Army To Point
// E = Attack Nearby
// Q = Horizontal Line
// C = Make Nuke
// F = Heal Nuke
// 6 = Toggle Ghost Mode
// HOME = Toggle Plasma
// END = Reset Oib Scale
// PAGE UP = Oib Scale UP
// PAGE DOWN = Oib Scale DOWN
// INSERT (Spam press to activate) = Rush (Makes Oib Bots spawn and goto bottom left corner. OPEN NEW TAB TO USE THIS)
// DELETE = Toggle Feeder Bot (Makes the tab spawn oibs and move the oibs to bottom left corner.)
// H = Toggle Oib Ring (Centered Around Player)
// N = Toggle (Sort of working) "God Mode"
// BACKSLASH ( \ ) = Toggle Is-Bot (Defualt is 1.)
// Z = Make ALL Bots Use Heal (And the main tab if its a healer.)
// X = Make ALL Bots Use Damage Aura (And the main tab if its a witch.)
// L = Toggle Auto-Respawn (Can bug out sometimes and cause main screen to get stuck.)
// J = Toggle Bot Auto-Attack (Works best on warrior. VERY OP CAN KILL ALMOST EVERYTHING IN ONE HIT XD)
(function() {
    // EVENTS
    window.addEventListener('keydown', KeyCheck, true);
    window.addEventListener('beforeunload', onbeforeunload);

    function onbeforeunload(e) {
        e.returnValue = "false";
    };
    window.addEventListener("keydown", CaptureKeyPress);
    window.addEventListener("keyup", CaptureKeyPress);
    window.addEventListener("mousemove", captureMousePos);
    window.addEventListener("click", Click);
    // VARIABLES
    var bc = new BroadcastChannel('sendtobot');
    var abcd = new BroadcastChannel('recievefrombot');
    var pp = new BroadcastChannel('ppToBot');
    var Internet_StressBot = 75;
    var AllOibs = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
    var OibsAndQueen = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49];
    var plsm = 0;
    var ghst = 0;
    var rush = 0;
    var sendoibs = 24;
    var ringsize = 3;
    var linesize = 10;
    var nickname = "";
    var color = "";
    var chatbottext = "";
    var chatbotname = "nocoolbot";
    var chatbotcolor = 0;
    var chatbot = undefined;
    var chatbotactive = 1;
    var fbot = 0;
    var ring = 0;
    var line = 0;
    var respawn = 0;
    var feedbots = 0;
    var ringmode = 0;
    var ping = 0;
    var botplayers = new Array();
    var g1 = false;
    var g2 = false;
    var g3 = false;
    var g4 = false;
    var g5 = false;
    var g6 = false;
    var g7 = false;
    var g8 = false;
    var stopscript = 0;
    var spawndown = false;
    var isbot = 1;
    var seelevels = 0;
    var botattack = 0;
    var botclass = 2;
    var Internet_Stress = 17;
    var botlvl = 0;
    var NukeLevel = 0;
    var reset = 0;
    var beforeoibs = 0;
    var mousebot = 0;
    var FriendThem = 0;
    var smartMM = 0;
    var BotBotlvl = 0;
    var botline = 0;
    var avoid = 0;
    var botfeed = 0;
    var mmsplit = 0;
    var botrain = 0;
    var avoidsize = 425;
    var ringangle = 0;
    var friendbots = 1;
    var botring = 0;
    var spawnoibs = 0;
    var bots = new Array();
    var loop = undefined;
    var playerz = 0;
    var botmode = 0;
    var superslct = 0;
    var TrimOibSizes = 0;
    var ringrotatespeed = 0;
    var LastCommandSent = new Date().getTime();
    var LastCommandSentBot = new Date().getTime();
    var MousePos = {
        x: 0,
        y: 0
    };
    var feeder = setInterval(atck, 500);
    var fast = setInterval(tick, 17);
    DRAW.EASE_DELAY = 0.25;
    DRAW.GROUND_COLOR_DARKER = "#000022";
    DRAW.BORDER_MINIMAP_COLOR = "#261A49";
    DRAW.GAUGE_QUEEN_DISPLAY = 0.9999999999999999;
    DRAW.GAUGE_WIDTH = 64;
    // PP VARS
    var PPstage = 1;
    var mainoib = new Object();
    var otheroib = new Object();
    var otherid = 0;
    var ppmain = 0;
    var PPbot = 0;
    var PPchat = 0;
    var PPdebug = 0;
    var small = new Array();
    var isppbot = 0;
    var usedstage = 0;
    var PPotherstage = 0;
    var time = 0;
    var perlvl = 0;
    var runtime = 0;
    // DECODE STUFF
    var lapas = new Array();
    var split = undefined;
    var regroup = undefined;
    var feed = undefined;
    var OibSizePerLevel = undefined;
    var OibStartSize = undefined;
    var SendSkill1 = undefined;
    var WorldOibs = undefined;
    var players = undefined;
    var socket = undefined;
    var servers = undefined;
    var SetChatFunction = undefined;
    var MoveUnits = undefined;
    var SelectQueen = undefined;
    var SelectOibs = undefined;
    var RemoveSpawnButton = undefined;
    var RemoveGuage = undefined;
    var connect = undefined;
    var pingme = undefined;
    var friend = undefined;

    function ScanGame() {
        if (Object.entries(game).length == 34) {
            RemoveSpawnButton = new Function("game." + Object.entries(game)[11][0] + ".info.translate = [];");
            RemoveGuage = new Function("game." + Object.entries(game)[4][0] + ".x = undefined;");
            console.log("Vars set! Enjoy using kmccord1's Script! :)");
        } else {
            setTimeout(ScanGame, 250)
        }
    }

    function setvars() {
        split = new Function(lapas[1].name + "." + Object.entries(lapas[1])[28][0] + "()");
        regroup = new Function(lapas[1].name + "." + Object.entries(lapas[1])[29][0] + "()");
        feed = new Function(lapas[1].name + "." + Object.entries(lapas[1])[30][0] + "()");
        OibSizePerLevel = new Function("size", "if (size != undefined) { " + lapas[0].name + "." + Object.entries(lapas[0])[0][0] + " = size; } else { return " + lapas[0].name + "." + Object.entries(lapas[0])[0][0] + " }");
        OibStartSize = new Function("size", "if (size != undefined) { " + lapas[0].name + "." + Object.entries(lapas[0])[1][0] + " = size; } else { return " + lapas[0].name + "." + Object.entries(lapas[0])[1][0] + " }");
        SendSkill1 = new Function(lapas[1].name + "." + Object.entries(lapas[1])[43][0] + "()");
        WorldOibs = new Function("return " + lapas[9].name + "." + Object.entries(lapas[9])[2][0]);
        players = new Function("return " + lapas[3].name);
        socket = new Function("return " + lapas[1].name + "." + Object.entries(lapas[1])[0][0]);
        servers = new Function("return " + lapas[1].name + "." + Object.entries(lapas[1])[2][0]);
        SetChatFunction = new Function(lapas[1].name + "." + Object.entries(lapas[1])[27][0] + " = function(x, a) { chat(x); }");
        MoveUnits = new Function("data", lapas[1].name + "." + Object.entries(lapas[1])[31][0] + "(data)");
        SelectQueen = new Function("player.select." + Object.getOwnPropertyNames(player.select)[4] + "()");
        SelectOibs = new Function("player.select." + Object.getOwnPropertyNames(player.select)[3] + "()");
        connect = new Function(lapas[1].name + "." + Object.entries(lapas[1])[52][0] + "()");
        pingme = new Function(lapas[1].name + "." + Object.entries(lapas[1])[49][0] + "()");
        friend = new Function("data", lapas[1].name + "." + Object.entries(lapas[1])[40][0] + "(data)");
        ScanGame();
    }

    function scan() {
        lapas = [];
        var i = 0;
        var a = 0;
        for (i = 0; i < 40000; i++) {
            var testIt = "lapa" + i + "mauve";
            if (typeof(window[testIt]) != "undefined") {
                lapas.push(window[testIt]);
                lapas[a].name = testIt;
                a++;
            }
        }
        if (lapas.length != 13) {
            console.error("Scan for 13 lapamauves failed. Retrying...");
            setTimeout(scan, 500)
        } else {
            if (lapas.length == 13) {
                console.log("13 lapamauves found!");
                setvars();
            }
        }
    }
    scan();
    // KEYS
    function Click(event) {
        if (superslct == 1) {
            SuperSelect();
        }
    }

    function CaptureKeyPress(a) {
        if (game.chat.info.input.info.state == 0 && game.is_run == true) {
            if (a.keyCode == 49) {
                if (a.type == "keydown" && spawndown == false) {
                    spawndown = true;
                    SpawnOibs();
                }
                if (a.type == "keyup" && spawndown == true) {
                    spawndown = false;
                }
            }
            if (a.keyCode == 19) {
                if (a.type == "keydown" && g1 == false) {
                    g1 = true;
                    MoveArmyToPoint();
                }
                if (a.type == "keyup" && g1 == true) {
                    g1 = false;
                }
            }
            if (a.keyCode == 69) {
                if (a.type == "keydown" && g2 == false) {
                    g2 = true;
                    AttackNearby();
                }
                if (a.type == "keyup" && g2 == true) {
                    g2 = false;
                }
            }
            if (a.keyCode == 192) {
                if (a.type == "keydown" && g3 == false) {
                    g3 = true;
                    AutoHeal();
                }
                if (a.type == "keyup" && g3 == true) {
                    g3 = false;
                }
            }
            if (a.keyCode == 67 && isppbot == false) {
                if (a.type == "keydown" && g5 == false) {
                    g5 = true;
                    MakeNuke();
                }
                if (a.type == "keyup" && g5 == true) {
                    g5 = false;
                }
            }
            if (a.keyCode == 80) {
                if (a.type == "keydown" && g6 == false) {
                    g6 = true;
                    MoveHeal();
                }
                if (a.type == "keyup" && g6 == true) {
                    g6 = false;
                }
            }
            if (a.keyCode == 70) {
                if (a.type == "keydown" && g7 == false) {
                    g7 = true;
                    HealNuke();
                }
                if (a.type == "keyup" && g7 == true) {
                    g7 = false;
                }
            }
            if (a.keyCode == 79) {
                if (a.type == "keydown" && g8 == false) {
                    g8 = true;
                    FeedOib();
                }
                if (a.type == "keyup" && g8 == true) {
                    g8 = false;
                }
            }
        }
    }

    function KeyCheck(e) {
        if (game.chat.info.input.info.state == 0 && game.is_run == true) {
            if (e.keyCode == 54) {
                ghst += 1;
                if (ghst >= 2) {
                    ghst = 0;
                }
                if (ghst == 1) {
                    for (var i = 0; i < players().length; i++) {
                        if (players()[i]) players()[i].vuln = 1;
                    }
                }
                if (ghst == 0) {
                    for (var k = 0; k < players().length; k++) {
                        if (players()[k]) players()[k].vuln = 0;
                    }
                }
            }
            if (e.keyCode == 36) {
                plsm += 1;
                if (plsm >= 2) {
                    plsm = 0;
                }
            }
            if (e.keyCode == 67 && isppbot == 1) {
                PPchat += 1;
                if (PPchat >= 2) {
                    PPchat = 0;
                }
                if (PPchat == 1) {
                    player.army.v = "          PP BOT NOW REPORTING STATS IN CHAT          ";
                } else {
                    player.army.v = "          PP BOT IS SILENT          ";
                }
            }
            if (e.keyCode == 117) {
                e.preventDefault();
                botmode += 1;
                if (botmode >= 5) {
                    botmode = 0;
                }
                if (botmode == 0) {
                    player.army.v = "          BOT MODE: GO TO CURSOR          ";
                }
                if (botmode == 1) {
                    player.army.v = "          BOT MODE: LINE UNDER CURSOR          ";
                }
                if (botmode == 2) {
                    player.army.v = "          BOT MODE: STAND STILL          ";
                }
                if (botmode == 3) {
                    player.army.v = "          BOT MODE: MOVE OIB WIDE + GO TO CURSOR          ";
                }
                if (botmode == 4) {
                    player.army.v = "          BOT MODE: RING OF BOTS          ";
                }
            }
            if (e.keyCode == 118) {
                e.preventDefault();
                spawnoibs += 1;
                if (spawnoibs >= 2) {
                    spawnoibs = 0;
                }
                if (spawnoibs == 1) {
                    player.army.v = "          BOT RAIN: SPAWNING OIBS       ";
                } else {
                    player.army.v = "          BOT RAIN: NO SPAWN OIBS          ";
                }
            }
            if (e.keyCode == 35) {
                OibSizePerLevel(0.17857);
                OibStartSize(0.5);
                reset = 1;
            }
            if (e.keyCode == 33) {
                OibSizePerLevel(OibSizePerLevel() * 1.1);
                OibStartSize(OibStartSize() * 1.1);
                reset = 1;
            }
            if (e.keyCode == 34) {
                OibSizePerLevel(OibSizePerLevel() * 0.9);
                OibStartSize(OibStartSize() * 0.9);
                reset = 1;
            }
            if (e.keyCode == 45) {
                rush += 1;
            }
            if (e.keyCode == 46) {
                fbot += 1;
                if (fbot >= 2) {
                    fbot = 0;
                }
            }
            if (e.keyCode == 72) {
                ring += 1;
                line = 0;
                if (ring >= 2) {
                    ring = 0;
                }
            }
            if (e.keyCode == 220) {
                isbot += 1;
                if (isbot >= 2) {
                    isbot = 0;
                }
                if (isbot == 1) {
                    player.army.v = "          BROADCASTING TO BOTS IS OFF          ";
                } else {
                    player.army.v = "          BROADCASTING TO BOTS IS ON          ";
                }
            }
            if (e.keyCode == 73) {
                chatbotconnect();
                isppbot += 1;
                if (isppbot >= 2) {
                    isppbot = 0;
                }
                if (isppbot == 1) {
                    player.army.v = "          USING AS THE PP BOT          ";
                } else {
                    player.army.v = "          USING AS A NON PP TAB          ";
                }
            }
            if (e.keyCode == 189) {
                Internet_StressBot -= 1;
                player.army.v = Internet_StressBot
                if (Internet_StressBot < 17) {
                    Internet_StressBot = 17;
                    player.army.v = Internet_StressBot
                }
            }
            if (e.keyCode == 187) {
                Internet_StressBot += 1;
                player.army.v = Internet_StressBot
            }
            if (e.keyCode == 219) {
                if (ring == 1) {
                    ringsize -= 0.1;
                }
                if (line == 1) {
                    linesize -= 0.25;
                }
                if (avoid == 1 && line == 0 && ring == 0) {
                    avoidsize -= 5
                    player.army.v = "          AvoidRadius: " + avoidsize + "          ";
                }
                if (avoid == 0 && line == 0 && ring == 0) {
                    sendoibs -= 1
                    player.army.v = "          Smart-MM oibs to middle: " + (sendoibs + 1) + "          ";
                }
            }
            if (e.keyCode == 190) {
                botfeed += 1;
                if (botfeed >= 2) {
                    botfeed = 0;
                }
                if (botfeed == 1) {
                    player.army.v = "          FEED BOTS ON          ";
                } else {
                    player.army.v = "          FEED BOTS OFF          ";
                }
            }
            if (e.keyCode == 48) {
                avoid += 1;
                if (avoid >= 2) {
                    avoid = 0;
                }
                if (avoid == 1) {
                    player.army.v = "          AVOID MODE ON          ";
                } else {
                    player.army.v = "          AVOID MODE OFF          ";
                }
            }
            if (e.keyCode == 115) {
                botrain += 1;
                if (botrain >= 2) {
                    botrain = 0;
                }
                if (botrain == 1) {
                    player.army.v = "          BOT RAIN ON          ";
                    loop = setInterval(makebots, 333);
                } else {
                    player.army.v = "          BOT RAIN OFF          ";
                    clearInterval(loop);
                    for (var zz = 0; zz < bots.length; zz++)
                    {
                        bots[zz].close();
                    }
                    bots = new Array();
                    botplayers = new Array();
                }
            }
            if (e.keyCode == 55) {
                mmsplit += 1;
                if (mmsplit >= 2) {
                    mmsplit = 0;
                }
                if (mmsplit == 1) {
                    player.army.v = "          BOT OIB SPLIT ON          ";
                } else {
                    player.army.v = "          BOT OIB SPLIT OFF          ";
                }
            }
            if (e.keyCode == 221) {
                if (ring == 1) {
                    ringsize += 0.1;
                }
                if (line == 1) {
                    linesize += 0.25;
                }
                if (avoid == 1 && line == 0 && ring == 0) {
                    avoidsize += 5
                    player.army.v = "          AvoidRadius: " + avoidsize + "          ";
                }
                if (avoid == 0 && line == 0 && ring == 0) {
                    sendoibs += 1
                    player.army.v = "          Smart-MM oibs to middle: " + (sendoibs + 1) + "          ";
                }
            }
            if (e.keyCode == 109) {
                stopscript += 1;
                if (stopscript >= 3) {
                    player.army.v = "          THE SCRIPT HAS BEEN STOPPED.          ";
                    player.army.m = 50;
                    DRAW.EASE_DELAY = 1;
                    window.removeEventListener("keydown", CaptureKeyPress);
                    window.removeEventListener("keyup", CaptureKeyPress);
                    window.removeEventListener("mousemove", captureMousePos);
                    window.removeEventListener("beforeunload", onbeforeunload);
                    window.removeEventListener('keydown', KeyCheck, true);
                    window.removeEventListener("click", Click);
                    window.onbeforeunload = undefined;
                    clearInterval(feeder);
                    clearInterval(fast);
                    bc.close();
                    abcd.close();
                    pp.close();
                    g1 = false;
                    g2 = false;
                    g3 = false;
                    g4 = false;
                    g5 = false;
                    g6 = false;
                    g7 = false;
                    g8 = false;
                    spawndown = false;
                    bc = undefined;
                    abcd = undefined;
                    pp = undefined;
                }
            }
            if (e.keyCode == 186) {
                if (ring == 1) {
                    ringrotatespeed -= 0.0025;
                }
            }
            if (e.keyCode == 222) {
                if (ring == 1) {
                    ringrotatespeed += 0.0025;
                }
            }
            if (e.keyCode == 90) {
                if (isbot == 0) {
                    bc.postMessage("SendHealer");
                    if (player.crown == 3) {
                        SendSkill1();
                    }
                }
            }
            if (e.keyCode == 88) {
                if (isbot == 0) {
                    bc.postMessage("SendWitch");
                    if (player.crown == 4) {
                        SendSkill1();
                    }
                }
            }
            if (e.keyCode == 76) {
                respawn += 1;
                if (respawn >= 2) {
                    respawn = 0;
                }
                if (respawn == 1) {
                    player.army.v = "          AUTO RESPAWN IS ON          ";
                } else {
                    player.army.v = "          AUTO RESPAWN IS OFF          ";
                }
            }
            if (e.keyCode == 89) {
                superslct += 1;
                if (superslct >= 2) {
                    superslct = 0;
                }
                if (superslct == 1) {
                    player.army.v = "          SELECT ANY OIB IS ON          ";
                } else {
                    player.army.v = "          SELECT ANY OIB IS OFF          ";
                }
            }
            if (e.keyCode == 56) {
                smartMM += 1;
                if (smartMM >= 2) {
                    smartMM = 0;
                }
                if (smartMM == 1) {
                    player.army.v = "          SMART MM IS ON          ";
                } else {
                    player.army.v = "          SMART MM IS OFF          ";
                }
            }
            if (e.keyCode == 74) {
                botattack += 1;
                if (botattack >= 2) {
                    botattack = 0;
                }
                if (botattack == 1) {
                    player.army.v = "          BOT ATTACK HAS BEEN TURNED ON          ";
                }
                if (botattack == 0) {
                    player.army.v = "          BOT ATTACK HAS BEEN TURNED OFF          ";
                }
            }
            if (e.keyCode == 113) {
                chatbotactive += 1;
                if (chatbotactive >= 2) {
                    chatbotactive = 0;
                }
                if (chatbotactive == 1) {
                    player.army.v = "          CHAT BOT HAS BEEN TURNED ON          ";
                    chatbotconnect();
                }
                if (chatbotactive == 0) {
                    player.army.v = "          CHAT BOT HAS BEEN TURNED OFF          ";
                    clearInterval(window.timer1);
                    clearInterval(window.timer2);
                    chatbot.close();
                }
            }
            if (e.keyCode == 78) {
                seelevels += 1;
                if (seelevels >= 2) {
                    seelevels = 0;
                }
            }
            if (e.keyCode == 75) {
                PPbot += 1;
                if (PPbot >= 2) {
                    PPbot = 0;
                }
                if (PPbot == 1) {
                    ppmain = 1;
                    player.army.v = "          PP BOT TURNED ON          ";
                } else {
                    ppmain = 0;
                    player.army.v = "          PP BOT TURNED OFF          ";
                }
            }
            if (e.keyCode == 191) {
                pp.postMessage({
                    stage: 0
                });
                PPbot = 0;
                PPstage = 1;
                PPotherstage = 0;
                player.army.v = "          PP STAGES RESET          ";
            }
            if (e.keyCode == 77) {
                FriendThem += 1;
                if (FriendThem >= 2) {
                    FriendThem = 0;
                }
                if (FriendThem == 1) {
                    player.army.v = "          FRIEND BOTS TURNED ON          ";
                } else {
                    player.army.v = "          FRIEND BOTS TURNED OFF          ";
                }
            }
            if (e.keyCode == 57) {
                nickname = prompt("Name to chat with (Put nothing to reset name):");
                color = prompt("Color (black, pink, blue, purple, orange, aqua):");
            }
            if (e.keyCode == 85) {
                TrimOibSizes += 1;
                if (TrimOibSizes >= 2) {
                    TrimOibSizes = 0;
                }
                if (TrimOibSizes == 1) {
                    player.army.v = "          OIB SIZE TRIMMING ON          ";
                } else {
                    player.army.v = "          OIB SIZE TRIMMING OFF          ";
                }
            }
            if (e.keyCode == 81) {
                if (isppbot == 0) {
                    line += 1;
                    ring = 0;
                    if (line >= 2) {
                        line = 0;
                    }
                } else {
                    PPdebug += 1;
                    if (PPdebug >= 2) {
                        PPdebug = 0;
                    }
                    if (PPdebug == 1) {
                        player.army.v = "          PP IS DEBUGGING          ";
                    }
                    if (PPdebug == 0) {
                        player.army.v = "          PP IS NOT DEBUGGING          ";
                    }
                }
            }
            if (e.keyCode == 112) {
                e.preventDefault();
                ringmode += 1;
                if (ringmode >= 2) {
                    ringmode = 0;
                }
                if (ringmode == 1) {
                    player.army.v = "          RING PER LEVEL IS ON          ";
                }
                if (ringmode == 0) {
                    player.army.v = "          RING PER LEVEL IS OFF          ";
                }
            }
            if (e.keyCode == 120) {
                e.preventDefault();
                feedbots += 1;
                if (feedbots >= 2) {
                    feedbots = 0;
                }
                if (feedbots == 1) {
                    player.army.v = "          FEED BOTS OM          ";
                }
                if (feedbots == 0) {
                    player.army.v = "          FEED BOTS OFF          ";
                }
            }
            if (e.keyCode == 119) {
                e.preventDefault();
                botclass += 1;
                if (botclass >= 6) {
                    botclass = 0;
                }
                if (botclass == 0) {
                    player.army.v = "          BOT RAIN: QUEEN          ";
                }
                if (botclass == 1) {
                    player.army.v = "          BOT RAIN: NECRO          ";
                }
                if (botclass == 2) {
                    player.army.v = "          BOT RAIN: WARRIOR          ";
                }
                if (botclass == 3) {
                    player.army.v = "          BOT RAIN: ANGEL          ";
                }
                if (botclass == 4) {
                    player.army.v = "          BOT RAIN: WITCH          ";
                }
                if (botclass == 5) {
                    player.army.v = "          BOT RAIN: FLASH          ";
                }
            }
            if (e.keyCode == 121) {
                e.preventDefault();
                friendbots += 1;
                if (friendbots >= 2) {
                    friendbots = 0;
                }
                if (friendbots == 0) {
                    player.army.v = "          QUEEN IS NOT FRIENDED          ";
                }
                if (friendbots == 1) {
                    player.army.v = "          QUEEN IS FRIENDED          ";
                }
            }
            if (e.keyCode == 84) {
                mousebot += 1;
                if (mousebot >= 2) {
                    mousebot = 0;
                }
                if (mousebot == 1) {
                    player.army.v = "          BOT MISSILE HAS BEEN TURNED ON          ";
                }
                if (mousebot == 0) {
                    player.army.v = "          BOT MISSILE HAS BEEN TURNED OFF          ";
                }
            }
        }
    }
    // FUNCTIONS
    window.chat = function(texts, name, clr) {
        var b = undefined;
        if (Object.entries(ui).length == 77) {
            b = Object.entries(ui)[49][1].info.choice;
        } else {
            b = Object.entries(ui)[48][1].info.choice;
        }
        var fakebot = new WebSocket("ws://" + servers()[b].i + ":" + servers()[b].p);
        fakebot.onopen = function() {
            if (name != undefined && color != undefined) {
                fakebot.send(JSON.stringify([name, clr, 0, 0, 0, 0, Object.entries(lapas[2])[21][1]]));
            } else {
                fakebot.send(JSON.stringify([nickname, color, 0, 0, 0, 0, Object.entries(lapas[2])[21][1]]));
            }
            fakebot.send(JSON.stringify([0, texts]));
            fakebot.close();
        };
    }
    SetChatFunction();

    function chatbotconnect() {
        var b = undefined;
        var ppl = new Array();
        var die = 0;
        if (Object.entries(ui).length == 77) {
            b = Object.entries(ui)[49][1].info.choice;
        } else {
            b = Object.entries(ui)[48][1].info.choice;
        }
        chatbot = new WebSocket("ws://" + servers()[b].i + ":" + servers()[b].p);
        chatbot.onmessage =
            function(b) {
            if (0 == 0)
                if ("string" == typeof b.data) switch (b = JSON.parse(b.data), b[0]) {
                    case 0:
                        chatbottext = b[2];
                        if (chatbottext.charAt(0) == ".") {
                            chatbottext = chatbottext.slice(1);
                            if (chatbottext == "help") {
                                chat("Commands: help, whomade, givemacro, countdown <startnum>,", chatbotname, chatbotcolor);
                                chat("level <lvl>, nou, lapa, clearchat, online", chatbotname, chatbotcolor);
                            }
                            if (chatbottext == "whomade") {
                                chat("ChatBot was made by kmccord1, Also known previously as [Rekt] :D", chatbotname, chatbotcolor);
                            }
                            if (chatbottext == "nou") {
                                chat("no u", chatbotname, chatbotcolor);
                            }
                            if (chatbottext == "online") {
                                chat("Players on this server:", chatbotname, chatbotcolor);
                                for (var i = 0; i < players().length; i++) {
                                    if (players()[i].bot == false && players()[i].alive == true) {
                                        chat("Name: ( " + players()[i].nickname + " ) Score: ( " + players()[i].score + " )", chatbotname, chatbotcolor);
                                    }
                                }
                            }
                            if (chatbottext == "clearchat") {
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                                chat(" ", " ", 0);
                            }
                            if (chatbottext == "lapa") {
                                chat("hi i do updates... sometimes...", "LapaMauve", 3);
                            }
                            if (chatbottext == "secret") {
                                chat("OOOH you found a secret command? :o", chatbotname, chatbotcolor);
                            }
                            if (chatbottext == "givemacro") {
                                var say = Math.round(Math.random() * 5);
                                if (say == 0) {
                                    chat("no", chatbotname, chatbotcolor);
                                }
                                if (say == 1) {
                                    chat("NO", chatbotname, chatbotcolor);
                                }
                                if (say == 2) {
                                    chat("no noob", chatbotname, chatbotcolor);
                                }
                                if (say == 3) {
                                    chat("hmmmmm NO", chatbotname, chatbotcolor);
                                }
                                if (say == 4) {
                                    chat("nope xd", chatbotname, chatbotcolor);
                                }
                                if (say == 5) {
                                    chat("n0 :(", chatbotname, chatbotcolor);
                                }
                            }
                            if (chatbottext.slice(0, 9) == "countdown") {
                                var numba = chatbottext.slice(10);
                                numba++;
                                numba--;
                                clearInterval(window.timer1);
                                window.timer1 = setInterval(ticktock, 1000);

                                function ticktock() {
                                    if (numba > 0) {
                                        chat("" + numba, chatbotname, chatbotcolor);
                                    } else {
                                        chat("boom", chatbotname, chatbotcolor);
                                        clearInterval(window.timer1);
                                    }
                                    numba--;
                                }
                            }
                            if (chatbottext.slice(0, 5) == "level") {
                                var levelspawned = chatbottext.slice(6);
                                var level = chatbottext.slice(6);
                                levelspawned = Math.round((level / 4) + 0.499999999999999);
                                level++;
                                level--;
                                if (level - level != 0) {
                                    chat("Thats not a number -.-", chatbotname, chatbotcolor);
                                } else {
                                    chat("If you were level " + level + ", Youd spawn level " + levelspawned + " oibs.", chatbotname, chatbotcolor);
                                }
                            }
                        }
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    case 3:
                }
                else {
                    var d = new Uint8Array(b.data);
                    switch (d[0]) {
                        case 0:
                            break;
                        case 1:
                            break;
                        case 2:
                            break;
                        case 3:
                            break;
                        case 4:
                            break;
                        case 5:
                            break;
                        case 6:
                            break;
                        case 7:
                            break;
                        case 8:
                            break;
                        case 20:
                            break;
                        case 21:
                            break;
                        case 22:
                            break;
                        case 23:
                            break;
                        case 24:
                            break;
                        case 25:
                            break;
                        case 26:
                            break;
                        case 27:
                            break;
                        case 28:
                    }
                }
        };
        chatbot.onopen = function() {
            chatbot.send(JSON.stringify(["ChatBot", 0, 0, 0, 0, 0, Object.entries(lapas[2])[21][1]]));
        }
        chatbot.onclose = function() {
            if (chatbotactive == 1) {
                chatbotconnect();
            } else {
                chatbot = undefined;
            }
        }
    }

    function SpawnOibs() {
        socket().send(new Uint8Array([0]));
        if (spawndown == true) {
            setTimeout(() => {
                SpawnOibs();
            }, 17);
        }
    }

    function RunAway() {
        small = player.select.units;
        var j = 0;
        var k = 0;
        var MinDistance = 100;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var AimbotTarget = new Object();
        var GameOibs = WorldOibs();
        var Oibs = new Array();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    }
                }
                if (GameOibs[k].id != player.id) {
                    if (players()[player.id].nickname != players()[GameOibs[k].id].nickname) {
                        if (lapas[9].mode == 1) {
                            if (players()[player.id].color == players()[GameOibs[k].id].color) {} else {
                                Oibs.push(GameOibs[k]);
                            }
                        } else {
                            Oibs.push(GameOibs[k]);
                        }
                    }
                }
            }
        }
        var Mpos = My_Queen;
        var dist = 0;
        for (j = 0; j < Oibs.length; j++) {
            if (j == 0) {
                AimbotTarget = Oibs[j];
            } else {
                if (GetDistance((Oibs[j].x), (Oibs[j].y), Math.abs(Mpos.x), Math.abs(Mpos.y)) < GetDistance((AimbotTarget.x), (AimbotTarget.y), Math.abs(Mpos.x), Math.abs(Mpos.y))) {
                    AimbotTarget = Oibs[j];
                }
            }
        }
        var diffX = 0;
        var diffY = 0;
        var angle = 0;
        var radius = 0;
        var nPos = {
            x: 0,
            y: 0
        };
        radius = avoidsize;
        MinDistance = Math.abs(radius);
        if (MinDistance > GetDistance((AimbotTarget.x), (AimbotTarget.y), Math.abs(Mpos.x), Math.abs(Mpos.y))) {
            radius = (radius * -1) - 5;
            if (AimbotTarget != new Object()) {
                diffX = My_Queen.x - AimbotTarget.x;
                diffY = My_Queen.y - AimbotTarget.y;
                angle = Math.atan2(diffY, diffX);
                nPos.x = Math.round(AimbotTarget.x - radius * Math.cos(angle));
                nPos.y = Math.round(AimbotTarget.y - radius * Math.sin(angle));
                player.select.units = [];
                player.select.units.push(My_Queen);
                FCallMoveOib(nPos);
            }
        }
        player.select.units = small;
    }

    function PPBot() {
        if (PPdebug == 1) {
            console.log(PPstage);
        }
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var My_Oibs2 = new Array();
        var GameOibs = WorldOibs();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens.push(GameOibs[k]);
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        if (My_Queen.x != 1 || My_Queen.y != 4999) {
            small = player.select.units;
            player.select.units = [];
            player.select.units.push(My_Queen);
            FCallMovePos(1, 4999);
            player.select.units = [];
            player.select.units = small;
        }
        if (PPstage == 1) {
            if (runtime == 0) {
                time = new Date().getTime();
                runtime++;
            }
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 3) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            usedstage = 0;
            player.select.units = [];
            if (player.army.v > 1) {
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                PPstage++;
            }
        }
        if (PPstage == 2) {
            runtime = 0;
            player.select.units = [];
            if (mainoib.life < mainoib.level * (botlvl * 0.95)) {
                socket().send(new Uint8Array([0]));
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level <= mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(mainoib);
                        player.select.units.push(My_Oibs[k]);
                        regroup();
                    }
                }
            } else {
                PPstage++;
            }
        }
        if (PPstage == 3) {
            player.select.units = [];
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level <= mainoib.level - 2) {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    player.select.units.push(My_Oibs[k]);
                    regroup();
                }
            }
            var kk = 0;
            for (k = 0; k < players().length; k++) {
                if (players()[k].nickname == "kmccord2" && players()[k].crown == 1) {
                    otherid = k;
                    k = 99;
                    for (kk = 0; kk < GameOibs.length; kk++) {
                        if (GameOibs[kk] != undefined) {
                            if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                                My_Oibs2.push(GameOibs[kk]);
                            }
                        }
                    }
                    for (kk = 0; kk < My_Oibs2.length; kk++) {
                        if (kk == 0) {
                            otheroib = My_Oibs2[kk];
                        } else {
                            if (My_Oibs2[kk].level > otheroib.level) {
                                otheroib = My_Oibs2[kk];
                            }
                        }
                    }
                    if (player.army.v < 3) {
                        if (mainoib.x != 251 || mainoib.y != 4749) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            FCallMovePos(251, 4749);
                        } else {
                            player.select.units.push(mainoib);
                            split();
                            FCallMoveOib(otheroib);
                            PPstage++;
                        }
                    }
                }
            }
        }
        if (PPstage == 4) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 3) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            if (mainoib.x == otheroib.x && mainoib.y == otheroib.y) {
                player.select.units = [];
                player.select.units.push(mainoib);
                split();
                pp.postMessage({
                    stage: 1
                });
                PPstage++;
            } else {
                player.select.units = [];
                player.select.units.push(mainoib);
                FCallMoveOib(otheroib);
            }
        }
        if (PPstage == 5) {
            for (k = 0; k < My_Oibs.length; k++) {
                if (k == 0) {
                    mainoib = My_Oibs[k];
                } else {
                    if (My_Oibs[k].level > mainoib.level) {
                        mainoib = My_Oibs[k];
                    }
                }
            }
            if (mainoib.life < mainoib.level * (botlvl * 0.95)) {
                socket().send(new Uint8Array([0]));
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level <= mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(mainoib);
                        player.select.units.push(My_Oibs[k]);
                        regroup();
                    }
                }
            } else {
                player.select.units = [];
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
            }
            if (player.army.v == 2) {
                if (mainoib.x != 251 || mainoib.y != 4749) {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    FCallMovePos(251, 4749);
                } else {
                    player.select.units = [];
                    PPstage++;
                }
            }
        }
        if (PPstage == 6) {
            for (k = 0; k < My_Oibs.length; k++) {
                if (k == 0) {
                    mainoib = My_Oibs[k];
                } else {
                    if (My_Oibs[k].level > mainoib.level) {
                        mainoib = My_Oibs[k];
                    }
                }
            }
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level <= mainoib.level - 3) {
                    player.select.units.push(My_Oibs[k]);
                }
            }
            regroup();
            player.select.units = [];
            if (player.army.v == 3) {
                PPstage++;
            }
        }
        if (PPstage == 7) {
            if (usedstage == 0) {
                usedstage++;
                pp.postMessage({
                    stage: 7
                });
            }
            var aaa = new Object();
            for (k = 0; k < My_Oibs.length; k++) {
                if (k == 0) {
                    mainoib = My_Oibs[k];
                } else {
                    if (My_Oibs[k].level > mainoib.level) {
                        mainoib = My_Oibs[k];
                    }
                }
            }
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level == mainoib.level - 2) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    FCallMovePos(mainoib.x, mainoib.y - 230);
                    aaa = My_Oibs[k];
                }
                if (mainoib.life < mainoib.level * (botlvl * 0.95)) {
                    socket().send(new Uint8Array([0]));
                    if (My_Oibs[k].level <= mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(mainoib);
                        player.select.units.push(My_Oibs[k]);
                        regroup();
                    }
                }
            }
            if (aaa.x == mainoib.x && aaa.y == mainoib.y - 230) {
                if (mainoib.life >= mainoib.level * (botlvl * 0.95)) {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level <= mainoib.level - 3) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                    player.select.units = [];
                    usedstage = 0;
                    PPstage++;
                }
            }
        }
        if (PPstage == 8) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 4) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            var x = 0
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level == mainoib.level - 1) {
                    aaa = My_Oibs[k];
                }
            }
            if (player.army.v >= 5) {
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level == mainoib.level - 4) {
                        player.select.units.push(My_Oibs[k]);
                        x++;
                        if (x >= 1) {
                            player.select.units.push(mainoib);
                            regroup();
                            player.select.units = [];
                        }
                    }
                }
                if (x >= 2) {
                    PPstage++;
                }
            }
        }
        if (PPstage == 9) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 4) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            usedstage = 0;
            for (k = 0; k < My_Oibs.length; k++) {
                if (k == 0) {
                    mainoib = My_Oibs[k];
                } else {
                    if (My_Oibs[k].level > mainoib.level) {
                        mainoib = My_Oibs[k];
                    }
                }
            }
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level == mainoib.level - 1) {
                    aaa = My_Oibs[k];
                }
            }
            for (kk = 0; kk < GameOibs.length; kk++) {
                if (GameOibs[kk] != undefined) {
                    if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                        My_Oibs2.push(GameOibs[kk]);
                    }
                }
            }
            for (kk = 0; kk < My_Oibs2.length; kk++) {
                if (kk == 0) {
                    otheroib = My_Oibs2[kk];
                } else {
                    if (My_Oibs2[kk].level > otheroib.level) {
                        otheroib = My_Oibs2[kk];
                    }
                }
            }
            if (aaa.x == otheroib.x && aaa.y == otheroib.y) {
                player.select.units = [];
                player.select.units.push(aaa);
                split();
                pp.postMessage({
                    stage: 11
                });
                var oib1 = new Object();
                var oib2 = new Object();
                PPstage++;
            } else {
                player.select.units = [];
                player.select.units.push(aaa);
                FCallMoveOib(otheroib);
            }
        }
        if (PPstage == 10) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 3) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            if (player.army.v == 4) {
                for (kk = 0; kk < GameOibs.length; kk++) {
                    if (GameOibs[kk] != undefined) {
                        if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                            My_Oibs2.push(GameOibs[kk]);
                        }
                    }
                }
                for (kk = 0; kk < My_Oibs2.length; kk++) {
                    if (kk == 0) {
                        otheroib = My_Oibs2[kk];
                    } else {
                        if (My_Oibs2[kk].level > otheroib.level) {
                            otheroib = My_Oibs2[kk];
                        }
                    }
                }
                var number = 0;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level == mainoib.level - 3) {
                        number++;
                        if (number == 1) {
                            oib1 = My_Oibs[k];
                        }
                        if (number == 2) {
                            oib2 = My_Oibs[k];
                        }
                    }
                }
                if (oib2.x == 450 && oib2.y == otheroib.y && oib1.x == otheroib.x && oib1.y == otheroib.y) {
                    player.select.units = [];
                    player.select.units.push(oib1);
                    split();
                    pp.postMessage({
                        stage: 14
                    });
                    PPstage++;
                } else {
                    player.select.units = [];
                    player.select.units.push(oib2);
                    FCallMovePos(450, otheroib.y);
                    player.select.units = [];
                    player.select.units.push(oib1);
                    FCallMoveOib(otheroib);
                    player.select.units = [];
                }
            }
        }
        if (PPstage == 11) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 3) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            for (kk = 0; kk < GameOibs.length; kk++) {
                if (GameOibs[kk] != undefined) {
                    if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                        My_Oibs2.push(GameOibs[kk]);
                    }
                }
            }
            for (kk = 0; kk < My_Oibs2.length; kk++) {
                if (kk == 0) {
                    otheroib = My_Oibs2[kk];
                } else {
                    if (My_Oibs2[kk].level > otheroib.level) {
                        otheroib = My_Oibs2[kk];
                    }
                }
            }
            number = 0;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level == mainoib.level - 3) {
                    number++;
                    if (number == 1) {
                        oib2 = My_Oibs[k];
                    }
                }
                if (number == 0) {
                    oib2 = "eaten";
                }
            }
            if (oib2 == "eaten") {
                pp.postMessage({
                    stage: 18
                });
                player.select.units = [];
                PPstage++;
            } else {
                player.select.units = [];
                player.select.units.push(oib2);
                FCallMoveOib(otheroib);
                player.select.units = [];
            }
        }
        if (PPstage == 12) {
            small = player.select.units;
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Oibs[k].level < mainoib.level - 3) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    player.select.units = [];
                }
            }
            player.select.units = small;
            if (player.army.v == 2) {
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                PPstage = 1;
                perlvl = new Date().getTime() - time;
                perlvl = perlvl / 1000;
                var sendthis = perlvl + " Seconds For 1 Level. ( Lvl " + mainoib.level + " )";
                if (PPdebug == 1) {
                    console.log(sendthis);
                }
                if (PPchat == 1) {
                    socket().send(JSON.stringify([0, sendthis]));
                }
            }
        }
    }

    function getplayercount()
    {
        playerz = 0;
        for (var a = 0; a < players().length; a++)
        {
            if (players()[a].bot == false && players()[a].alive == true)
            {
                playerz++;
            }
        }
        if (friendbots == 1)
        {
            for (var l = 0; l < players().length; l++)
            {
                if (players()[l].friend == 0 && players()[l].nickname == "00)")
                {
                    players()[l].friend = 1;
                    socket().send(JSON.stringify([6,l]));
                }
            }
        }
        else
        {
            for (var l2 = 0; l2 < players().length; l2++)
            {
                if (players()[l2].friend == 1 && players()[l2].nickname == "00")
                {
                    players()[l2].friend = 0;
                    socket().send(JSON.stringify([6,l2]));
                }
            }
        }
        for (var i = 0; i < bots.length; i++)
        {
            if (bots[i].opened == 1 && bots[i].readyState == 1)
            {
                if (typeof(botplayers[i]) == "undefined")
                {
                    botplayers.push([]);
                }
                for (var e = 0; e < players().length; e++)
                {
                    if (typeof(botplayers[i][e]) == "undefined")
                    {
                        if (players()[e].bot != true)
                        {
                            botplayers[i][e] = {
                                name: players()[e].nickname,
                                bot: players()[e].bot,
                                alive: players()[e].alive,
                                friended: 0
                            }
                        }
                        else
                        {
                            botplayers[i][e] = {
                                name: players()[e].nickname,
                                bot: players()[e].bot,
                                alive: undefined,
                                friended: 0
                            }
                        }
                    }
                    else
                    {
                        botplayers[i][e].name = players()[e].nickname;
                        if (botplayers[i][e].bot == false)
                        {
                            botplayers[i][e].alive = players()[e].alive;
                        }
                        if (botplayers[i][e].alive == false)
                        {
                            botplayers[i][e].friended = 0;
                        }
                    }
                    if (botplayers[i][e].friended == 0 && botplayers[i][e].alive == true)
                    {
                        if (botplayers[i][e].name == "00" || botplayers[i][e].name == "00")
                        {
                            botplayers[i][e].friended = 1;
                            bots[i].send(JSON.stringify([6,e]));
                        }
                    }
                }
            }
        }
    }

    function remove()
    {
        for (var i = 0; i < bots.length; i++)
        {
            if (bots[i].readyState == 3 && bots[i].opened == 1 || bots[i] == null || bots[i] == undefined)
            {
                bots[i].close();
                bots.splice(i, 1);
                botplayers.splice(i, 1);
            }
        }
    }

    function deathbybots()
    {
        console.log(bots);
        console.log(botplayers);
        if (playerz < 30 && bots.length < 30)
        {
            try
            {
                var b = undefined;
                if (Object.entries(ui).length == 77) {
                    b = Object.entries(ui)[49][1].info.choice;
                } else {
                    b = Object.entries(ui)[48][1].info.choice;
                }
                bots.push( new WebSocket("ws://" + servers()[b].i + ":" + servers()[b].p) )
                bots[bots.length - 1].onopen = function()
                {
                    bots[bots.length - 1].send(JSON.stringify(["00", Math.round(Math.random()*5), Math.round(Math.random()*5), botclass, 0, 0, Object.entries(lapas[2])[21][1]]));
                    bots[bots.length - 1].opened = 1;
                }
            }
            catch (e)
            {
            }
        }
        if (playerz > 30)
        {
            bots[0].close();
            bots.splice(0, 1);
            botplayers.splice(0, 1);
        }
    }

    function makethemdoshit()
    {
        ping++;
        if (feedbots == 0)
        {
            if (botmode == 0)
            {
                for (var i = 0; i < bots.length; i++)
                {
                    if (bots[i].readyState == 1 && bots[i].opened == 1 || bots[i] != null || bots[i] != undefined)
                    {
                        if (spawnoibs == 1)
                        {
                            bots[i].send(new Uint8Array([0]));
                        }
                        for (var xd = 0; xd < 50; xd++)
                        {
                            bots[i].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,[xd]]));
                        }
                    }
                }
            }
            if (botmode == 1)
            {
                for (var ii = 0; ii < bots.length; ii++)
                {
                    if (bots[ii].readyState == 1 && bots[ii].opened == 1 || bots[ii] != null || bots[ii] != undefined)
                    {
                        if (spawnoibs == 1)
                        {
                            bots[ii].send(new Uint8Array([0]));
                        }
                        for (var xdd = 1; xdd < 50; xdd++)
                        {
                            bots[ii].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,[xdd]]));
                        }
                        bots[ii].send(JSON.stringify([3,MousePos.x - player.cam.rx + (ii * 150) - (75 * bots.length),Math.round(MousePos.y + 800 - player.cam.ry),[0]]));
                    }
                }
            }
            if (botmode == 2)
            {
                for (var ia = 0; ia < bots.length; ia++)
                {
                    if (bots[ia].readyState == 1 && bots[ia].opened == 1 || bots[ia] != null || bots[ia] != undefined)
                    {
                        if (spawnoibs == 1)
                        {
                            bots[ia].send(new Uint8Array([0]));
                        }
                        for (var xa = 1; xa < 50; xa++)
                        {
                            bots[ia].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,[xa]]));
                        }
                    }
                }
            }
            if (botmode == 3)
            {
                for (var ib = 0; ib < bots.length; ib++)
                {
                    if (bots[ib].readyState == 1 && bots[ib].opened == 1 || bots[ib] != null || bots[ib] != undefined)
                    {
                        if (spawnoibs == 1)
                        {
                            bots[ib].send(new Uint8Array([0]));
                        }
                        bots[ib].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,[0]]));
                        bots[ib].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,AllOibs]));
                    }
                }
            }
            if (botmode == 4)
            {
                for (var i2 = 0; i2 < bots.length; i2++)
                {
                    if (bots[i2].readyState == 1 && bots[i2].opened == 1 || bots[i2] != null || bots[i2] != undefined)
                    {
                        if (spawnoibs == 1)
                        {
                            bots[i2].send(new Uint8Array([0]));
                        }
                        bots[i2].send(JSON.stringify([3,MousePos.x - player.cam.rx + Math.cos((i2 / bots.length) * Math.PI * 2) * 500,MousePos.y - player.cam.ry + Math.sin((i2 / bots.length) * Math.PI * 2) * 500,[0]]));
                        for (var xd2 = 1; xd2 < 50; xd2++)
                        {
                            bots[i2].send(JSON.stringify([3,MousePos.x - player.cam.rx,MousePos.y - player.cam.ry,[xd2]]));
                        }
                    }
                }
            }
        }
        else
        {
            if (spawnoibs == 1)
            {
                for (var iab = 0; iab < bots.length; iab++)
                {
                    if (bots[iab].readyState == 1 && bots[iab].opened == 1 || bots[iab] != null || bots[iab] != undefined)
                    {
                        bots[iab].send(new Uint8Array([0]));
                        bots[iab].send(JSON.stringify([2,OibsAndQueen]))
                    }
                }
            }
        }
        if (ping >= 100)
        {
            ping = 0;
            for (var kek = 0; kek < bots.length; kek ++)
            {
                if (bots[kek].readyState == 1 && bots[kek].opened == 1 || bots[kek] != null || bots[kek] != undefined)
                {
                    bots[kek].send(new Uint8Array([3]));
                }
            }
        }
    }

    function makebots()
    {
        getplayercount();
        remove();
        deathbybots();
        makethemdoshit();
    }

    function SuperSelect() {
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id != player.id) {
                    if (GameOibs[k].info_delay > 1.5) {
                        GameOibs[k].info_delay = 0;
                        player.select.units.push(GameOibs[k]);
                    }
                }
            }
        }
    }

    function FCallRadiusMove(Mine, Enemy) {
        var diffX = 0;
        var diffY = 0;
        var angle = 0;
        var nPos = {
            x: 0,
            y: 0
        };
        var radius = 100;
        diffX = Mine.x - Enemy.x;
        diffY = Mine.y - Enemy.y;
        angle = Math.atan2(diffY, diffX);
        nPos.x = Math.round(Enemy.x - radius * Math.cos(angle));
        nPos.y = Math.round(Enemy.y - radius * Math.sin(angle));
        player.select.clean();
        player.select.units.push(Mine);
        FCallMoveOib(nPos);
        player.select.clean();
    }

    function GetDistance(x, y, x2, y2) {
        var d = Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
        return d;
    }

    function FCallMove() {
        var PosBackUp = {
            x: MousePos.x.toString(),
            y: MousePos.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function MakeRingForEachLevel() {
        socket().send(new Uint8Array([0]));
        if (mmsplit == 1) {
            SelectOibs();
            split();
        }
        ringangle += ringrotatespeed;
        var levels = 0;
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        SelectQueen();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        sortByKey(My_Oibs, "uid");
        sortByKey(My_Oibs, "level");
        var lastlevel = 0;
        var sortedoibs = new Array();
        for (var i = 0; i < My_Oibs.length; i++) {
            if (lastlevel != My_Oibs[i].level) {
                lastlevel = My_Oibs[i].level;
                levels++;
                sortedoibs.push([]);
                sortedoibs[levels - 1].push(My_Oibs[i]);
            } else {
                sortedoibs[levels - 1].push(My_Oibs[i]);
            }
        }
        window.log = sortedoibs;
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            player.select.units = [];
            for (var e = 0; e < levels; e++) {
                for (k = 0; k < sortedoibs[e].length; k++) {
                    if (My_Queen.life >= botlvl * My_Queen.level) {
                        player.select.units = [];
                        player.select.units.push(sortedoibs[e][k]);
                        FCallMoveOibRingEachLevel(My_Queen, k, sortedoibs[e].length);
                        SelectQueen();
                    } else {
                        player.select.units.push(sortedoibs[e][k]);
                        feed();
                        SelectQueen();
                    }
                }
            }
        }
    }

    function FCallMoveOibRingEachLevel(r, k, e) {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: (r.x + a.x) + (Math.cos(((k / e) * 6.43) + ringangle) * (e * ringsize)),
            y: (r.y + a.y) + (Math.sin(((k / e) * 6.43) + ringangle) * (e * ringsize))
        };
        var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function FCallMoveOibRing(r, k) {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: (r.x + a.x) + (Math.cos(((k / player.army.v) * 6.43) + ringangle) * (player.army.v * ringsize)),
            y: (r.y + a.y) + (Math.sin(((k / player.army.v) * 6.43) + ringangle) * (player.army.v * ringsize))
        };
        var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function FCallMoveOibLine(r, k) {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: r.x - (player.army.v * (linesize / 2)) + (k * linesize),
            y: r.y
        };
        var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function FCallMoveOib(r) {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: r.x + a.x,
            y: r.y + a.y
        };
        var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function FCallMovePos(x1, y1) {
        var a = {
            x: player.cam.rx,
            y: player.cam.ry
        };
        var b = {
            x: x1 + a.x,
            y: y1 + a.y
        };
        var PosBackUp = {
            x: b.x.toString(),
            y: b.y.toString()
        };
        MoveUnits({
            x: parseInt(PosBackUp.x, 10),
            y: parseInt(PosBackUp.y, 10)
        });
    }

    function FriendBots() {
        if (lapas[9].mode != 1) {
            var k = 0;
            var Enemy_Queens = new Array();
            var Enemy_oibs = new Array();
            var My_Oibs = new Array();
            var My_Queen = new Object();
            var GameOibs = WorldOibs();
            for (k = 0; k < GameOibs.length; k++) {
                if (GameOibs[k] != undefined) {
                    if (GameOibs[k].id == player.id) {
                        if (GameOibs[k].queen == true) {
                            My_Queen = GameOibs[k];
                        } else {
                            My_Oibs.push(GameOibs[k]);
                        }
                    } else {
                        if (GameOibs[k].queen == true) {
                            Enemy_Queens.push(GameOibs[k]);
                        } else {
                            Enemy_oibs.push(GameOibs[k]);
                        }
                    }
                }
            }
            for (k = 0; k < Enemy_Queens.length; k++) {
                if (players()[player.id].nickname == players()[Enemy_Queens[k].id].nickname) {
                    if (players()[Enemy_Queens[k].id].friend == 0) {
                        players()[Enemy_Queens[k].id].friend = 1;
                        friend(Enemy_Queens[k].id)
                    }
                }
            }
        }
    }

    function AdjustOibs() {
        var k = 0;
        for (k = 0; WorldOibs().length > k; k++) {
            if (WorldOibs()[k] != undefined) {
                if (WorldOibs()[k].scale >= 6.74995) {
                    WorldOibs()[k].scale = 6.74995;
                    WorldOibs()[k].info_delay = 0.05;
                }
            }
        }
    }

    function captureMousePos(event) {
        MousePos.x = event.clientX;
        MousePos.y = event.clientY;
    }

    function sortByKey(array, key) {
        return array.sort(function(a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }
    // ACTIONS
    function HealNuke() {
        socket().send(new Uint8Array([0]));
        var k = 0;
        var My_Oibs = new Array();
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs_Nukelevel = new Array();
        var My_Oibs_LowLevel = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                        if (GameOibs[k].level < NukeLevel) {
                            My_Oibs_LowLevel.push(GameOibs[k]);
                        } else {
                            My_Oibs_Nukelevel.push(GameOibs[k]);
                        }
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        sortByKey(My_Oibs_Nukelevel, "life");
        sortByKey(My_Oibs_LowLevel, "oid");
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            for (k = 0; k < My_Oibs_LowLevel.length; k++) {
                if (My_Oibs_Nukelevel[k] != undefined) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs_Nukelevel[k]);
                    player.select.units.push(My_Oibs_LowLevel[k]);
                    regroup();
                    player.select.units = [];
                }
            }
            for (k = 0; k < My_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOib(My_Queen);
            }
        }
        SelectQueen();
        if (g7 == true) {
            setTimeout(() => {
                HealNuke();
            }, 1);
        }
    }

    function MakeRing() {
        socket().send(new Uint8Array([0]));
        if (mmsplit == 1) {
            SelectOibs();
            split();
        }
        ringangle += ringrotatespeed;
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        SelectQueen();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        sortByKey(My_Oibs, "uid");
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            player.select.units = [];
            for (k = 0; k < My_Oibs.length; k++) {
                if (My_Queen.life >= botlvl * My_Queen.level) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    FCallMoveOibRing(My_Queen, k);
                    SelectQueen();
                } else {
                    player.select.units.push(My_Oibs[k]);
                    feed();
                    SelectQueen();
                }
            }
        }
    }

    function MakeRingBot(aa) {
        socket().send(new Uint8Array([0]));
        if (mmsplit == 1) {
            SelectOibs();
            split();
        }
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        SelectQueen();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = aa;
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        sortByKey(My_Oibs, "uid");
        player.select.units = [];
        for (k = 0; k < My_Oibs.length; k++) {
            if (My_Queen.life >= botlvl * My_Queen.level) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOibRing(My_Queen, k);
                SelectQueen();
            } else {
                player.select.units.push(My_Oibs[k]);
                feed();
                SelectQueen();
            }
        }
    }

    function HorizLine() {
        socket().send(new Uint8Array([0]));
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        sortByKey(My_Oibs, "level");
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            player.select.units = [];
            for (k = 0; k < My_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOibLine(MousePos, k);
                SelectQueen();
            }
        }
    }

    function BotAttack() {
        if (mmsplit == 1) {
            SelectOibs();
            split();
            player.select.units = [];
        }
        var j = 0;
        var k = 0;
        var attack = false;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens.push(GameOibs[k]);
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        var NearOibs = new Array();
        var DistanceWary = 500;
        var lowest = DistanceWary;
        var tempdistance = 0;
        for (k = 0; k < Enemy_oibs.length; k++) {
            tempdistance = GetDistance(Enemy_oibs[k].x, Enemy_oibs[k].y, My_Queen.x, My_Queen.y);
            if (tempdistance < DistanceWary) {
                if (lapas[9].mode != 1) {
                    if (players()[player.id].nickname == players()[Enemy_oibs[k].id].nickname) {} else {
                        if (tempdistance < lowest) {
                            attack = true;
                            lowest = tempdistance;
                            NearOibs = Enemy_oibs[k];
                        }
                    }
                } else {
                    if (players()[player.id].color == players()[Enemy_oibs[k].id].color) {} else {
                        if (tempdistance < lowest) {
                            attack = true;
                            lowest = tempdistance;
                            NearOibs = Enemy_oibs[k];
                        }
                    }
                }
            }
        }
        for (k = 0; k < Enemy_Queens.length; k++) {
            tempdistance = GetDistance(Enemy_Queens[k].x, Enemy_Queens[k].y, My_Queen.x, My_Queen.y);
            if (tempdistance < DistanceWary) {
                if (lapas[9].mode != 1) {
                    if (players()[player.id].nickname == players()[Enemy_Queens[k].id].nickname) {} else {
                        if (tempdistance < lowest) {
                            attack = true;
                            lowest = tempdistance;
                            NearOibs = Enemy_Queens[k];
                        }
                    }
                } else {
                    {
                        if (players()[player.id].color == players()[Enemy_Queens[k].id].color) {} else {
                            if (tempdistance < lowest) {
                                attack = true;
                                lowest = tempdistance;
                                NearOibs = Enemy_Queens[k];
                            }
                        }
                    }
                }
            }
        }
        if (Internet_StressBot < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            if (attack == false) {
                for (k = 0; k < My_Oibs.length; k++) {
                    player.select.clean();
                    player.select.units.push(My_Oibs[k]);
                    FCallMoveOib(My_Queen);
                }
            }
            //------- let the madness begin
            if (attack == true) {
                for (j = 0; j < My_Oibs.length; j++) {
                    player.select.clean();
                    player.select.units.push(My_Oibs[j]);
                    FCallRadiusMove(My_Oibs[j], NearOibs);
                    player.select.clean();
                }
            }
        }
    }

    function AttackNearby() {
        var j = 0;
        var k = 0;
        var MinDistance = Infinity;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            player.select.units = [];
            for (k = 0; k < My_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOib(My_Queen);
            }
            player.select.units = [];
            player.select.units.push(My_Queen);
            FCallMove();
            SelectQueen();
        }
        if (g2 == true) {
            setTimeout(() => {
                AttackNearby();
            }, 1);
        }
    }

    function MakeNuke() {
        socket().send(new Uint8Array([0]));
        var My_Oibs = new Array();
        var Low_Oibs = new Array();
        var CmdSnt = new Date().getTime();
        var GameOibs = WorldOibs();
        var Nuke_Oibs = new Array();
        var Big_Oibs = new Array();
        var Queen = new Object();
        var k = 0;
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined && GameOibs[k].id == player.id) {
                if (GameOibs[k].level < NukeLevel && GameOibs[k].queen == false) {
                    Low_Oibs.push(GameOibs[k]);
                }
                if (GameOibs[k].level == NukeLevel && GameOibs[k].queen == false) {
                    Nuke_Oibs.push(GameOibs[k]);
                }
                if (GameOibs[k].level > NukeLevel && GameOibs[k].queen == false) {
                    Big_Oibs.push(GameOibs[k]);
                }
                if (GameOibs[k].queen == true) {
                    Queen = GameOibs[k];
                }
                if (GameOibs[k].queen == false) {
                    My_Oibs.push(GameOibs[k]);
                }
            }
        }
        sortByKey(Low_Oibs, "oid");
        sortByKey(My_Oibs, "level");
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            for (k = 0; k < My_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOib(Queen);
            }
            for (k = 0; k < Big_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(Big_Oibs[k]);
                split();
            }
            var select = 0;
            player.select.units = [];
            for (k = 0; k < Low_Oibs.length; k++) {
                select++;
                player.select.units.push(Low_Oibs[k]);
                if (select > 1) {
                    select = 0;
                    regroup();
                    player.select.units = [];
                }
            }
            for (k = 0; k < My_Oibs.length; k++) {
                player.select.units = [];
                player.select.units.push(My_Oibs[k]);
                FCallMoveOib(Queen);
            }
        }
        SelectQueen();
        if (g5 == true) {
            setTimeout(() => {
                MakeNuke();
            }, 1);
        }
    }

    function MoveArmyToPoint() {
        beforeoibs = player.army.v;
        if (typeof(beforeoibs) != "number") {
            beforeoibs = 99999;
        }
        var distance = 0;
        var j = 0;
        var k = 0;
        var My_Oibs = new Array();
        var EneMy_Oibs = new Array();
        var AimbotTarget = MousePos;
        var CmdSnt = new Date().getTime();
        for (k = 0; WorldOibs().length > k; k++) {
            if (WorldOibs()[k] != undefined) {
                if (WorldOibs()[k].id == player.id && WorldOibs()[k].queen == false) {
                    My_Oibs.push(WorldOibs()[k]);
                }
                if (WorldOibs()[k].id != player.id && WorldOibs()[k].queen == false) {
                    EneMy_Oibs.push(WorldOibs()[k]);
                }
            }
        }
        sortByKey(My_Oibs, "oid");
        sortByKey(My_Oibs, "level");
        player.select.units = [];
        if (beforeoibs < 50) {
            for (k = My_Oibs.length - 1; k >= 0; k--) {
                My_Oibs[k].reallevel = My_Oibs[k].level;
                if (My_Oibs[k].reallevel > 1) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    if (beforeoibs < 50) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                    if (beforeoibs < 50 && My_Oibs[k].reallevel > 1) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                    if (beforeoibs < 50 && My_Oibs[k].reallevel > 1) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                }
                delete My_Oibs[k].reallevel;
            }
        }
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            if (smartMM == 1) {
                for (k = 0; k < My_Oibs.length; k++) {
                    var Mpos = My_Oibs[k];
                    var dist = 0;
                    var diffX = 0;
                    var diffY = 0;
                    var angle = 0;
                    var radius = 0;
                    var nPos = {
                        x: 0,
                        y: 0
                    };
                    if (k > sendoibs) {
                        radius = -120;
                    } else {
                        radius = 0;
                    }
                    var MinDistance = Infinity;
                    if (AimbotTarget != new Object()) {
                        diffX = (Mpos.x - (AimbotTarget.x - player.cam.rx));
                        diffY = (Mpos.y - (AimbotTarget.y - player.cam.ry));
                        angle = Math.atan2(diffY, diffX);
                        nPos.x = Math.round((AimbotTarget.x - player.cam.rx) - radius * Math.cos(angle));
                        nPos.y = Math.round((AimbotTarget.y - player.cam.ry) - radius * Math.sin(angle));
                        player.select.units = [];
                        player.select.units.push(Mpos);
                        FCallMoveOib(nPos);
                    }
                }
            }
            if (smartMM == 0) {
                player.select.units = [];
                for (k = 0; k < My_Oibs.length; k++) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    FCallMove();
                }
            }
        }
        SelectQueen();
        if (g1 == true) {
            setTimeout(() => {
                MoveArmyToPoint();
            }, 1);
        }
    }

    function AutoHeal() {
        socket().send(new Uint8Array([0]));
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        beforeoibs = player.army.v;
        if (typeof(beforeoibs) != "number") {
            beforeoibs = 99999;
        }
        sortByKey(My_Oibs, "oid");
        sortByKey(My_Oibs, "level");
        player.select.units = [];
        if (beforeoibs < 50) {
            for (k = My_Oibs.length - 1; k >= 0; k--) {
                My_Oibs[k].reallevel = My_Oibs[k].level;
                if (My_Oibs[k].reallevel > 1) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    if (beforeoibs < 50) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                    if (beforeoibs < 50 && My_Oibs[k].reallevel > 1) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                    if (beforeoibs < 50 && My_Oibs[k].reallevel > 1) {
                        split();
                        My_Oibs[k].reallevel--;
                        beforeoibs++;
                    }
                }
                delete My_Oibs[k].reallevel;
            }
        }
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            var HPDIF = (My_Queen.level * botlvl) - My_Queen.life;
            if (HPDIF > 0) {
                for (k = 0; k < My_Oibs.length; k++) {
                    if (HPDIF <= 0) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        FCallMoveOib(My_Queen);
                    } else {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        if (My_Queen.crown != 1) {
                            HPDIF -= My_Oibs[k].life / 2.75;
                        } else {
                            HPDIF -= My_Oibs[k].life / 2.5;
                        }
                    }
                }
            } else {
                for (k = 0; k < My_Oibs.length; k++) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    FCallMoveOib(My_Queen);
                }
            }
        }
        SelectQueen();
        if (g3 == true) {
            setTimeout(() => {
                AutoHeal();
            }, 1);
        }
    }

    function MoveHeal() {
        socket().send(new Uint8Array([0]));
        var k = 0;
        var Enemy_Queens = new Array();
        var Enemy_oibs = new Array();
        var My_Oibs = new Array();
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        var CmdSnt = new Date().getTime();
        SelectOibs();
        split();
        SelectOibs();
        split();
        SelectOibs();
        split();
        SelectOibs();
        split();
        SelectOibs();
        split();
        SelectOibs();
        split();
        player.select.units = [];
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    } else {
                        My_Oibs.push(GameOibs[k]);
                    }
                } else {
                    if (GameOibs[k].queen == true) {
                        Enemy_Queens = GameOibs[k];
                    } else {
                        Enemy_oibs.push(GameOibs[k]);
                    }
                }
            }
        }
        if (Internet_Stress < CmdSnt - LastCommandSent) {
            LastCommandSent = new Date().getTime();
            var HPDIF = (My_Queen.level * botlvl) - My_Queen.life;
            if (HPDIF > 0) {
                for (k = 0; k < My_Oibs.length; k++) {
                    if (HPDIF <= 0) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        FCallMoveOib(My_Queen);
                    } else {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        HPDIF -= My_Oibs[k].life;
                    }
                }
            } else {
                for (k = 0; k < My_Oibs.length; k++) {
                    player.select.units = [];
                    player.select.units.push(My_Oibs[k]);
                    FCallMoveOib(My_Queen);
                }
            }
        }
        SelectQueen();
        FCallMove();
        if (g6 == true) {
            setTimeout(() => {
                MoveHeal();
            }, 1);
        }
    }

    function FeedOib() {
        socket().send(new Uint8Array([0]));
        socket().send(JSON.stringify([2,AllOibs]));
        SelectQueen();
        if (g8 == true) {
            setTimeout(() => {
                FeedOib();
            }, 1);
        }
    }
    // LOOPS
    function tick() {
        if (reset == 1) {
            var units = 0;
            var i = 0;
            for (i = 0; i < WorldOibs().length; i++) {
                if (WorldOibs()[i] != null || undefined) {
                    units++;
                }
            }
            socket().send(JSON.stringify([1, Math.floor(undefined), Math.floor(undefined)]));
            if (lapas[9].units.length == 0 || units == 0) {
                socket().send(JSON.stringify([1, Math.floor(-player.cam.x), Math.floor(-player.cam.y)]));
                reset = 0;
            }
        }
        if (nickname == "" && player.id != -1) {
            nickname = players()[player.id].nickname;
        }
        if (color == "" && player.id != -1) {
            color = players()[player.id].color;
        } else {
            if (color == "black") {
                color = 0;
            }
            if (color == "pink") {
                color = 1;
            }
            if (color == "blue") {
                color = 2;
            }
            if (color == "purple") {
                color = 3;
            }
            if (color == "orange") {
                color = 4;
            }
            if (color == "aqua") {
                color = 5;
            }
        }
        if (PPbot == 1) {
            PPBot();
        }
        if (avoid == 1) {
            RunAway();
        }
        if (RemoveSpawnButton != undefined && RemoveGuage != undefined) {
            RemoveSpawnButton();
            RemoveGuage();
        }
        game.regroup.info.translate = [];
        game.split.info.translate = [];
        game.feed.info.translate = [];
        if (PPotherstage > 0 && isppbot == 1) {
            if (PPdebug == 1) {
                console.log(PPotherstage);
            }
            var k = 0;
            var Enemy_Queens = new Array();
            var Enemy_oibs = new Array();
            var My_Oibs = new Array();
            var My_Queen = new Object();
            var My_Oibs2 = new Array();
            var GameOibs = WorldOibs();
            for (k = 0; k < GameOibs.length; k++) {
                if (GameOibs[k] != undefined) {
                    if (GameOibs[k].id == player.id) {
                        if (GameOibs[k].queen == true) {
                            My_Queen = GameOibs[k];
                        } else {
                            My_Oibs.push(GameOibs[k]);
                        }
                    } else {
                        if (GameOibs[k].queen == true) {
                            Enemy_Queens.push(GameOibs[k]);
                        } else {
                            Enemy_oibs.push(GameOibs[k]);
                        }
                    }
                }
            }
            if (My_Queen.x != 891 || My_Queen.y != 4999) {
                small = player.select.units;
                player.select.units = [];
                player.select.units.push(My_Queen);
                FCallMovePos(891, 4999);
                player.select.units = [];
                player.select.units = small;
            }
            if (PPotherstage == 1) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                var aaaa = new Object();
                var aaaaa = new Object();
                if (player.army.v >= 4) {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (k == 0) {
                            mainoib = My_Oibs[k];
                        } else {
                            if (My_Oibs[k].level > mainoib.level) {
                                mainoib = My_Oibs[k];
                            }
                        }
                    }
                    PPotherstage++;
                }
            }
            if (PPotherstage == 2) {
                player.select.units = [];
                if (player.army.v > 3) {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level) {
                            player.select.units.push(My_Oibs[k]);
                        }
                    }
                    regroup();
                } else {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level) {
                            player.select.units = [];
                            player.select.units.push(My_Oibs[k]);
                            FCallMovePos(mainoib.x, mainoib.y - 135);
                        }
                    }
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level - 3) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                    PPotherstage++;
                }
            }
            if (PPotherstage == 3) {
                player.select.units = [];
                if (mainoib.life < mainoib.level * (botlvl * 0.95)) {
                    socket().send(new Uint8Array([0]));
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level - 3) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                } else {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level - 3) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                    PPotherstage++;
                }
            }
            if (PPotherstage == 4) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                player.select.units = [];
                My_Oibs2 = new Array();
                var kk = 0;
                for (k = 0; k < players().length; k++) {
                    if (players()[k].nickname == "kmccord1" && players()[k].crown == 1) {
                        otherid = k;
                        k = 99;
                        for (kk = 0; kk < GameOibs.length; kk++) {
                            if (GameOibs[kk] != undefined) {
                                if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                                    My_Oibs2.push(GameOibs[kk]);
                                }
                            }
                        }
                        for (kk = 0; kk < My_Oibs2.length; kk++) {
                            if (kk == 0) {
                                otheroib = My_Oibs2[kk];
                            } else {
                                if (My_Oibs2[kk].level > otheroib.level) {
                                    otheroib = My_Oibs2[kk];
                                }
                            }
                        }
                        if (otheroib.life >= otheroib.level * (botlvl * 0.95)) {
                            player.select.units.push(mainoib);
                            split();
                            FCallMoveOib(otheroib);
                            PPotherstage++;
                        }
                    }
                }
            }
            if (PPotherstage == 5) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                if (mainoib.x == otheroib.x && mainoib.y == otheroib.y) {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    split();
                    PPotherstage++;
                } else {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    FCallMoveOib(otheroib);
                }
            }
            if (PPotherstage == 7) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                PPotherstage++;
            }
            if (PPotherstage == 8) {
                if (mainoib.life < mainoib.level * (botlvl * 0.95)) {
                    socket().send(new Uint8Array([0]));
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level - 1) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                } else {
                    for (k = 0; k < My_Oibs.length; k++) {
                        if (My_Oibs[k].level < mainoib.level - 1) {
                            player.select.units = [];
                            player.select.units.push(mainoib);
                            player.select.units.push(My_Oibs[k]);
                            regroup();
                        }
                    }
                    if (mainoib.x != 791 || mainoib.y != 4639) {
                        player.select.units = [];
                        player.select.units.push(mainoib);
                        FCallMovePos(791, 4639);
                    } else {
                        PPotherstage++;
                    }
                }
            }
            if (PPotherstage == 9) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                for (kk = 0; kk < GameOibs.length; kk++) {
                    if (GameOibs[kk] != undefined) {
                        if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                            My_Oibs2.push(GameOibs[kk]);
                        }
                    }
                }
                for (kk = 0; kk < My_Oibs2.length; kk++) {
                    if (My_Oibs2[kk].level == mainoib.level - 1) {
                        aaaa = My_Oibs2[kk];
                    }
                }
                for (kk = 0; kk < My_Oibs.length; kk++) {
                    if (My_Oibs[kk].level == mainoib.level - 1) {
                        aaaaa = My_Oibs[kk];
                    }
                }
                if (aaaaa.x == aaaa.x && aaaaa.y == aaaa.y) {
                    player.select.units.push(aaaaa);
                    split();
                    player.select.units = [];
                    PPotherstage++;
                } else {
                    player.select.units = [];
                    player.select.units.push(aaaaa);
                    FCallMoveOib(aaaa);
                    player.select.units = [];
                }
            }
            if (PPotherstage == 11) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                player.select.units = [];
                if (player.army.v >= 4) {
                    for (kk = 0; kk < My_Oibs.length; kk++) {
                        if (My_Oibs[kk].level == mainoib.level - 3) {
                            player.select.units.push(My_Oibs[kk]);
                        }
                    }
                    regroup();
                    player.select.units = [];
                    PPotherstage++;
                }
            }
            if (PPotherstage == 12) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                for (kk = 0; kk < GameOibs.length; kk++) {
                    if (GameOibs[kk] != undefined) {
                        if (GameOibs[kk].id == otherid && GameOibs[kk].queen == false) {
                            My_Oibs2.push(GameOibs[kk]);
                        }
                    }
                }
                for (kk = 0; kk < My_Oibs2.length; kk++) {
                    if (kk == 0) {
                        otheroib = My_Oibs2[kk];
                    } else {
                        if (My_Oibs2[kk].level > otheroib.level) {
                            otheroib = My_Oibs2[kk];
                        }
                    }
                }
                if (mainoib.x == otheroib.x && mainoib.y == otheroib.y) {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    split();
                    PPotherstage++;
                } else {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    FCallMoveOib(otheroib);
                }
            }
            if (PPotherstage == 14) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                if (player.army.v >= 4) {
                    PPotherstage++;
                }
            }
            if (PPotherstage == 15) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                SelectOibs();
                regroup();
                player.select.units = [];
                if (player.army.v == 2) {
                    PPotherstage++;
                }
            }
            if (PPotherstage == 16) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (k == 0) {
                        mainoib = My_Oibs[k];
                    } else {
                        if (My_Oibs[k].level > mainoib.level) {
                            mainoib = My_Oibs[k];
                        }
                    }
                }
                if (mainoib.x != 791 || mainoib.y != 4639) {
                    player.select.units = [];
                    player.select.units.push(mainoib);
                    FCallMovePos(791, 4639);
                } else {
                    PPotherstage++;
                }
            }
            if (PPotherstage == 18) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                if (player.army.v >= 3) {
                    PPotherstage++;
                }
            }
            if (PPotherstage == 19) {
                small = player.select.units;
                for (k = 0; k < My_Oibs.length; k++) {
                    if (My_Oibs[k].level < mainoib.level - 3) {
                        player.select.units = [];
                        player.select.units.push(My_Oibs[k]);
                        feed();
                        player.select.units = [];
                    }
                }
                player.select.units = small;
                SelectOibs();
                regroup();
                player.select.units = [];
                if (player.army.v == 2) {
                    PPotherstage = 0;
                }
            }
        }
        if (respawn == 1) {
            if (ui.is_run == true) {
                ui.is_run = false;
                game.is_run = true;
                connect();
            }
        }
        if (isppbot != 1) {
            if (player.can_skill_1 == true) {
                abcd.postMessage(" ( BOT HEAL - Z ) ( BOT SPELL - X ) ");
            } else {
                abcd.postMessage(50);
            }
        }
        player.select.split = !0;
        player.select.feed = !0;
        player.select.regroup = !0;
        if (ring >= 1) {
            if (ringmode == 0)
            {
                MakeRing();
            }
            else
            {
                MakeRingForEachLevel();
            }
        }
        if (line >= 1) {
            HorizLine();
        }
        if (fbot >= 1) {
            socket().send(new Uint8Array([0]));
            SelectOibs();
            MoveUnits({
                x: -99999,
                y: 99999
            });
        }
        if (plsm == 1) {
            for (var ie = 0; ie < 5; ie++)
            {
                socket().send(JSON.stringify([4,AllOibs]));
            }
            socket().send(JSON.stringify([2,AllOibs]));
        }
        if (TrimOibSizes == 1) {
            AdjustOibs();
        }
        if (seelevels >= 1) {
            var n = 0;
            for (n = 0; n < WorldOibs().length; n++) {
                if (WorldOibs()[n] != undefined) {
                    WorldOibs()[n].info_delay = 0.05;
                }
            }
        }
        if (isbot == 0 && isppbot == 0) {
            var k = 0;
            var Enemy_Queens = new Array();
            var Enemy_oibs = new Array();
            var My_Oibs = new Array();
            var My_Queen = new Object();
            var GameOibs = WorldOibs();
            for (k = 0; k < GameOibs.length; k++) {
                if (GameOibs[k] != undefined) {
                    if (GameOibs[k].id == player.id) {
                        if (GameOibs[k].queen == true) {
                            My_Queen = GameOibs[k];
                        } else {
                            My_Oibs.push(GameOibs[k]);
                        }
                    } else {
                        if (GameOibs[k].queen == true) {
                            Enemy_Queens = GameOibs[k];
                        } else {
                            Enemy_oibs.push(GameOibs[k]);
                        }
                    }
                }
            }
            bc.postMessage({
                My_Queen1: My_Queen,
                MousePos1: MousePos,
                X1: player.cam.rx,
                Y1: player.cam.ry,
                FollowMouse: mousebot,
                RingSize: ringsize,
                Delay: Internet_StressBot,
                Ring: ring,
                botatck: botattack,
                heallvl: botlvl,
                friend: FriendThem,
                resp: respawn,
                angle: ringangle,
                rspeed: ringrotatespeed,
                linetoggle: line,
                btfeed: botfeed,
                split: mmsplit
            });
        }
    }

    function atck() {
        var k = 0;
        var My_Queen = new Object();
        var GameOibs = WorldOibs();
        for (k = 0; k < GameOibs.length; k++) {
            if (GameOibs[k] != undefined) {
                if (GameOibs[k].id == player.id) {
                    if (GameOibs[k].queen == true) {
                        My_Queen = GameOibs[k];
                    }
                }
            }
        }
        NukeLevel = Math.round((My_Queen.level / 4) + 0.499999999999999 + 2);
        stopscript = 0;
        if (socket() != null && socket().readyState == socket().OPEN) {
            pingme();
        }
        if (FriendThem == 1) {
            FriendBots();
        }
        if (player.crown == 0) {
            botlvl = 60;
        }
        if (player.crown == 1) {
            botlvl = 40;
        }
        if (player.crown == 2) {
            botlvl = 75;
        }
        if (player.crown == 3) {
            botlvl = 40;
        }
        if (player.crown == 4) {
            botlvl = 40;
        }
        if (player.crown == 5) {
            botlvl = 30;
        }
        if (rush >= 4) {
            player.select.screen();
            FCallMovePos(-4999, -4999);
            connect();
        }
        if (rush <= 3) {
            rush = 0;
        }
        if (isbot == 1 && isppbot == 0) {
            bc.onmessage = function(ev) {
                function FCallMoveOibBot() {
                    var X = ev.data.MousePos1.x
                    var Y = ev.data.MousePos1.y
                    var CamDiffX = player.cam.rx - ev.data.X1;
                    var CamDiffY = player.cam.ry - ev.data.Y1;
                    var PosBackUp = {
                        x: (X + CamDiffX).toString(),
                        y: (Y + CamDiffY).toString()
                    };
                    MoveUnits({
                        x: parseInt(PosBackUp.x, 10),
                        y: parseInt(PosBackUp.y, 10)
                    });
                }
                if (ev.data == "SendHealer") {
                    if (player.crown == 3) {
                        SendSkill1();
                    }
                }
                if (ev.data == "SendWitch") {
                    if (player.crown == 4) {
                        SendSkill1();
                    }
                }
                if (ev.data != "SendHealer" && ev.data != "SendWitch") {
                    if (ev.data.My_Queen1.life < ev.data.My_Queen1.level * (BotBotlvl / 3.5)) {
                        SendSkill1();
                    }
                    if (mousebot !== ev.data.FollowMouse) {
                        mousebot = ev.data.FollowMouse;
                    }
                    if (ringsize !== ev.data.RingSize) {
                        ringsize = ev.data.RingSize;
                    }
                    if (Internet_StressBot !== ev.data.Delay) {
                        Internet_StressBot = ev.data.Delay;
                    }
                    if (botring !== ev.data.Ring) {
                        botring = ev.data.Ring;
                    }
                    if (botattack !== ev.data.botatck) {
                        botattack = ev.data.botatck;
                    }
                    if (BotBotlvl !== ev.data.heallvl) {
                        BotBotlvl = ev.data.heallvl;
                    }
                    if (FriendThem !== ev.data.friend) {
                        FriendThem = ev.data.friend;
                    }
                    if (respawn !== ev.data.resp) {
                        respawn = ev.data.resp;
                    }
                    if (ringangle !== ev.data.angle) {
                        ringangle = ev.data.angle;
                    }
                    if (ringrotatespeed !== ev.data.rspeed) {
                        ringrotatespeed = ev.data.rspeed;
                    }
                    if (botfeed !== ev.data.btfeed) {
                        botfeed = ev.data.btfeed;
                    }
                    if (mmsplit !== ev.data.split) {
                        mmsplit = ev.data.split;
                    }
                    var k = 0;
                    var Enemy_Queens = new Array();
                    var Enemy_oibs = new Array();
                    var My_Oibs = new Array();
                    var My_Queen = new Object();
                    var GameOibs = WorldOibs();
                    var CmdSntBot = new Date().getTime();
                    for (k = 0; k < GameOibs.length; k++) {
                        if (GameOibs[k] != undefined) {
                            if (GameOibs[k].id == player.id) {
                                if (GameOibs[k].queen == true) {
                                    My_Queen = GameOibs[k];
                                } else {
                                    My_Oibs.push(GameOibs[k]);
                                }
                            } else {
                                if (GameOibs[k].queen == true) {
                                    Enemy_Queens = GameOibs[k];
                                } else {
                                    Enemy_oibs.push(GameOibs[k]);
                                }
                            }
                        }
                    }
                    if (Internet_StressBot < CmdSntBot - LastCommandSentBot) {
                        LastCommandSentBot = new Date().getTime();
                        if (My_Queen.level < 6) {
                            socket().send(new Uint8Array([0]));
                            SelectOibs();
                            feed();
                            SelectQueen();
                            player.focus_selected();
                            FCallMoveOib(ev.data.My_Queen1);
                        } else {
                            if (My_Queen.life < My_Queen.level * botlvl || botfeed == 1) {
                                socket().send(new Uint8Array([0]));
                                SelectOibs();
                                split();
                                SelectOibs();
                                feed();
                                SelectQueen();
                                player.focus_selected();
                                FCallMoveOib(ev.data.My_Queen1);
                            } else {
                                if (mousebot == 1) {
                                    socket().send(new Uint8Array([0]));
                                    if (mmsplit == 1) {
                                        SelectOibs();
                                        split();
                                    }
                                    for (k = 0; k < My_Oibs.length; k++) {
                                        player.select.units = [];
                                        player.select.units.push(My_Oibs[k]);
                                        FCallMoveOibBot(ev.data.MousePos1);
                                    }
                                } else {
                                    if (botattack == 1) {
                                        socket().send(new Uint8Array([0]));
                                        player.select.units = [];
                                        BotAttack();
                                        player.select.units = [];
                                    } else {
                                        if (botring == 1) {
                                            MakeRingBot(ev.data.My_Queen1);
                                        }
                                    }
                                }
                                SelectQueen();
                                player.focus_selected();
                                FCallMoveOib(ev.data.My_Queen1);
                            }
                        }
                    }
                }
            };
            abcd.onmessage = undefined;
        } else {
            if (isppbot == 0) {
                bc.onmessage = undefined;
                abcd.onmessage = function(evv) {
                    player.army.m = evv.data
                };
            }
        }
        if (ppmain == 1 || isppbot == 0) {
            pp.onmessage = undefined;
        } else {
            pp.onmessage = function(pp1) {
                if (pp1.data.stage >= 0 && isppbot == 1) {
                    PPotherstage = pp1.data.stage;
                }
            }
        }
    }
})();