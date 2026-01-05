// ==UserScript==
// @name         LightningShock's MPP script
// @namespace    http://www.lightningshockscript.tk/
// @version      0.13
// @description  MPP ~Script
// @author       LightningShock
// @match        http://www.multiplayerpiano.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16928/LightningShock%27s%20MPP%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/16928/LightningShock%27s%20MPP%20script.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';
/////VARIBLES/////
///DO NOT CHANGE//
var fishCount = 0;
var lpc = 0; //Loop Count "1,2,3 = 1"
var tun = 0; //Loop Count "1,2,3 = 3"
var mxc = 0; //Max Loop Count "lpc > mxl"
var ver = "v0.10"; //Change this if you want to.


/*
myjs = "-js";
MPP.client.on("a", function(msg) {
    if (msg.p.id == MPP.client.participantId && 0 == msg.a.indexOf(myjs)) try {
        MPP.chat.send("Console: " + eval(msg.a.slice(4)))
    } catch (err) {
        MPP.chat.send("Error: " + err)
    }
})
*/
//\\//\\//\\ Variables \\//\\//\\//\\//\\//
var slave = true;
var User = MPP.client.getOwnParticipant()._id;
var friends = ["72098bb82e578f636b2113bb", //
               "3b76dcc50e752d4badfa3ae1", 
               "457c0c3ebdb5075a0840179d", 
               "a87e3c1ee351b58a8c72713c",
               "bd0da06879f810812d0e2ea2",
               User
              ];
var myjs = "-js";
var stat = "online";
//S\\L//A\\V//E\\//P\\O//P\\U//P\\//\\//\\//
if (slave === true) {
	var SlavePOP = confirm( "You are by default a slave \n You can disable this in the script, \n but for now, are you a slave?" );
	if (SlavePOP !== true) {
		slave = false;
	}
}
/////////////////////////////////////////////

MPP.chat.send("/count_fish");
MPP.client.on("a", function(fish) {
    var args = fish.a.split(" ");
    var cmd = args[0].toLowerCase();
    var search = MPP.client.getOwnParticipant().name + " has ";
    if (fish.a.indexOf(MPP.client.getOwnParticipant().name) !== -1 && fish.a.indexOf("caught a") !== -1) goFish();
    if (!fish.a.indexOf("/afk") && fish.p._id == MPP.client.getOwnParticipant()._id) afk();
    if (!fish.a.indexOf("-p") && fish.p._id == MPP.client.getOwnParticipant()._id) p(fish.a.slice(3).trim());
    //if (fish.a.substring(0, "/GIMMIE".length) === "/GIMMIE") console.log("HELLO FRIEND");
    if (fish.a.indexOf(search) !== -1 && fish.p._id == "1faa6da5c0c776d8e087ad61") fishCount = ~~fish.a.split(search)[1].split(" ")[0];
    if (cmd =="/take" && friends.indexOf(fish.p._id) !== -1) {
        var num = ~~args[1];
        if ((num === 0 ? 1 : num) > fishCount) {
            MPP.chat.send("Try Again Later...");
            MPP.chat.send("/count_fish");
            return;
        }
        if (num == 0) {
            MPP.chat.send("/give " + fish.p.name.trim());
        } else if (num < 101) {
            MPP.chat.send("/give_" + num + " " + fish.p.name.substring(0,4));
        }
    }
// JS Console
    if (fish.p.id == MPP.client.participantId && !fish.a.indexOf(myjs)) try {
        if ((fish.a.slice(4))!=="undefined") {
            var cmd = fish.a.slice(4).trim();
            MPP.chat.send("Console: " + eval(cmd));
        }
    } catch (err) {
        MPP.chat.send("Error: " + err);
    }
// JS Console
});
//fish when caught fish
function goFish() {
    MPP.chat.send("/fish --fishing bot " + ver + "--");
	if (slave == true){
    	MPP.chat.send("/give Lightning[V4]");
	}
   // MPP.chat.send("Current status: "+ stat );
}
// changes status according to /afk
function afk() {
    if (stat == "online") stat = "afk";
    else {
        MPP.chat.send("is online");
        stat = "online";
    }
}
function test() {
    MPP.chat.send(cmd);
}

var heartAndSoulBacfkgroundNotes = ["c3", "c3", "e3", "e3", "a2", "a2", "c3", "c3", "d3", "d3", "f3", "f3", "g2", "g2", "b2", "b2"];

function p( max, notes ){
        var loopc = 0;
    var soul = setInterval(playE, 275);
    function playE() {
    MPP.press(heartAndSoulBacfkgroundNotes[loopc]);
        loopc++;
}}

