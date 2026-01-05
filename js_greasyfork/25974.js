// ==UserScript==
// @name         IstrolidPro-ModeratorEdition
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Script to add functionality to Istrolid. ONLY FOR MODERATORS!
// @author       LB-Internal
// @match        http://www.istrolid.com/game.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25974/IstrolidPro-ModeratorEdition.user.js
// @updateURL https://update.greasyfork.org/scripts/25974/IstrolidPro-ModeratorEdition.meta.js
// ==/UserScript==

(function() {
// UNIVERSAL MODERATOR ISTROLID SCRIPT
// Created through the combined work of PurpleGh0st, Apo11o, and LB-Internal
// NOT FOR REDISTROBUTION!!!!!!!!!!!!!!

/// Keyboard Shortcuts
//// Press Control + c for color change
//// Press Control + t for rainbow color toggle
//// Press Control + a for AI on/off toggle
//// Press Control + up for changing to higher fleet row
//// Press Control + down for changing to lower fleet row

// Initial setup
// By: PurpleGh0st
if(window == top){
  window.addEventListener('keyup', doKeyPress, false);
}
color_rate = 500;
afk_rate = 30;
change_colors = false;
color_key = 67; //c
toggle_key = 84; //t
ai_key = 65; //a
fleet_up = 38; //up arrow
fleet_down = 40; //down arrow
override_id = 7; // Player ID to use when overriding your identity
override_name = "Apo11o"; // Player Name to use when overriding your identity
// Random number generator
// By: PurpleGh0st
function randomInt(min, max){
  return Math.floor(Math.random() * (max - min)) + min;
}
// Color changer
// By: PurpleGh0st
function colorChange(){
	r = randomInt(0, 256);
  g = randomInt(0, 256);
  b = randomInt(0, 256);
  commander.color = [r, g, b, 255];
  account.simpleCommander();
  account.color = [r, g, b, 255];
  account.rootSave();
  network.sendPlayer();
}
function recurse_colors(){
	if(change_colors){
		colorChange();
		setTimeout(recurse_colors, color_rate);
	}
}
// Fleet swapper
// By: PurpleGh0st
function fleetLength(){
  nrows = 6;
  ref = commander.fleet;
  for (k in ref) {
    v = ref[k];
    if (v) {
      ref1 = k.split(","), r = ref1[0], c = ref1[1];
      r = parseInt(r);
      if (r + 4 > nrows) {
        nrows = r + 4;
      }
    }
  }
  return nrows;
}
// Translation module
// By: PurpleGh0st
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!! 
/* 
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}
function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}
function translate(e){
  var sourceText = ''
  if (e.parameter.q){
    sourceText = e.parameter.q;
  }
  
  var sourceLang = 'auto';
  if (e.parameter.source){
    sourceLang = e.parameter.source;
  }
 
  var targetLang = 'en';
  if (e.parameter.target){
    targetLang = e.parameter.target;
  }
   var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=" 
            + sourceLang + "&tl=" + targetLang + "&dt=t&q=" + encodeURI(sourceText);
  
  var result = httpGet(url);
  var i = 0;
  while(result[i] !== '\"'){
    i++;
  }
  i++;
  var translated = "";
  while(result[i] !== '\"'){
    translated += result[i];
    i++;
  }
  return translated;
}
 */
// Keyboard shortcuts
// By: PurpleGh0st
function doKeyPress(e) {
  if(e.ctrlKey){
      if(e.keyCode == color_key){
    	colorChange();
    } else if(e.keyCode == toggle_key){
    	change_colors = !change_colors;
    	if(change_colors){
    		recurse_colors();
    	}
    } else if(e.keyCode == ai_key){
      if (localStorage.useAi !== "true") {
        localStorage.useAi = "true";
      } else {
        localStorage.useAi = "false";
        designMode.aiEdit = false;
      }
    } else if(e.keyCode == fleet_up){
      if((commander.fleet.selection || 0) <= 0){
        commander.fleet.selection = commander.fleet.length;
      }
      commander.fleet.selection--;
      account.save();
    } else if(e.keyCode == fleet_down){
      if(!commander.fleet.selection || commander.fleet.selection >= fleetLength() - 1){
        commander.fleet.selection = 0;
      }
      commander.fleet.selection++;
      account.save();
      // Press "h" to go Moderator
    } else if(e.keyCode == 72){
	  console.log("Going Moderator...");
	  getAIRules = function() {
    		  if (localStorage.useAi !== "true") {
      		  return null;
    		  }
    		  return ais.buildBar2aiRules(commander.buildBar);
  	  };
      Connection.prototype.sendPlayer = function() {
              var buildBar, i, j;
              if (!commander) {
                return;
              }
              console.log("network.sendPlayer MODIFIED");
              buildBar = [null, null, null, null, null, null, null, null, null, null];
              for (i = j = 0; j < 10; i = ++j) {
                if (validSpec(commander, commander.buildBar[i])) {
                  buildBar[i] = commander.buildBar[i];
                }
              }
              return this.send("playerJoin", override_id, override_name, commander.color, buildBar, getAIRules());
      };
      network.close();
      network.connect();
	  // Press "d" to disable Moderator
	} else if(e.keyCode == 68){
	  console.log("Exiting Moderator...");
	  override_id = commander.id;
	  override_name = commander.name;
	  network.close();
	  network.connect();
	}
  }
}
// AI Copier and no GhostCopy
// Sourced from: Apo11o
BattleMode.prototype.copySelected = function(index) {
      var copy, spec, unit;
      if (commander.selection.length === 1) {
        unit = commander.selection[0];
        spec = unit.spec;
        copy = new DesignUnit(spec);
        if (!sim.local) {
          copy.ghostCopy = false;
        }
        buildBar.setSpec(index, copy.toSpec());
        return control.savePlayer();
      }
    };  
// This is so local client doesn't try to kick you
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!!

Sim.prototype.checkAfkPlayers = function() {
      var l, len1, player, ref, results;
      ref = this.players;
      results = [];
      for (l = 0, len1 = ref.length; l < len1; l++) {
        player = ref[l];
        results.push(player.afk = false)
      }
      return results;
    }; 

//     if (typeof network !== "undefined" && network !== null) {
//           network.send("mouseMove", this.mouse, this.selecting || this.ordering);
//           console.log("mouseMove sent with values" + " this.mouse = " + this.mouse + " this.selecting = " + this.selecting + " this.ordering = " + this.ordering)
//         }

//       if (typeof network !== "undefined" && network !== null) {
//           network.send("mouseMove", [randomInt(-3500,3500),randomInt(-3500,3500)], false);
//           console.log("Fake Mouse Values Sent");
//       }

//        network.send("mouseMove", [randomInt(-3500,3500),randomInt(-3500,3500)], false);
//        console.log("Fake Mouse Values Sent");

// This FIXES AFK
// By: LB-Internal
BattleMode.prototype.tick = function() {
	  // Original value for lastMouseMove needed was "this.lastMouseMove < Date.now() - 1000 * 60 * 2"
      if (typeof network !== "undefined" && network !== null && this.lastMouseMove < Date.now() - 1000 * afk_rate) {
          this.lastMouseMove = Date.now();
          network.send("mouseMove", [randomInt(-2000,2000),randomInt(-2000,2000)], false);
          console.log("Fake Mouse Values Sent");
      }
      this.player = commander;
      return this.controls();
    };

// No Kick Cooldown
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!
Sim.prototype.switchSide = function(player, side) {
      if (!player) {
        return;
      }
      if (player.kickTime > now() - 15000) {
        return;
      }
      if (this.local && !sim.galaxyStar && !sim.challenge) {
        player.side = side;
        return;
      }
      if (side !== "spectators" && this.numInTeam(side) >= this.playersPerTeam()) {
        return;
      }
      if (this.state !== "waiting") {
        return;
      }
      player.side = side;
      if (side === "spectators") {
        player.streek = 0;
      }
      return player.lastActiveTime = Date.now();
    };
    
Sim.prototype.kickPlayer = function(p, number) {
      var player;
      if (this.state !== "waiting") {
        return;
      }
      if (!p.host) {
        return;
      }
      player = this.players[number];
      if (player) {
        player.side = "spectators";
        if (player.ai) {
          player.connected = false;
        }
        return this.say(p.name + " kicked " + player.name);
      }
    };
    
// Force Start A Game
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!!

/// [REDACTED] 

// See performance information
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!!

Sim.prototype.send = function() {
      var changes, data, e, f, i, id, l, len1, len2, len3, len4, len5, len6, len7, len8, m, new_v, o, p, packet, part, partId, player, predictable, q, r, ref, ref1, ref10, ref11, ref12, ref13, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, s, send, splayers, sthings, t, targetId, thing, v, x, y, z;
      sthings = [];
      ref = this.things;
      for (id in ref) {
        thing = ref[id];
        changes = [];
        changes.push(["thingId", thing.id]);
        if (thing.net == null) {
          thing.net = s = {};
          changes.push(["spec", thing.spec]);
          changes.push(["name", thing.constructor.name]);
        } else {
          s = thing.net;
        }
        ref1 = this.thingFields;
        for (l = 0, len1 = ref1.length; l < len1; l++) {
          f = ref1[l];
          v = thing[f];
          if (!simpleEquals(s[f], v)) {
            if (isArray(v)) {
              if (s.length !== v.length) {
                s[f] = new Array(v.length);
              }
              new_v = [];
              for (i = m = 0, len2 = v.length; m < len2; i = ++m) {
                e = v[i];
                s[f][i] = e;
                new_v.push(e);
              }
              v = new_v;
            } else {
              s[f] = v;
            }
            changes.push([f, v]);
          }
        }
        predictable = false;
        if ((s.vel != null) && (s.pos != null)) {
          v2.add(s.pos, s.vel, _pos);
          if (v2.distance(_pos, thing.pos) < .1) {
            v2.set(_pos, s.pos);
            predictable = true;
          }
        }
        if (!predictable) {
          if (s.vel == null) {
            s.vel = v2.create();
          }
          if (s.pos == null) {
            s.pos = v2.create();
          }
          v2.set(thing.vel, s.vel);
          v2.set(thing.pos, s.pos);
          changes.push(["vel", [thing.vel[0], thing.vel[1]]]);
          changes.push(["pos", [thing.pos[0], thing.pos[1]]]);
        }
        if (s.targetId !== ((ref2 = thing.target) != null ? ref2.id : void 0)) {
          s.targetId = (ref3 = thing.target) != null ? ref3.id : void 0;
          changes.push(["targetId", s.targetId]);
        }
        if (s.originId !== ((ref4 = thing.origin) != null ? ref4.id : void 0)) {
          s.originId = (ref5 = thing.origin) != null ? ref5.id : void 0;
          changes.push(["originId", s.originId]);
        }
        if (s.followId !== ((ref6 = thing.follow) != null ? ref6.id : void 0)) {
          s.followId = (ref7 = thing.follow) != null ? ref7.id : void 0;
          changes.push(["followId", s.followId]);
        }
        if (thing.parts != null) {
          ref8 = thing.parts;
          for (partId = o = 0, len3 = ref8.length; o < len3; partId = ++o) {
            part = ref8[partId];
            changes.push(["partId", partId]);
            s = part.net;
            if (!s) {
              part.net = s = {};
            }
            if ((part.working != null) && s.working !== part.working) {
              changes.push(["working", part.working]);
              s.working = part.working;
            }
            if (part.weapon) {
              targetId = ((ref9 = part.target) != null ? ref9.id : void 0) || 0;
              if (s.targetId !== targetId) {
                changes.push(["partTargetId", targetId]);
                s.targetId = targetId;
              }
            }
            if (changes[changes.length - 1][0] === "partId") {
              changes.pop();
            }
          }
        }
        if (changes.length > 1) {
          sthings.push(changes);
        }
      }
      splayers = [];
      ref10 = this.players;
      for (q = 0, len4 = ref10.length; q < len4; q++) {
        player = ref10[q];
        changes = [];
        changes.push(["playerNumber", player.number]);
        if (player.net == null) {
          player.net = s = {};
        } else {
          s = player.net;
        }
        ref11 = this.playerFields;
        for (r = 0, len5 = ref11.length; r < len5; r++) {
          f = ref11[r];
          v = player[f];
          if ((v != null) && !simpleEquals(s[f], v)) {
            if (isArray(v)) {
              if (s.length !== v.length) {
                s[f] = new Array(v.length);
              }
              for (i = x = 0, len6 = v.length; x < len6; i = ++x) {
                e = v[i];
                s[f][i] = e;
              }
            } else {
              s[f] = v;
            }
            changes.push([f, v]);
          }
        }
        if (changes.length > 1) {
          splayers.push(changes);
        }
      }
      data = {};
      s = this.net;
      if (!s) {
        this.net = s = {};
      }
      ref12 = this.simFields;
      for (y = 0, len7 = ref12.length; y < len7; y++) {
        f = ref12[y];
        if (!simpleEquals(s[f], this[f])) {
          data[f] = this[f];
          s[f] = this[f];
        }
      }
      if (splayers.length > 0) {
        data.players = splayers;
      }
      if (sthings.length > 0) {
        data.things = sthings;
      }
      if (sim.step % 16 === 0) {
        send = false;
        ref13 = this.players;
        for (z = 0, len8 = ref13.length; z < len8; z++) {
          player = ref13[z];
          if (player.connected) {
            send = true;
          }
        }
        if (send) {
          data.perf = {
            numbers: {
              things: ((function() {
                var results;
                results = [];
                for (t in this.things) {
                  results.push(t);
                }
                return results;
              }).call(this)).length,
              players: ((function() {
                var aa, len9, ref14, results;
                ref14 = this.players;
                results = [];
                for (aa = 0, len9 = ref14.length; aa < len9; aa++) {
                  p = ref14[aa];
                  results.push(p);
                }
                return results;
              }).call(this)).length,
              splayers: splayers.length,
              sthings: sthings.length
            },
            timeings: this.timeings
          };
        }
        this.timeings = {};
      }
      packet = prot.simPack(data);
      return packet;
    };
 
 
// Moderation Commands
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!!

/// [NOT DEVELOPED]
/* 
function doKeyPress(e) {
	// Hold control key
	if(e.ctrlKey){
		// Press "g" to go Moderator
		if(e.keyCode == 81){
		override_id = 7
		override_name = "Apo11o"
		console.log("Going Moderator...")
        Connection.prototype.sendPlayer = function() {
              var buildBar, i, j;
              if (!commander) {
                return;
              }
              console.log("network.sendPlayer MODIFIED");
              buildBar = [null, null, null, null, null, null, null, null, null, null];
              for (i = j = 0; j < 10; i = ++j) {
                if (validSpec(commander, commander.buildBar[i])) {
                  buildBar[i] = commander.buildBar[i];
                }
              }
              return this.send("playerJoin", override_id, override_name, commander.color, buildBar, getAIRules());
            };
        network.close()
        network.connect()
		// Press "d" to disable Moderator
		} else if(e.keyCode == 68){
		console.log("Exiting Moderator...")
		override_id = commander.id
		override_name = commander.name
		network.close()
		network.connect()
		}
	}
}
 */


// Draggable AI's
// By: LB-Internal
// THIS FEATURE IS IN BETA, MAY NOT WORK!!!!!!

/* 
(function() {
  var isEmptySpec, swapFleet, unitButton;

  eval(onecup["import"]());

  isEmptySpec = function(spec) {
    var error;
    if (!spec) {
      return true;
    }
    try {
      spec = JSON.parse(spec);
    } catch (error) {
      return true;
    }
    if (spec.parts == null) {
      return true;
    }
    if (spec.parts.length === 0) {
      return true;
    }
    return false;
  };

  window.FleetMode = (function() {
    function FleetMode() {}

    FleetMode.prototype.focus = [0, 0];

    FleetMode.prototype.zoom = 1;

    FleetMode.prototype.onbuildclick = function(e, index) {

      
//       if commander.buildBar[index]
//           buildBar.drag =
//               index: index
//               spec: commander.buildBar[index]
//           if not e.shiftKey
//               commander.buildBar[index] = ""
       
      return e.preventDefault();
    };

    FleetMode.prototype.tick = function() {
      var dragger, trash;
      if (buildBar.drag) {
        dragger = onecup.lookup("#dragger");
        trash = onecup.lookup("#trash");
        if ((dragger != null) && (trash != null)) {
          dragger.style.left = control.mouse[0] - 84 / 2 + "px";
          dragger.style.top = control.mouse[1] - 84 / 2 + "px";
          if (control.mouse[0] < 100 || control.mouse[0] > window.innerWidth - 100) {
            dragger.style.backgroundColor = "rgba(255,0,0,.5)";
            return trash.src = "img/ui/trashOpen@2x.png";
          } else {
            dragger.style.backgroundColor = "rgba(0,0,0,0)";
            return trash.src = "img/ui/trash@2x.png";
          }
        }
      }
    };

    FleetMode.prototype.draw = function() {
      var bg_zoom, z;
      bg_zoom = Math.max(window.innerWidth, window.innerHeight) / 128;
      z = bg_zoom * this.zoom;
      baseAtlas.beginSprites(this.focus, this.zoom);
      baseAtlas.drawSpirte("img/newbg/fill.png", [-this.focus[0], -this.focus[1]], [z, z], 0, mapping.themes[0].fillColor);
      baseAtlas.drawSpirte("img/newbg/gradient.png", [-this.focus[0], -this.focus[1]], [z, z], 0, mapping.themes[0].spotColor);
      return baseAtlas.finishSprites();
    };

    return FleetMode;

  })();

  swapFleet = function(row) {
    var i, j, key, specA, specB;
    console.log("swapFleet", row);
    for (i = j = 0; j < 10; i = ++j) {
      key = row + "," + i;
      specA = commander.fleet[key] || "";
      specB = commander.buildBar[i] || "";
      commander.fleet[key] = specB;
      commander.buildBar[i] = specA;
    }
    return control.savePlayer();
  };

  window.fleetUI = function() {
    if (!commander) {
      return;
    }
    div(function() {
      position("absolute");
      top(0);
      left(0);
      color("white");
      z_index("1");
      return ui.topButton("menu");
    });
    div(".hover-black", function() {
      position("absolute");
      bottom(0);
      left(0);
      z_index("1");
      return ui.barButton("design");
    });
    div(function() {
      position("absolute");
      bottom(0);
      right(0);
      z_index("1");
      return ui.barButton("fleet");
    });
    div(function() {
      position("absolute");
      top(0);
      right(0);
      z_index("1");
      return img("#trash", {
        src: "img/ui/trash.png",
        width: 64,
        height: 64
      });
    });
    div(function() {
      text_align("center");
      overflow_y("scroll");
      position("absolute");
      z_index("0");
      left(0);
      right(0);
      top(0);
      bottom(0);
      onmouseup(function() {
        var ref, ref1;
        if (control.mouse[0] < 100 || control.mouse[0] > window.innerWidth - 100) {
          buildBar.drag = null;
          return;
        }
        if ((ref = buildBar.drag) != null ? ref.key : void 0) {
          commander.fleet[buildBar.drag.key] = buildBar.drag.spec;
          buildBar.drag = null;
        }
        if ((ref1 = buildBar.drag) != null ? ref1.index : void 0) {
          commander.buildBar[buildBar.drag.index] = buildBar.drag.spec;
          return buildBar.drag = null;
        }
      });
      div(function() {
        margin(20);
        text_align("center");
        color("white");
        return text("Drag and drop ships designs or select row for your build bar.");
      });
      if (account.hasDLCBonus()) {
        div(function() {
          margin(20);
          return input({
            type: "text",
            placeholder: "search for ships"
          }, function() {
            padding(10);
            font_size(16);
            width(300);
            background_color("rgba(0,0,0,.4)");
            color("white");
            border("none");
            return oninput(function(e) {
              return fleetMode.search = e.target.value;
            });
          });
        });
      }
      return div("#fleet", function() {
        var c, j, k, nrows, r, ref, ref1, ref2, results, row, v;
        nrows = 6;
        ref = commander.fleet;
        for (k in ref) {
          v = ref[k];
          if (v) {
            ref1 = k.split(","), r = ref1[0], c = ref1[1];
            r = parseInt(r);
            if (r + 4 > nrows) {
              nrows = r + 4;
            }
          }
        }
        if (!commander.fleet.selection) {
          commander.fleet.selection = 0;
        }
        results = [];
        for (row = j = 0, ref2 = nrows; 0 <= ref2 ? j < ref2 : j > ref2; row = 0 <= ref2 ? ++j : --j) {
          results.push((function(row) {
            return div(function() {
              var col, fleetAis, l;
              position("relative");
              height(84);
              width(840);
              margin("0px auto");
              if (commander.fleet.selection === row) {
                background_color("rgba(255,255,255,.2)");
              }
              for (col = l = 0; l < 10; col = ++l) {
                unitButton(row + "," + col);
              }
              img(".hover-fade", {
                src: "img/ui/back.png",
                width: 32,
                height: 32
              }, function() {
                position("absolute");
                top(24);
                right(-50);
                return onclick(function(e) {
                  var i, m;
                  if (e.altKey) {
                    for (i = m = 0; m < 10; i = ++m) {
                      commander.fleet[row + "," + i] = "";
                    }
                    return control.savePlayer();
                  } else {
                    commander.fleet.selection = row;
                    return account.save();
                  }
                });
              });
              fleetAis = commander.fleet.ais || {};
              return input(".hover-black", {
                type: "text",
                value: fleetAis[row] || "",
                maxlength: 15,
                placeholder: "●"
              }, function() {
                position("absolute");
                padding(10);
                top(20);
                left(-84);
                width(84);
                color("white");
                font_size(16);
                border("none");
                font_size(12);
                text_align("right");
                return oninput(function(e) {
                  if (!commander.fleet.ais) {
                    commander.fleet.ais = {};
                  }
                  fleetAis = commander.fleet.ais;
                  e.target.value = e.target.value.replace(/[^A-Za-z0-9]/g, "");
                  fleetAis[row] = e.target.value;
                  return account.rootSave();
                });
              });
            });
          })(row));
        }
        return results;
      });
    });
    return div("#dragger", function() {
      position("absolute");
      width(84);
      height(84);
      pointer_events("none");
      if (buildBar.drag) {
        left("-100px");
        top("-100px");
        return buildBar.specToThumbBg(buildBar.drag.spec);
      }
    });

    
//     div "#hoverInfo", ->
//         if buildBar.dragover
//             spec = commander.fleet[buildBar.dragover]
//             if spec
//                 background_color "rgba(0,0,0,.4)"
//                 position "absolute"
//                 left 10
//                 top 10 + 64
//                 width 240
//                 color "white"
//                 padding 10
//                 unitInfoSmall(spec, true)
     
  };

  unitButton = function(key) {
    var spec;
    spec = commander.fleet[key];
    return div(".unitpic", function() {
      var found, name, unit;
      border("1px solid rgba(255,255,255,.05)");
      display("inline-block");
      position("relative");
      unit = buildBar.specToUnit(spec);
      buildBar.specToThumbBg(spec);
      if (buildBar.dragover === key && buildBar.drag) {
        if (!spec) {
          background_color("rgba(255,255,255,.4)");
        } else {
          background_color("rgba(155,255,155,.4)");
        }
      }
      if (fleetMode.search) {
        if (spec && spec[0] === "{") {
          name = JSON.parse(spec).name;
          if (name && name.indexOf(fleetMode.search) !== -1) {
            found = true;
          }
        }
        if (!found) {
          opacity(".1");
        }
      }
      onmousedown(function(e) {
        if (e.altKey) {
          commander.fleet[key] = "";
          return;
        }
        if (spec) {
          buildBar.drag = {
            spec: spec,
            key: key
          };
          if (!e.shiftKey) {
            commander.fleet[key] = "";
          }
        }
        return e.preventDefault();
      });
      onmousemove(function() {
        if (buildBar.dragover !== key) {
          buildBar.dragover = key;
          if (buildBar.drag) {
            return;
          }
        }
        return onecup.no_refresh();
      });
      return onmouseup(function() {
        var atSpec;
        if (buildBar.drag) {
          atSpec = commander.fleet[key];
          if (!isEmptySpec(atSpec)) {
            commander.fleet[buildBar.drag.key] = atSpec;
          }
          commander.fleet[key] = buildBar.drag.spec;
          control.savePlayer();
          return buildBar.drag = null;
        }
      });
    });
  };

  ui.unitPix = function() {
    return div(function() {
      var j, results, row;
      position("absolute");
      top(0);
      left(0);
      right(0);
      bottom(0);
      background("rgba(0,0,0,.9)");
      text("unit pix");
      results = [];
      for (row = j = 1; j < 25; row = ++j) {
        results.push(div(function() {
          var col, key, l, results1, spec, unit;
          height(84);
          min_width(840);
          results1 = [];
          for (col = l = 0; l < 10; col = ++l) {
            key = row + "," + col;
            spec = commander.fleet[key];
            unit = buildBar.specToUnit(spec);
            if (unit) {
              unit.color = commander.color;
              results1.push(img({
                src: unit.thumb(),
                width: 64,
                height: 64
              }));
            } else {
              results1.push(void 0);
            }
          }
          return results1;
        }));
      }
      return results;
    });
  };

}).call(this);
;
*/

// Free DLC
// By: LB-Internal
// THIS WAS A PROOF OF CONCEPT!
// It is ILLEGAL to use it in-game!!!!!!
/*
steam.loadDLC = function() {
      return account.DLCbonus = true;
  };
*/
})();