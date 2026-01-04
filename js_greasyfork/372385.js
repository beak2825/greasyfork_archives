// ==UserScript==
// @name         Pendoria - Autos Reminder (Release)
// @namespace    pendoria-flash
// @version      2.571
// @description  Reminders for: idle(autos, quest, scrapyard), complete (quest, scrapyard, guild task)
// @author       flash
// @include      https://pendoria.net/game
// @include      https://www.pendoria.net/game
// @connect      docs.google.com
// @connect      googleusercontent.com
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/372385/Pendoria%20-%20Autos%20Reminder%20%28Release%29.user.js
// @updateURL https://update.greasyfork.org/scripts/372385/Pendoria%20-%20Autos%20Reminder%20%28Release%29.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var settings = {
        // Url to audio file that should be played as a reminder. If changed, don't forget to modify the host-name of the @connect header!
        "audioFile": "https://docs.google.com/uc?export=open&id=1Y-SiflR7-ee45eSCkJLfxPPMWiX_MX_d",
        // Amount of seconds after which the reminder should be repeated. Set to false to disable repeats.
        "audioRepeat": 30,
        // Toggles debug messaging on (true) or off (false)
        "debug": false
    };

    // Don't change anything past this point ... unless you know what you're doing
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var condition = {
        "autos": {
            "cur": false,
            "max": 100
        },
        "quest": false,
        "scrapyard": {
            "data": false,
            "state": false,
            "set": false
        },
        "chattimestamps": [],
        "chattabclick": false,
        "update": function(type, state) {
            state = (state==="refresh") ? this.autos.max : parseInt(state);
            switch(type) {
                case "autos":
                    this.autos.cur = state;
                    break;
                case "quest":
                    this.quest = state;
                    break;
                case "scrapyard":
                    this.scrapyard.data = state;
                    this.scrapyard.set = new Date().getTime();
                    break;
                default:
            }
            this.check();
        },
        "check": function() {

            if(this.scrapyard.state===false) {
                this.recolorMenuItem("scraptown");
                this.scrapyard.state = "inactive";
            }
            if(this.scrapyard.state!==false && this.scrapyard.data!==false) {
                var now = new Date().getTime();
                var finish = this.scrapyard.set + this.scrapyard.data * 1000;
                if(finish>now) {
                    if(this.scrapyard.state!=="normal") {
                        this.recolorMenuItem("scraptown", "normal");
                        this.scrapyard.state = "normal";
                    }
                } else {
                    if(this.scrapyard.state!=="idle") {
                        this.recolorMenuItem("scraptown", "idle");
                        this.scrapyard.state = "idle";
                    }
                    playReminder.play();
                    return;
                }
            }
            if(this.autos.cur!==false && this.autos.cur<=0) {
                playReminder.play();
                return;
            }
            if(this.quest!==false && this.quest<=0) {
                playReminder.play();
                return;
            }
            playReminder.disable();
            return;
        },
		"recolorMenuItem": function(item, state) {
            var normal, hover;
            switch(state) {
                case "idle":
                    normal = "#FF0000";
                    hover = "#FFA0A0";
                    break;
                case "normal":
                    normal = "#969696";
                    hover = "#FFFFFF";
                    break;
                default:
                case "inactive":
                    normal = "#FFFF00";
                    hover = "#FFFFA0";
                    break;
            }
            $("#"+item+"-button").css({"color": normal, "text-decoration": "none" }).hover(function() {
                $(this).css({"color": hover, "text-decoration": "none" });
            }, function() {
                $(this).css({"color": normal, "text-decoration": "none" });
            });
        }
    };

    socket.on('message', function (message, channel, username, id) {
        var chatlist = document.getElementById("chat-messages").lastElementChild
        if(channel == "/whisper"){
            if(active_channel_tab !== "/whisper"){
                if(chatlist.lastChild.innerText.includes("whispers:")){
                    playReminder.playSound();
                    return;
		        }
            }
        }
    })

    socket.on('guild task data', function (data) {
		if (data.end){
            playReminder.playSound();
            return;
		}
    })

    socket.on('update time', function (data) {
        if(!scraptownTimer) { return; }
        var scraptowntimer1 = new Date(scraptownTimer)
        var scraptowntimer2 = new Date(data.raw)
        if(scraptowntimer2 > scraptowntimer1) {
            playReminder.play();
            return;
        }
	})
    
    socket.on('update dungeons', (data) => {
        alertDungeonComplete(data.current, data.target);
		})
    function alertDungeonComplete(now, needed){
	    if (now !== needed){
            document.getElementById("action-button").style.color = "white";
		} else {
            document.getElementById("action-button").style.color = "red";
        }
    }

    var observer = {
        "observer": new MutationObserver(function(mutations, observer) {
            mutations.forEach(function(element) {
                if(element.addedNodes.length===0) return;
                var res;
                if(element.target.className==="progress-status") {
                    res = element.target.innerText.match(/^(\d+) \/ (\d+) \w+ \(Exp.*$/);
                    if(element.target.innerText==="refreshing...") {
                        condition.update("autos", condition.autos.max);
                    } else if(res && res.length===3) {
                        condition.update("autos", res[1]);
                        condition.autos.max = res[2];
                    }
                }
                if(element.target.id==="quest_desc") {
                    if(element.target.innerText==="You have completed your quest." || element.target.innerText==="You do not have any active quest") {
                        condition.update("quest", 0);
                    }
                    if(/Win any battles to progress/.test(element.target.innerText)) {
                        res = $("#quest_prog").text().match(/^(\d+) \/ (\d+)$/);
                        if(res.length===3) {
                            condition.update("quest", res[2] - res[1]);
                        }
                    }
                }
                if(element.target.id==="queue-text") {
                    if(element.target.innerText.includes("No building in queue, perhaps you should upgrade something?")) {
                       condition.update("scrapyard", -100);
                    }
                    if(element.target.innerText.includes("will be upgraded in:")) {
                        res = $("#building-progress");
                        if(res.length===1) {
                            condition.update("scrapyard", res.attr("data-time"));
                        }
                    }
                }
                if(element.target.tagName==="UL" && $(element.target).parent().attr("id")==="chat-messages") {
                    var now = Date.now();
                    condition.chattimestamps = condition.chattimestamps.filter(function(timestamp) {
                        return (now-timestamp) <= 1000;
                    });
                    condition.chattimestamps.push(now);
                }
                if(element.target.tagName==="UL" && $(element.target).parent().attr("id")==="chat-messages" &&
                   (condition.chattabclick===false || condition.chattabclick+5000<Date.now())
                  ) {
                    if(/^\[\d+\:\d+\:\d+\] [\w\d]+ has finished the current guild task\.$/.test(element.addedNodes[0].innerText)) {
                        condition.recolorMenuItem("guild", "idle");
                        $("#guild-button").click(function() {
                        condition.recolorMenuItem("guild", "normal");
                        });
                    }
                    if(/^\[\d+\:\d+\:\d+\] [\w\d]+ has started the guild task/.test(element.addedNodes[0].innerText)) {
                        condition.recolorMenuItem("guild", "normal");
                    }
                }
            });
        }),
        "start": function() {
            DEBUG.msg("Starting ...");
            this.observer.observe($("#gameframe-status-wrapper").get(0), { childList: true, attributes: true, characterData: true, subtree: true });
            this.observer.observe($("#progressbar-wrapper").get(0), { childList: true, attributes: true, characterData: true, subtree: true });
            this.observer.observe($("#gameframe-content").get(0), { childList: true, attributes: true, characterData: true, subtree: true });
            this.observer.observe($("#chat-messages > ul").get(0), { childList: true, attributes: true, characterData: true, subtree: true });
            $("a[data-channel='/guild']").click(function() {
                condition.chattabclick = Date.now();
            });
        }
    };
    var playReminder = {
        "repeating": false,
        "playSoundRepeat": false,
        "audioBuffer": false,
        "audioContext": new AudioContext(),
        "soundLoadedPromise": new Promise(function(resolve, reject) {
            var req = GM_xmlhttpRequest({
                method: "GET",
                url: settings.audioFile,
                responseType: "arraybuffer",
                onload: function(res) {
                    try {
                        playReminder.audioContext.decodeAudioData(res.response, function(b) {
                            resolve(b);
                        }, function(e) {
                            reject(e);
                        });
                    }
                    catch(e) {
                        reject(e);
                    }
                }
            });
        }),
        "play": function () {
            if(settings.audioRepeat===false) {
                this.playSound();
            } else {
                if(this.repeating===false) {
                    this.repeating = true;
                    this.playSound();
                    this.playSoundRepeat = setInterval(function() {
                        playReminder.playSound();
                    }, (settings.audioRepeat<5) ? 5000 : settings.audioRepeat * 1000);
                }
            }
            return;
        },
        "playSound": function () {
            if(!this.audioContext) {
                DEBUG.err("Audio could not be played.");
                return;
            }
            var s = this.audioContext.createBufferSource();
            s.buffer = this.audioBuffer;
            s.connect(this.audioContext.destination);
            s.start(0);
            DEBUG.msg("Audio reminder played.");
        },
        "disable": function () {
            if(this.playSoundRepeat) {
                clearInterval(this.playSoundRepeat);
                this.repeating = false;
            }
        }
    };
    playReminder.soundLoadedPromise.then(function(b) {
        playReminder.audioBuffer = b;
        DEBUG.msg("Audio loaded successfully.");
    }, function(e) {
        DEBUG.err("Audio could not be loaded. " + e);
    });
    var DEBUG = {
        "err": function (t) {
            console.log("Userscript '" + GM_info.script.name + "' ERROR:", t);
        },
        "msg": function (t) {
            if(settings.debug===true) console.log("Userscript '" + GM_info.script.name + "':", t);
        }
    };

    setTimeout(function() { observer.start(); }, 2500);
})();