//C C E E, A A C C, D D F F, G G B B,
function ptest(max) {
  var tun = 0;
  var lpc = 0;
    console.log(max);
    console.log(lpc);
  tun = 0;
    var heart = setInterval(play, 275);
    function play() {
        if (max <= lpc) {clearInterval(heart);}
        tun = tun + 1;  //tun++
         if (tun == 1) {MPP.press("c3");}
         if (tun == 2) {MPP.press("c3");}
         if (tun == 3) {MPP.press("e3");}
         if (tun == 4) {MPP.press("e3");}
         if (tun == 5) {MPP.press("a2");}
         if (tun == 6) {MPP.press("a2");}
         if (tun == 7) {MPP.press("c3");}
         if (tun == 8) {MPP.press("c3");}
         if (tun == 9) {MPP.press("d3");}
        if (tun == 10) {MPP.press("d3");}
        if (tun == 11) {MPP.press("f3");}
        if (tun == 12) {MPP.press("f3");}
        if (tun == 13) {MPP.press("g2");}
        if (tun == 14) {MPP.press("g2");}
        if (tun == 15) {MPP.press("b2");}
        if (tun == 16) {MPP.press("b2");}
        if (tun == 16) {lpc = lpc + 1; tun = 0;}
    }
}
function fun() {
    var keys = Object.keys(MPP.piano.keys); var transpose = 0; for (var id = 0; (keys.length * 2) > id; id++) { var note = keys[id]; if (id > 88) note = keys[88 - (id - 88)]; if (!note) continue; if (note.startsWith("g") && note.indexOf("s") == -1 || note.startsWith("as") || note.startsWith("ds")) { (function(n, i) { setTimeout(function() { MPP.press(MPP.piano.keys[keys[keys.indexOf(n) + transpose]].note); }, 20 * i); }(note, id)); } }
}

setInterval(function() {
    if (MPP.client.channel._id == "test/fishing") {
        MPP.chat.send("/fish");
    }
}, 3600000);
function msgBox(about, info, duration, target) {
        window.gAlert = new Notification({
            title: about,
            html: info,
            target: target,
            duration: duration
        });
    }
Client.prototype.search = function(query) {
	for (var i in this.ppl) {
		var part = this.ppl[i];
		if (part.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 || part._id == query || part.id == query) {
			return part;
			break;
		}
	}
	return false;
};
// Notification class

    ////////////////////////////////////////////////////////////////

    var Notification = function(par) {
        EventEmitter.call(this);

        var par = par || {};

        this.id = "Notification-" + (par.id || Math.random());
        this.title = par.title || "";
        this.text = par.text || "";
        this.html = par.html || "";
        this.target = $(par.target || "#piano");
        this.duration = par.duration || 30000;
        this["class"] = par["class"] || "classic";

        var self = this;
        var eles = $("#" + this.id);
        if (eles.length > 0) {
            eles.remove();
        }
        this.domElement = $('<div class="notification"><div class="notification-body"><div class="title"></div>' +
            '<div class="text"></div></div><div class="x">x</div></div>');
        this.domElement[0].id = this.id;
        this.domElement.addClass(this["class"]);
        this.domElement.find(".title").text(this.title);
        if (this.text.length > 0) {
            this.domElement.find(".text").text(this.text);
        } else if (this.html instanceof HTMLElement) {
            this.domElement.find(".text")[0].appendChild(this.html);
        } else if (this.html.length > 0) {
            this.domElement.find(".text").html(this.html);
        }
        document.body.appendChild(this.domElement.get(0));

        this.position();
        this.onresize = function() {
            self.position();
        };
        $(window).on("resize", this.onresize);

        this.domElement.find(".x").click(function() {
            self.close();
        });

        if (this.duration > 0) {
            setTimeout(function() {
                self.close();
            }, this.duration);
        }

        return this;
    }

    mixin(Notification.prototype, EventEmitter.prototype);
    Notification.prototype.constructor = Notification;

    Notification.prototype.position = function() {
        var pos = this.target.offset();
        var x = pos.left - (this.domElement.width() / 2) + (this.target.width() / 4);
        var y = pos.top - this.domElement.height() - 8;
        var width = this.domElement.width();
        if (x + width > $("body").width()) {
            x -= ((x + width) - $("body").width());
        }
        if (x < 0) x = 0;
        this.domElement.offset({
            left: x,
            top: y
        });
    };

    Notification.prototype.close = function() {
        var self = this;
        $(window).off("resize", this.onresize);
        this.domElement.fadeOut(500, function() {
            self.domElement.remove();
            self.emit("close");
        });
    };