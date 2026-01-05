// ==UserScript==
// @name         TDP4 Bot
// @namespace    http://alphaoverall.com
// @version      0.8
// @description  A TDP4 Chat Bot
// @author       AlphaOverall
// @include      http://www.kongregate.com/games/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20913/TDP4%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/20913/TDP4%20Bot.meta.js
// ==/UserScript==

function check() {
    if (!holodeck) { setTimeout(check, 1000);}
    else {
        console.log("[TDP4 Bot]: Holodeck loaded"); 
        setTimeout(init, 5000);
    }
} check();

function sendMessage(message) {
    holodeck._chat_window._active_room.sendRoomMessage(holodeck._botprefix + message);
}

function init() {
    var sale = 0;
    var weapons = [["Glock 18", /glock/, 650, 0], ["Colt King Cobra", /cobra|colt/, 1000, 0], ["Gold Eagle", /gold|eagle/, 0, 26], ["10mm SOP", /10mm|sop/, 9900, 20], ["Mini-Uzi", /uzi/, 1800, 0],
                   ["Skorpion vz. 61", /skorpion/, 4000, 0], ["MP5", /mp5/, 4500, 6],["Calico M960", /calico|m960/, 3900, 0], ["9A-91", /9a.?91/, 8500, 9],["PPSh-41", /ppsh/, 6000, 7], 
                   ["MP-40", /mp.?40/, 6000, 7], ["Winchester", /winchester/, 3500, 0], ["Beneli M4", /ben(a|e)li/, 3900, 0], ["Jackhammer", /jackhammer/, 9000, 11],["Pop Gun", /pop.?gun/, 3745, 11],
                   ["AA-12", /aa.?12/, 21000, 32], ["SPAS 12", /spas/, 45000, 78], ["AK-47", /ak.?47/, 9900, 7], ["M16", /m16/, 10000, 10], ["Steyr Aug", /steyr|aug/, 12000, 15], 
                   ["Assassin", /as.?as.?in/, 8900, 45], ["OICW XM8", /oicw|oixw|xm8/, 28000, 85], ["M-29 IncisoR", /m.?29|incisor/, 23800, 25], ["Gauss Rifle", /gauss/, 39000, 96], ["FN-SCAR", /scar/, 10000, 10], ["WA 2000", /wa.?2000/, 30000, 75],
                   ["Dragunov", /dragunov/, 40000, 85], ["Barrett", /bar.?et.?/, 45500, 90], ["HK PSG1", /psg/, 22750, 35], ["CheyTac M200", /cheytac|m200/, 45000, 75], ["VSS Vintorez", /vss|vintorez/, 60000, 105], ["RPD", /rpd/, 20000, 15],
                   ["M60E4", /m60e4/, 22000, 20], ["M249 SAW", /m249|saw/, 22700, 24], ["Gatling Gun", /^((?!medieval).)*gatling/, 43500, 70], ["NEGEV NG7", /negev|ng7/, 22000, 20], ["Laser LGM", /lgm/, 35000, 30],
                   ["Laser LGH", /lgh/, 45000, 50], ["Plasma Shocker", /plasma|shocker/, 40900, 70], ["PG Mark 1", /pg[a-z\s]*1/, 68250, 96], ["PSL Pistol", /psl/, 5600, 0], ["Railgun", /rail/, 58500, 196],
                   ["PG Mark 2", /pg[a-z\s]*2/, 0, "1-Infinity"], ["H.Z.", /h.?z.?/, 18200, 32], ["6G30", /6g30|potato/, 27300, 42], ["SMAW", /smaw/, 33400, 51], ["M202A2", /m2/, 54000, 96],
                   ["Snowman", /snowman/, 15000, 18], ["Cupido Gun", /cupid/, 15000, 18], ["RPG-32", /rpg/, 16000, 22], ["Jack-x'plosion", /jack.?x|x.?plosion/, 25000, 35],
                   ["D-Walt Sound [X-M]", /d.?walt|sound(.?)*x.?m/, 27000, 38], ["Thunderbringer", /thunder|bringer/, 60000, 100], ["Firestarter", /.starter/, 27000, 52], ["Tesla 1945", /tesla/, 130000, 150],
                   ["Flamethrower", /flame|thrower/, 45000, 50], ["Toxic Gun", /toxic/, 40000, 55], ["Crossbow", /cross.?bow/, 14000, 14], ["Demon Hunter", /demon|hunter/, 20000, 25],
                   ["Medieval Gatling Gun", /med.?e.?val.?gatling/, 35400, 60]];
    var skills = ["bounty", "defence", "defense", "health", "explosion", "luck", "strength", "accuracy", "stupidity"];
    var skillDesc = ["Bounty is a skill that gives a chance of double coins per kill", "Defence reduces damage taken by 5% for each point, maximum is 85% with defense artifacts",
                     "Defence reduces damage taken by 5% for each point, maximum is 85% with defense artifacts",
                     "Health stat adds 50 health to max HP. Also adds 15 health to med pack healing per point, which starts at 30 hp.", "'Explosions' adds 100 damage to grenades; some explosive weapons require explosions.",
                     "Luck adds 1.6% to the chance of dealing critical hits, which provide extra damage above the normal maximum damage of the gun shot. The maximum is 27.2% for luck artifacts.",
                     "All that strength does, is allow one to buy certain weapons which require strength; gives no in-game bonuses at all (beyond medals).",
                     "Accuracy decreases the size of the crosshair slightly, improving the accuracy of all weapons. Also needed to buy some weapons.", "Stupidity is a skill which has so far only been achieved by Veyr..."];
    holodeck.addChatCommand("botname", function (l, n) {
        var z = n.match(/^\/\S+\s+(.+)/); 
        a = (z) ? z[1] : "TDP4Bot";
        l._botname = a; 
        l.activeDialogue().displayMessage("Kong Bot", "Bot name set to "+a, {class: "whisper received_whisper"}, {non_user: true}); 
        return false;
    });
    holodeck.addChatCommand("tdp4bot", function(l, n){
        if (l._tdp4bot === false) {
            l._tdp4bot = true; 
            l.activeDialogue().displayMessage("Kong Bot", "TDP4 Bot turned on", {class: "whisper received_whisper"}, {non_user: true});
        }
        else {
            l._tdp4bot = false; 
            l.activeDialogue().displayMessage("Kong Bot", "TDP4 Bot turned off", {class: "whisper received_whisper"}, {non_user: true});
        }
        return false; 
    });
    var returnMessage = function(msg) {
        msg = msg.toLowerCase();
    };
    if(!ChatDialogue.prototype.reply){
        CDialogue.prototype.reply = function(a){};
    }

    if(!ChatDialogue.prototype.showReceivedPM){
        ChatDialogue.prototype.showReceivedPM = ChatDialogue.prototype.receivedPrivateMessage;
    }

    ChatDialogue.prototype.receivedPrivateMessage = function(a){
        if (a.data.success){
            var msg = a.data.message.toLowerCase(), user = a.data.from, message = "Current Non-Admin Commands: 1.Help";
            if (user === "AlphaOverall") {
                if (msg.match(/bot reload/)) {
                    message = "Authorized. Reloading.";
                    sendMessage("Reloading...");
                    location.reload();
                }
            }
            if (user === "AlphaOverall" || user === "cargo11900" || user === "Blizzardy3" || user === "Veyr_Zah_MagLord") {
                if (msg.match(/bot on/)) {
                    message = "Authorized. Bot turned on.";
                    holodeck._tdp4bot = true;
                }
                else if (msg.match(/bot off/)) {
                    message = "Authorized. Bot turned off.";
                    holodeck._tdp4bot = false;
                }
                else if (msg.match(/bot status/)) {
                    message = "Bot status: " + ((holodeck._tdp4bot) ? "On" : "Off");
                }
            }
            if (msg.match(/help/)) message = "Help: IN CREATION";
            if (holodeck._tdp4bot)
            {
                if (isSkillAsk(msg)) {
                    for (var i = 0; i < skills.length; i++) {
                        if (msg.match(skills[i])) {
                            message = skillDesc[i];
                            break;
                        }
                    }
                }
                if (isPriceAsk(msg)) {
                    for (var i = 0; i < weapons.length; i++) {
                        if (msg.match(weapons[i][1])) {
                            var wepName = weapons[i][0], regex = weapons[i][1], coins = weapons[i][2], cash = weapons[i][3], sale = "";
                            var out = "The cost of " + wepName + " is ";
                            if (msg.match(/(in|on|with|off)(.)*(%|percent)/)) {
                                var discount = parseInt(msg.match(/(\d|\s)+(%|percent)/)[0]);
                                coins -= Math.floor(coins * (discount/100));
                                cash = (cash === "1-Infinity") ? cash : cash - Math.floor(cash * (discount/100));
                                sale = " with " + discount + "% discount";
                            }
                            if (coins > 0) out += coins + " coins";
                            if (cash > 0 || cash === "1-Infinity") out += (coins > 0 ? " and" : "") + " " + cash + " cash";
                            out += (cash === 0 && coins === 0) ? " absolutely nada with a 100% discount!": sale;
                            message = out;
                            break;
                        }
                    }
                }
                if (isNameAsk(msg)) {
                    if (msg.match(/blizz/)) {
                        message = "Blizz... is a big guy... we're talking really big.";
                    }
                    else if (msg.match(/alpha/)) {
                        message = "Alpha is my creator. Alpha is a nice guy.";
                    }
                }
                if (msg.match(/what.?(\sis|'s)\ssexy/i)) {
                    message = "nico...";
                }
                if (msg.match(/who.?(\sis|'s)\salpha.*fan/i)) {
                    message = "GoldenEye2015! ;)";
                }
            }
            this.reply(user);
            this.sendPrivateMessage(user, message);
        }
        this.showReceivedPM(a);
    }

    holodeck.addIncomingMessageFilter(function(message, nextFunction){
        //var msg = message.toLowerCase();
        /*var now = new Date();
        if (holodeck._tdp4bot && now-start > 2000)
        {
            start = now;
            if (isSkillAsk(msg)) {
                for (var i = 0; i < skills.length; i++) {
                    if (msg.match(skills[i])) {
                        sendMessage(skillDesc[i]);
                        break;
                    }
                }
            }
            if (isPriceAsk(msg)) {
                for (var i = 0; i < weapons.length; i++) {
                    if (msg.match(weapons[i][1])) {
                        var wepName = weapons[i][0], regex = weapons[i][1], coins = weapons[i][2], cash = weapons[i][3], sale = "";
                        var out = "The cost of " + wepName + " is ";
                        if (msg.match(/(in|on|with|off)(.)*(%|percent)/)) {
                            var discount = parseInt(msg.match(/(\d|\s)+(%|percent)/)[0]);
                            coins -= Math.ceil(coins * (discount/100));
                            cash = (cash === "1-Infinity") ? cash : cash - Math.ceil(cash * (discount/100));
                            sale = " with " + discount + "% discount";
                        }
                        if (coins > 0) out += coins + " coins";
                        if (cash > 0 || cash === "1-Infinity") out += (coins > 0 ? " and" : "") + " " + cash + " cash";
                        out += (cash === 0 && coins === 0) ? " absolutely nada with a 100% discount!": sale;
                        sendMessage(out);
                        break;
                    }
                }
            }
            if (isNameAsk(msg)) {
                if (msg.match(/blizz/)) {
                    sendMessage("Blizz... is a big guy... we're talking really big.");
                }
                else if (msg.match(/alpha/)) {
                    sendMessage("Alpha is my creator. Alpha is a nice guy.");
                }
            }
            if (msg.match(/what.?(\sis|'s)\ssexy/i)) {
                sendMessage("nico...");
            }
        }*/
        nextFunction(message, nextFunction);
    });
    holodeck._tdp4bot = (holodeck._active_user.chatUsername() === "DPBot");
    holodeck._botprefix = "[bot]: ";
    holodeck._botname = "TDP4Bot";
    // If message is asking for price of weapon
    function isPriceAsk(msg) {
        return msg.match(/((how many)|(how much)|((what).?(s|'s|is))).?(does|is|cash|coins|are|for|the|cost|price)/);
    }
    // If message is asking what a skill is
    function isSkillAsk(msg) {
        return msg.match(/what.?(is|s|'s|are|does.?[a-z]*.?do)/);
    }
    // If message is asking who someone is
    function isNameAsk(msg) {
        return msg.match(/who.?is/);
    }
}