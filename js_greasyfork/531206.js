// ==UserScript==
// @name         Venge.io HACKS INF AMMO AIMBOT NOCLIP INVISIBILITY FLY INFJUMP {Venge Hacked Client}
// @namespace    http://akncreations.com/
// @version      20230725.1.2.0
// @description  The best hacks for VENGE IO (z to open modmenu)
// @author       ExplodIng_Andrey
// @match        https://*.venge.io/*
// @license      https://creativecommons.org/licenses/by-nd/4.0/
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/531206/Vengeio%20HACKS%20INF%20AMMO%20AIMBOT%20NOCLIP%20INVISIBILITY%20FLY%20INFJUMP%20%7BVenge%20Hacked%20Client%7D.user.js
// @updateURL https://update.greasyfork.org/scripts/531206/Vengeio%20HACKS%20INF%20AMMO%20AIMBOT%20NOCLIP%20INVISIBILITY%20FLY%20INFJUMP%20%7BVenge%20Hacked%20Client%7D.meta.js
// ==/UserScript==

// https://www.youtube.com/@exploding_andrey
// https://www.akncreations.com/vhc.html
// https://github.com/AndreyNesterenko2020/

addEventListener("load", function(){

//VHC designed by ExplodIng_Andrey
 
//dispose of old client (if any)
if(client) {
  client.dispose();
};
 
var client = {
  Hacks: [],
  version: "1.2.0",
  keyBinds: {},
  inGame: false,
};
client.Hack = class {
  constructor(enable, mainLoop, disable, name, description, key, delay, configurationDefinition){
    this.enable = function(){try {enable(this_);}catch(e){}; this.isEnabled = true};
    this.mainLoop = mainLoop;
    this.disable = function(){try {disable(this_);}catch(e){}; this.isEnabled = false};
    this.name = name;
    this.description = description;
    this.isEnabled = false;
    this.key = key;
    
    this.configurationDefinition = configurationDefinition;
    this.config = {};
    setTimeout(function() {
      this_.configurationDefinition && Object.keys(this_.configurationDefinition).forEach(function (e) {
           this_.config[e] = localStorage[this_.name] && JSON.parse(localStorage[this_.name]).config[e] ? JSON.parse(localStorage[this_.name]).config[e] : this_.configurationDefinition[e].defaultValue != undefined ? this_.configurationDefinition[e].defaultValue : (this_.configurationDefinition[e].possibleValues && this_.configurationDefinition[e].possibleValues[0] != undefined) ? this_.configurationDefinition[e].possibleValues[0] : false;
        });
    }, 1);
    
    client.keyBinds[this.key] = this.name;
    var this_ = this;
    if(!delay){
      delay = 10;
    };
    function loop(){
      if(this_.isEnabled && client){
        this_.mainLoop(this_);
      };
      setTimeout(loop, delay);
    };
    setTimeout(loop, 100);
    client.Hacks.push(this);
  };
};
client.MenuElement = class {
  constructor(Hacks, title, left, top){
    var menuElement = document.createElement("div");
    menuElement.style = "left:"+left+"; color: rgba(0, 0, 0, 1) !important; top:"+top+"; margin: 25px; text-align: center; background: rgba(114, 154, 232, 1) !important; font-family: inherit; width:20%; height: 60%; position: absolute; border: solid black 4px";
    menuElement.id = title;
    menuElement.innerHTML = "<div style='border-bottom: solid black 4px; height: 2.5%; padding: 5%; background-color: rgba(149, 180, 240, 1); font-size: 200%' id="+title+"header >"+title+"</div>";
    client.menuElement.appendChild(menuElement);
    for(let i = 0; i < Hacks.length; i++) {
      var part = document.createElement("div");
      part.style = 'border-bottom: solid black 4px; font-size: 200%';
      part.id = Hacks[i].name;
      if(Hacks[i].configurationDefinition) {
        let random = Math.floor(Math.random()*1000000);
        part.innerHTML = "<null>"+Hacks[i].name+"</null><img style='width: 25px;float:right;cursor:pointer' onmouseover='this.style.filter=`brightness(0.5)`' onmouseleave='this.style.filter=`brightness(1)`' id="+random+" src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAu1JREFUeJzt2L1qFFEAhuEv0Ub8KawsBBuDVqK9pBS8g9yGhY2VVyEItl6AYqmdipb2NoJFEAOCXTDEwh+yyv7Nzu45c+Z54FS7xcfMvDuwCQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBOlR4ww6Ukd5LcSrKd5EvZOSzgdJLbSXaTXE6yn+Sw6KIGnUnyKMmPJMcnzrsk1wvuYra7ST5l8p59T3IvyVbBXU3ZTvIikxf55DlIcrPYOqbZS3KU6fftYbFljdnL9IsskjrNi+P49+c7pQa25FnmByKSeiwSx5/zoNDGpnzIYhdbJOUtE8dxkidlZq5mu/SAfxws8d2LSV5FJCXsJXma5Z6fr2vaMir3s/gvkjdJGcu+Of6c3RJjW3MuyceIpFZd43gef/X25mqSzxFJbbrG8TbJhQJ7m7YTkdREHBUSSR3EUTGRlCWOARBJGeIYEJFsljgGSCSbIY4BE8l6iaMBIlkPcTREJP0SR4NE0g9xNEwkqxHHCIikG3GMiEiW0zWONxHHYIlkMeIYMZHMJg5EMoU4+Eskk8TBf0TyiziYauyRiIO5xhqJOFjY2CIRB0sbSyTioLPWIxEHK2s1EnHQm9YiEQe9ayUScbA2Q49klTjOF9jLAA01EnGwMUOLRBxs3FAiEQfF1B6JOCiu1kjEQTVqi0QcVKeWSMRBtUpHIg6qVyoScTAYm45EHAzOpiIRB4O17kjEweCtKxJx0Iy+I+kax+uIg0r1FYk4aNaqkYiD5nWN5FvEwUh0jUQcjMa6IxEHg7euSMRBM/qORBw0p69IxEGzVo1EHDSvayTiYDSWjUQcjM6ikYiD0ZoXiTgYvStJXmYyjKMkj5OcLbiLKbZKDxipa0luJDlM8j7Jftk5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMzwEyaMP2qlEyFaAAAAAElFTkSuQmCC'>";
        setTimeout(function () {
          document.getElementById(random).onclick = function (event,element) {
            client.renderConfig(Hacks[i]);
          }
          document.getElementById(random).onmouseover = function () {
            client.followText = Hacks[i].name+" options";
          }
          document.getElementById(random).onmouseleave = function () {
            client.followText = "";
          }
        }, 10);
      } else {
        part.innerHTML = "<null>"+Hacks[i].name+"</null>";
      }
      document.getElementById(title).appendChild(part);
      document.getElementById(Hacks[i].name).addEventListener("mousedown", function (event){
        if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
          return;
        }
        if(!pc.controls || !client.inGame) {client.error("You must be in a game to enable hacks!"); return};
        if(!Hacks[i].isEnabled){
          Hacks[i].enable();
          document.getElementById(Hacks[i].name).style.backgroundColor = "white";
        } else {
          Hacks[i].disable();
          document.getElementById(Hacks[i].name).style.backgroundColor = "rgba(114, 154, 232, 1)";
        };
      });
      document.getElementById(Hacks[i].name).addEventListener("mouseover", function (event){
          if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
            return;
          }
          client.followText = Hacks[i].description;
      });
      document.getElementById(Hacks[i].name).addEventListener("mouseleave", function (event){ 
          if(event.target!=document.getElementById(Hacks[i].name) && event.target!=document.getElementById(Hacks[i].name).children[0]) {
            return;
          }
          client.followText = "";
      });
    };
  };
};
 
client.menuToggled = 0;
client.menuElement = document.createElement("div");
document.body.appendChild(client.menuElement);
client.menuElement.id = "vhc-menu";
client.menuElement.style.width = "100%";
client.menuElement.style.height = "100%";
client.menuElement.style.background = "rgba(0, 0, 0, 0.5)";
client.menuElement.style.position = "absolute";
client.menuElement.style.zIndex = 100;
 
client.hackList = document.createElement("h1");
document.body.appendChild(client.hackList);
client.hackList.style.color = "#fff";
client.hackList.style.position = "fixed";
client.hackList.style.top = "40%";
client.hackList.innerHTML = "VHC version "+client.version+"<br>";
client.menuElement.style.zIndex = 100;
 
client.keyBindElement = document.createElement("h1");
document.body.appendChild(client.keyBindElement);
client.keyBindElement.style.color = "#fff";
client.keyBindElement.style.position = "fixed";
client.keyBindElement.style.top = "40%";
client.keyBindElement.style.fontSize = "132%";
client.keyBindElement.style.left = "80%";
client.keyBindElement.innerHTML = "Keybinds:<br>z - open menu<br><br>";
client.menuElement.style.zIndex = 100;
 
client.errorElement = document.createElement("h1");
document.body.appendChild(client.errorElement);
client.errorElement.style.color = "#fff";
client.errorElement.style.position = "absolute";
client.errorElement.style.top = "10%";
client.errorElement.style.width = "10%";
client.errorElement.style.fontSize = "100%";
client.errorElement.style.left = "40%";
client.errorElement.style.border = "solid red 1px";
client.errorElement.style.borderRadius = "7px";
client.errorElement.style.backgroundColor = "red";
client.errorElement.innerHTML = "client.errorElement";
client.errorElement.style.opacity = 0;
client.errorElement.style.transition = "all 0.3s";
client.errorElement.style.zIndex = "100";
 
client.followText = "";
client.follow = document.createElement("div");
client.follow.style.pointerEvents = "none";
client.follow.style.position = "absolute";
client.follow.style.minWidth = "10em";
client.follow.style.maxWidth = "20em";
client.follow.style.zIndex = "9999";
client.follow.style.backgroundColor = "#f5f5f5";
document.body.appendChild(client.follow);
document.body.addEventListener("mousemove", function (e){
    client.follow.innerHTML = client.followText;
    client.followText ? client.follow.style.border = "solid black 1px" : client.follow.style.border = "";
    x = e.pageX;
    y = e.pageY;
    client.follow.style.left = (x+10)+"px";
    client.follow.style.top = (y+10)+"px";
    if(x+10 > innerWidth-client.follow.getBoundingClientRect().width) client.follow.style.left = (innerWidth-client.follow.getBoundingClientRect().width)+"px"
});
 
client.error = function (text) {
  var audio = document.createElement("Audio");
  audio.src = "files/assets/31197478/1/Error-UI.mp3";
  audio.play();
  client.errorElement.innerHTML = text;
  client.errorElement.style.opacity = 1;
  setTimeout(function(){client.errorElement.style.opacity = 0;}, 1000)
};
 
document.addEventListener("keydown", function(event) {
    if (event.key == "z") {
      client.menuToggled = !client.menuToggled;
      !client.menuToggled && pc.app.fire("Mouse:Lock");
    };
    if (client.keyBinds[event.key]) {
      try {
        if(pc.app.root.findByName("Game").findByName("Overlay").findByName("ChatWrapper").findByName("Chat").script.scripts[0].isFocused) return;
      } catch (e) {}
      if(!pc.controls || !client.inGame) {client.error("You must be in a game to enable hacks!"); return};
      for(let i = 0; i < client.Hacks.length; i++){
        if(client.Hacks[i].name == client.keyBinds[event.key]){
          if(client.Hacks[i].isEnabled){
            client.Hacks[i].disable();
            document.getElementById(client.Hacks[i].name).style.backgroundColor = "rgba(114, 154, 232, 1)";
          } else {
            client.Hacks[i].enable();
            document.getElementById(client.Hacks[i].name).style.backgroundColor = "white";
          };
        };
      };
    };
});
 
client.MAIN = function() {
    try {
      client.inGame = !!pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.ws;
    } catch (e) {
      client.inGame && stophacks.enable();
      client.inGame = false;
    }
    client.hackList.innerHTML = "VHC version "+client.version+"<br>";
    client.keyBindElement.innerHTML = "Keybinds:<br>z - open menu<br><br>";
    for(let i = 0; i < client.Hacks.length; i++){
      if(client.Hacks[i].isEnabled){
        client.hackList.innerHTML += client.Hacks[i].name+(client.Hacks[i].type ? " <b style='color: skyblue'>["+client.Hacks[i].type+"]</b>" : " ")+"<br>";
      };
      if(client.Hacks[i].key == "no keybind") continue;
      client.keyBindElement.innerHTML += client.Hacks[i].key+" - "+client.Hacks[i].name+"<br>";
    };
    if (client.menuToggled) {
        document.exitPointerLock();
        client.menuElement.style.display = "block";
    } else {
        client.menuElement.style.display = "none";
    }
    setTimeout(client.MAIN, 10);
};
client.dispose = function () {
  console.log("disposing of client version "+client.version);
  client.Hacks.forEach(hack => {
    if(hack.isEnabled) {
      hack.disable();
    };
  });
  for (element in client) {
    client[element].outerHTML = "";
    delete client[element];
  };
  client = undefined;
};
client.renderConfig = function (hack) {
  var elem = document.getElementById(hack.name);
  if(!elem.children[2]) {
    var config = document.createElement("div");
    config.style.background = "rgba(149, 180, 240, 1)";
    config.style.border = "solid black 4px";
    config.style.position = "fixed";
    config.style.width = "20%";
    config.style.marginLeft = "-4px";
    config.innerHTML = "<div style='border-bottom:4px solid black'>Settings</div><div></div>";
    elem.appendChild(config);
    var list = config.children[1];
    list.style.fontSize = "25px";
    
    //render configs
    Object.values(hack.configurationDefinition).forEach(function(config, index){
        switch(config.type) {
            case 0:
                list.innerHTML += Object.keys(hack.configurationDefinition)[index]+" <input type='checkbox' id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></input><br>";
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).checked = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
            case 1:
                list.innerHTML += Object.keys(hack.configurationDefinition)[index]+" <select id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></select><br>";
                config.possibleValues.forEach(function(possibleValue) {
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).innerHTML += "<option value='"+possibleValue+"'>"+possibleValue+"</option>";
                });
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).value = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
            case 2:
                list.innerHTML += Object.keys(hack.configurationDefinition)[index]+" <input id='"+Object.keys(hack.configurationDefinition)[index]+"' onchange='client.processConfigChange.call(this, client.Hacks["+client.Hacks.indexOf(hack)+"], "+index+")'></input><br>";
                setTimeout(function(){
                    document.getElementById(Object.keys(hack.configurationDefinition)[index]).value = hack.config[Object.keys(hack.configurationDefinition)[index]];
                }, 10);
                break
        }
    });
  }
  if(elem.children[2].style.display == "block") {
    elem.children[2].style.display = "none";
    elem.children[1].style.transform = "rotate(0deg)";
  } else {
    elem.children[2].style.display = "block";
    elem.children[1].style.transform = "rotate(180deg)";
  }
}
client.processConfigChange = function (hack,index) {
    var value = this.type == "checkbox" ? this.checked : this.value;
    var configName = Object.keys(hack.config)[index];
    hack.config[configName]=value;
    localStorage[hack.name] = localStorage[hack.name] || "{\"config\":{}}";
    var newData = JSON.parse(localStorage[hack.name]);
    newData.config[configName] = value;
    localStorage[hack.name] = JSON.stringify(newData);
}
client.init = function() {
  console.log(client.version+" running on "+navigator.platform);
  //hacks
  var fly = new client.Hack(function (){
    platform = new pc.Entity();
    platform.addComponent("collision");
    platform.addComponent("rigidbody");
    platform.collision.halfExtents.x = 5;
    platform.collision.halfExtents.y = 1;
    platform.collision.halfExtents.z = 5;
    newplatform = new pc.Entity();
  }, function (){
    if(window.platform){
      newplatform.destroy();
      newplatform = platform.clone();
      pc.app.root.addChild(newplatform);
      platform.rigidbody.teleport(pc.app.root.findByName("Game").findByName("Player").localPosition.x, pc.app.root.findByName("Game").findByName("Player").localPosition.y-2, pc.app.root.findByName("Game").findByName("Player").localPosition.z);
    };
  }, function (){
    platform.destroy();
    newplatform.destroy();
  }, "Flight", "Fly around.", "c");
  var infJump = new client.Hack(function (){
    pc.controls.jump = function() {
        if (Date.now() - this.player.lastGlidingTime < 1e3)
            return !1;
        if (this.player.cancelGliding(),
        !this.isLanded && !this.isCollided)
     
        if (this.playerAbilities.isDashing)
            return !1;
        if (this.bounceJumpTime > this.timestamp)
            return !1;
        if (this.jumpingTime > this.timestamp)
            return !1;
        if (this.jumpingTime = this.timestamp + this.jumpDuration,
        this.isJumping = !0,
        this.isLanded = !1,
        this.airTime = this.now(),
        this.randomDirection = Math.random() > .5 ? -1 : 1,
        this.previousVelocity,
        this.now() - this.lastImpactTime > 3e3) {
            var t = "Jump-" + (Math.round(1 * Math.random()) + 1);
            this.app.fire("Character:Sound", t, .1 * Math.random()),
            this.entity.sound.play("Only-Jump"),
            this.entity.sound.slots["Only-Jump"].pitch = .1 * Math.random() + 1.1
        }
        if (this.dynamicGravity = 0,
        this.app.fire("Overlay:Jump", !0),
        this.isShooting > this.timestamp)
            return !1;
        this.app.tween(this.animation).to({
            jumpAngle: -11
        }, .15, pc.BackOut).start()
    }
  }, function (){
    
  }, function (){
    pc.controls.jump = function() {
      if (Date.now() - this.player.lastGlidingTime < 1e3)
          return !1;
      if (this.player.cancelGliding(),
      !this.isLanded && !this.isCollided)
          return !1;
      if (this.playerAbilities.isDashing)
          return !1;
      if (this.bounceJumpTime > this.timestamp)
          return !1;
      if (this.jumpingTime > this.timestamp)
          return !1;
      if (this.jumpingTime = this.timestamp + this.jumpDuration,
      this.isJumping = !0,
      this.isLanded = !1,
      this.airTime = this.now(),
      this.randomDirection = Math.random() > .5 ? -1 : 1,
      this.previousVelocity,
      this.now() - this.lastImpactTime > 3e3) {
          var t = "Jump-" + (Math.round(1 * Math.random()) + 1);
          this.app.fire("Character:Sound", t, .1 * Math.random()),
          this.entity.sound.play("Only-Jump"),
          this.entity.sound.slots["Only-Jump"].pitch = .1 * Math.random() + 1.1
      }
      if (this.dynamicGravity = 0,
      this.app.fire("Overlay:Jump", !0),
      this.player.fireNetworkEvent("j"),
      this.isShooting > this.timestamp)
          return !1;
      this.app.tween(this.animation).to({
          jumpAngle: -11
      }, .15, pc.BackOut).start()
    }
  }, "infJump", "Jump around indefinitely.", "m");
  var speedHacks = new client.Hack(function (){
    speed = 120;
    speedElement = document.createElement("h1");
    document.body.appendChild(speedElement);
    speedElement.style.color = "#fff";
    speedElement.style.position = "fixed";
    speedElement.style.top = "25px";
    speedElement.style.right = "25px";
    speedElement.style.background = "#222";
    speedElement.style.borderRadius = "15px";
    speedElement.style.transform = "translate(-50%, -50%)";
    document.body.onkeydown = function(event) {
      if (event.keyCode == 38) {
          speed += 25;
      } else if (event.keyCode == 40) {
          if (speed - 25 > 99) {
            speed -= 25;
          }
      }
    };
  }, function (){
    pc.app.fire("Admin:Speed", speed);
    speedElement.innerHTML = "&#11014; Speed: " + speed+" &#11015;";
  }, function(){
    speedElement.outerHTML = "";
    pc.app.fire("Admin:Speed", 120);
  }, "SpeedHacks", "Use up and down arrows to change your speed!", "t");
  var playerTeleport = new client.Hack(function (this_){
    pc.app.root.findByName("Game").findByName("Player").rigidbody.type = "dynamic";
    playerId = 2;
    playerName = document.createElement("h1");
    teleportToggled = 0;
    document.body.appendChild(playerName);
    playerName.style.color = "#fff";
    playerName.style.width = "35%";
    playerName.style.padding = "15px";
    playerName.style.textAlign = "center";
    playerName.style.background = "#222";
    playerName.style.borderRadius = "15px";
    playerName.style.position = "fixed";
    playerName.style.bottom = "0px";
    playerName.style.left = "50%";
    playerName.style.transform = "translate(-50%, -50%)";
    playerName.innerHTML = "An error has occured, Or there are no other players.  Restart hack.";
    document.body.onkeydown = function(event) {
    if(pc.app.root.findByName("Game").findByName("Overlay").findByName("ChatWrapper").findByName("Chat").script.scripts[0].isFocused) return;
        try {
          if (event.keyCode == 39 && pc.app.root.findByName("Game").findByName("PlayerHolder").children.length - 2 >= playerId) {
              playerId += 1;
          };
          if (event.keyCode == 37 && playerId - 1 > 1) {
              playerId -= 1;
          };
          if (event.keyCode == 86 && this_.isEnabled) {
              pc.app.root.findByName("Game").findByName("Player").rigidbody.teleport(
                  pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().x - 1,
                  pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().y + 10,
                  pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().z
              );
          };
          if (event.keyCode == 66 && this_.isEnabled) { 
              if (teleportToggled == 0) {
                  teleportToggled = 1;
              } else {
                  teleportToggled = 0;
              }; 
          };
        } catch (e) {}
    };
  }, function (){
    playerName.innerHTML = "&#11013; Selected: " + pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].script.scripts[0].username + " &#10145;<br>'V' to teleport once...<br>'B' to constantly follow them!";
    if (teleportToggled == 1) {
      try {
        pc.app.root.findByName("Game").findByName("Player").rigidbody.teleport(
          pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().x - 1,
          pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().y + 10,
          pc.app.root.findByName("Game").findByName("PlayerHolder").children[playerId].getPosition().z
        );
        pc.app.root.findByName("Game").findByName("Player").rigidbody.type = "static";
      } catch (e) {pc.app.root.findByName("Game").findByName("Player").rigidbody.type = "dynamic"};
    } else {
      pc.app.root.findByName("Game").findByName("Player").rigidbody.type = "dynamic";
    };
  }, function (){
    playerName.outerHTML = "";
    teleportToggled = 0;
    if(!noclip.isEnabled) pc.app.root.findByName("Game").findByName("Player").rigidbody.type = "dynamic";
  }, "playerTeleport", "Use left and right arrow keys to cycle players and teleport", "g");
  var bulletHacks = new client.Hack(function (){
    pc.controls.setShooting = function(t) {
        if (!this.isMouseLocked)
            return !1;
        var closest = Infinity;
        var closestPlayer = new pc.Entity();
        for(var i = 2; i <= pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1; i++){
            var dist = pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.distance(pc.app.root.findByName("Game").findByName("Player").localPosition)
            if(dist < closest && pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].health != 0){
                if((pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].team == pc.currentTeam) && pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].team != "none") continue
                closest = dist;
                closestPlayer = pc.app.root.findByName("Game").findByName("PlayerHolder").children[i];
            };
        };
        if ("Melee" == this.currentWeapon.type && this.setMeleeShoot(),
        "Throwable" == this.currentWeapon.type && this.setThrowShoot(),
        "Launcher" == this.currentWeapon.type && this.setLauncherShoot(t),
        this.player.checkShooting(),
        !this.currentWeapon.isShootable)
            return !1;
        if (this.leftMouse || this.isShootingLocked || this.isFireStopped || (this.stopFiring(),
        0 === this.currentWeapon.ammo && this.reload()),
        this.leftMouse && !this.isWeaponHidden && !this.isShootingLocked && !this.playerAbilities.isThrowing && this.isReloading < this.timestamp && this.playerAbilities.isHitting < this.timestamp && (this.currentWeapon.ammo > 0 ? this.isShooting = this.currentWeapon.shootTime + this.timestamp : this.reload()),
        this.isShooting > this.timestamp && !this.isShootingLocked) {
            this.currentWeapon.recoil,
            this.currentWeapon.cameraShake,
            Math.random(),
            Math.random(),
            this.currentWeapon.spread;
            var i = Math.cos(110 * this.spreadCount);
            this.currentWeapon.spread;
            this.cancelInspect(!0),
            this.isFocusing && "Rifle" == this.currentWeapon.type && (-.05,
            .5,
            -.2,
            .5,
            .05,
            this.currentWeapon.focusSpread,
            this.currentWeapon.focusSpread * i),
            "Sniper" != this.currentWeapon.type && "Shotgun" != this.currentWeapon.type || (this.spreadNumber = this.currentWeapon.spread,
            this.isFocusing && (this.spreadNumber = this.currentWeapon.focusSpread),
            -5,
            5.2),
            this.currentWeapon.shoot(),
            this.currentWeapon.isAutomatic || (this.isMouseReleased = !1,
            this.leftMouse = !1);
            var e = this.currentWeapon.bulletPoint.getPosition().clone()
              , s = this.currentWeapon.bulletPoint.getEulerAngles().clone();
            "Sniper" == this.currentWeapon.type && this.isFocusing || (this.app.fire("EffectManager:Bullet", e, s),
            this.entity.script.weaponManager.triggerShooting());
            var o = this.currentWeapon.muzzlePoint.getPosition().clone()
              , n = this.raycastShootFrom
              , a = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , h = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , r = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , p = new pc.Vec3(closestPlayer.position.x, closestPlayer.position.y+1.5+Math.random()/10, closestPlayer.position.z)
              , c = this.currentWeapon.damage
              , m = this.currentWeapon.distanceMultiplier;
            if ("Shotgun" == this.currentWeapon.type) {
                this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c, "Shotgun", m);
                for (var u = 1, l = 0; l < 10; l++)
                    l > 5 && (u = .5),
                    a = Math.cos(l / 3 * Math.PI) * this.spreadNumber * u,
                    h = Math.sin(l / 3 * Math.PI) * this.spreadNumber * u,
                    r = Math.cos(l / 3 * Math.PI) * this.spreadNumber * u,
                    p = new pc.Vec3(closestPlayer.position.x, closestPlayer.position.y+2+Math.random()/10, closestPlayer.position.z),
                    this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c, "Shotgun", m)
            } else
                this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c);
            this.setShakeAnimation(t),
            this.isShootingLocked = !0,
            this.isFireStopped = !1
        }
        this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1),
        this.updateShakeAnimation(t)
    }
  }, function(){
  
  }, function (){
    pc.controls.setShooting = function(t) {
        if (!this.isMouseLocked)
            return !1;
        if ("Melee" == this.currentWeapon.type && this.setMeleeShoot(),
        "Throwable" == this.currentWeapon.type && this.setThrowShoot(),
        "Launcher" == this.currentWeapon.type && this.setLauncherShoot(t),
        this.player.checkShooting(),
        !this.currentWeapon.isShootable)
            return !1;
        if (this.leftMouse || this.isShootingLocked || this.isFireStopped || (this.stopFiring(),
        0 === this.currentWeapon.ammo && this.reload()),
        this.leftMouse && !this.isWeaponHidden && !this.isShootingLocked && !this.playerAbilities.isThrowing && this.isReloading < this.timestamp && this.playerAbilities.isHitting < this.timestamp && (this.currentWeapon.ammo > 0 ? this.isShooting = this.currentWeapon.shootTime + this.timestamp : this.reload()),
        this.isShooting > this.timestamp && !this.isShootingLocked) {
            this.currentWeapon.recoil,
            this.currentWeapon.cameraShake,
            Math.random(),
            Math.random(),
            this.currentWeapon.spread;
            var i = Math.cos(110 * this.spreadCount);
            this.currentWeapon.spread;
            this.cancelInspect(!0),
            this.isFocusing && "Rifle" == this.currentWeapon.type && (-.05,
            .5,
            -.2,
            .5,
            .05,
            this.currentWeapon.focusSpread,
            this.currentWeapon.focusSpread * i),
            "Sniper" != this.currentWeapon.type && "Shotgun" != this.currentWeapon.type || (this.spreadNumber = this.currentWeapon.spread,
            this.isFocusing && (this.spreadNumber = this.currentWeapon.focusSpread),
            -5,
            5.2),
            this.currentWeapon.shoot(),
            this.currentWeapon.isAutomatic || (this.isMouseReleased = !1,
            this.leftMouse = !1);
            var e = this.currentWeapon.bulletPoint.getPosition().clone()
              , s = this.currentWeapon.bulletPoint.getEulerAngles().clone();
            "Sniper" == this.currentWeapon.type && this.isFocusing || (this.app.fire("EffectManager:Bullet", e, s),
            this.entity.script.weaponManager.triggerShooting());
            var o = this.currentWeapon.muzzlePoint.getPosition().clone()
              , n = this.raycastShootFrom
              , a = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , h = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , r = Math.random() * this.spreadNumber - Math.random() * this.spreadNumber
              , p = this.raycastTo.clone().add(new pc.Vec3(a,h,r))
              , c = this.currentWeapon.damage
              , m = this.currentWeapon.distanceMultiplier;
            if ("Shotgun" == this.currentWeapon.type) {
                this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c, "Shotgun", m);
                for (var u = 1, l = 0; l < 10; l++)
                    l > 5 && (u = .5),
                    a = Math.cos(l / 3 * Math.PI) * this.spreadNumber * u,
                    h = Math.sin(l / 3 * Math.PI) * this.spreadNumber * u,
                    r = Math.cos(l / 3 * Math.PI) * this.spreadNumber * u,
                    p = this.raycastTo.clone().add(new pc.Vec3(a,h,r)),
                    this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c, "Shotgun", m)
            } else
                this.app.fire("EffectManager:Fire", n, p, o, this.player.playerId, c);
            this.setShakeAnimation(t),
            this.isShootingLocked = !0,
            this.isFireStopped = !1
        }
        this.isShooting < this.timestamp && this.isShootingLocked && (this.isShootingLocked = !1),
        this.updateShakeAnimation(t)
    }
  }, "aimBot", "Homing bullets that target headshots", "l");
  var infAmmo = new client.Hack(function (){
    
  }, function (){
    pc.controls.currentWeapon.ammo=Infinity;
  }, function (){
    pc.controls.setAmmoFull();
  }, "infAmmo", "Infinite ammo - no reloading needed", "k", 1);
  var ESP = new client.Hack(function (){
    nearestPlayer = document.createElement("h1");
    document.body.appendChild(nearestPlayer);
    nearestPlayer.style.color = "#fff";
    nearestPlayer.style.width = "35%";
    nearestPlayer.style.padding = "15px";
    nearestPlayer.style.textAlign = "center";
    nearestPlayer.style.background = "#222";
    nearestPlayer.style.borderRadius = "15px";
    nearestPlayer.style.position = "fixed";
    nearestPlayer.style.bottom = "0px";
    nearestPlayer.style.left = "50%";
    nearestPlayer.style.transform = "translate(-50%, -50%)";
    nearestPlayer.innerHTML = "An error has occured, Or there are no other players.  Restart hack.";
    window._a = 0; 
  }, function (){
    window._a++;
    var closest = Infinity;
    var closestPlayer = new pc.Entity();
    closestPlayer.script = {scripts:[{username:"none"}]};
    for(let i = 2; i <= pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1; i++){
        var dist = pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.distance(pc.app.root.findByName("Game").findByName("Player").localPosition)
        if(dist < closest && pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].health != 0){
            closest = dist;
            closestPlayer = pc.app.root.findByName("Game").findByName("PlayerHolder").children[i];
        };
    };
    nearestPlayer.innerHTML = "Nearest Player: "+closestPlayer.script.scripts[0].username+"<br>Distance: "+closest;
    if(closest<6) nearestPlayer.style.color = "red"
    if(closest>6) nearestPlayer.style.color = "white"
    if(window._a < 10) return;
    window._a = 0;
    for(let i = 2; i <= pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1; i++){
        pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.label.isEnabled=true
        pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.label.alwaysShow=true
        if(pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].team == "none"){
          pc.app.drawLine(pc.app.root.findByName("Game").findByName("Player").localPosition,  pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position, pc.Color.RED, false);
        } else {
          if(pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.scripts[0].team == pc.currentTeam) {
            pc.app.drawLine(pc.app.root.findByName("Game").findByName("Player").localPosition,  pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position, pc.Color.GREEN, false);
          } else {
            pc.app.drawLine(pc.app.root.findByName("Game").findByName("Player").localPosition,  pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position, pc.Color.RED, false);
          };
        };
    };
  }, function (){
    nearestPlayer.outerHTML = "";
    for(let i = 2; i <= pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1; i++){
      console.log(pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].render);
      pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].removeComponent("render");
      pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.label.isEnabled=false
      pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].script.label.alwaysShow=false
    };
  }, "ESP", "Always know where players are.", ";");
  var spamChat = new client.Hack(function () {
  }, function () {
      function uuid (){
        const ho = (n, p) => n.toString(16).padStart(p, 0); /// Return the hexadecimal text representation of number `n`, padded with zeroes to be of length `p`
        const data = crypto.getRandomValues(new Uint8Array(16)); /// Fill the buffer with random data
        data[6] = (data[6] & 0xf) | 0x40; /// Patch the 6th byte to reflect a version 4 UUID
        data[8] = (data[8] & 0x3f) | 0x80; /// Patch the 8th byte to reflect a variant 1 UUID (version 4 UUIDs are)
        const view = new DataView(data.buffer); /// Create a view backed by a 16-byte buffer
        return `${ho(view.getUint32(0), 8)}-${ho(view.getUint16(4), 4)}-${ho(view.getUint16(6), 4)}-${ho(view.getUint16(8), 4)}-${ho(view.getUint32(10), 8)}${ho(view.getUint16(14), 4)}`; /// Compile the canonical textual form from the array data
    };
    pc.app.fire("Network:Chat", uuid());
  }, function (){
  }, "spamChat", "Spam the game's chat", "no keybind", 200);
  var serverKill = new client.Hack(function (this_){
    pc.controls.setCameraAngle = function(t,a) {
      this.lookY = Math.max(-90, this.lookY),
      this.lookY = Math.min(90, this.lookY),
      this.isLanded ? this.currentLook = this.lookX + this.animation.cameraImpact : this.currentLook = pc.math.lerpAngle(this.currentLook, this.lookX + this.animation.cameraImpact, .01),
      this.angleEntity.setLocalEulerAngles(0, this.currentLook, 0),
      this.isReloading > this.timestamp && (this.isFocusing = !1)
    };
    var pos = pc.app.root.findByName("Game").findByName("Player").position;
    for(let i = 2; i <= pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1; i++){
      setTimeout(function(){pc.app.root.findByName("Game").findByName("Player").rigidbody.teleport(new pc.Vec3(pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.x-2, pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.y, pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.z));pc.controls.lookEntity.lookAt(new pc.Vec3(pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.x, pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.y, pc.app.root.findByName("Game").findByName("PlayerHolder").children[i].position.z));pc.controls.leftMouse=true;}, 1000*i);
      setTimeout(function(){pc.controls.triggerKeyE();pc.controls.setMouseState(true);
      pc.controls.currentWeapon.ammo = 50}, 950*i);
      setTimeout(function(){console.log(i == pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1);if(i == pc.app.root.findByName("Game").findByName("PlayerHolder").children.length-1){
        document.getElementById(serverKill.name).style.backgroundColor = "rgba(114, 154, 232, 1)";
        serverKill.disable();
        pc.app.root.findByName("Game").findByName("Player").rigidbody.teleport(pos.x, pos.y, pos.z);
      }}, 1200*i);
    };
  }, function (){
  
  }, function (){
    pc.controls.leftMouse=false;
    pc.controls.setCameraAngle = function(t) {
      this.lookY = Math.max(-90, this.lookY),
      this.lookY = Math.min(90, this.lookY),
      this.lookEntity.setLocalEulerAngles(this.lookY + this.animation.cameraBounce + this.animation.cameraImpact, this.lookX + this.animation.cameraImpact, 0),
      this.lookXEntity.setLocalEulerAngles(0, this.lookX + this.animation.cameraImpact, 0),
      this.isLanded ? this.currentLook = this.lookX + this.animation.cameraImpact : this.currentLook = pc.math.lerpAngle(this.currentLook, this.lookX + this.animation.cameraImpact, .01),
      this.angleEntity.setLocalEulerAngles(0, this.currentLook, 0),
      this.isReloading > this.timestamp && (this.isFocusing = !1)
    };
  }, "serverKill", "instantly kill the server", "no keybind");
  var emergencyTeleport = new client.Hack(function (){
    pc.app.fire("Network:Respawn", false);
  }, function() {
    document.getElementById(emergencyTeleport.name).style.backgroundColor = "rgba(114, 154, 232, 1)";
    emergencyTeleport.disable();
  }, function () {
    
  }, "emergencyTeleport", "teleport away in times of crisis", "q");
  var opGun = new client.Hack(function (){
    window.oldStats = window.oldStats || {};
    window.oldStats[pc.controls.currentWeapon.entity.name] = [pc.controls.currentWeapon.shootTime, pc.controls.currentWeapon.isAutomatic];
  }, function() {
    pc.controls.currentWeapon.shootTime = 0.01;
    pc.controls.currentWeapon.isAutomatic = true;
  }, function () {
    pc.controls.currentWeapon.shootTime = window.oldStats[pc.controls.currentWeapon.entity.name][0];
    pc.controls.currentWeapon.isAutomatic = window.oldStats[pc.controls.currentWeapon.entity.name][1];
    delete window.oldStats[pc.controls.currentWeapon.entity.name][1];
  }, "opGun", "makes every gun behave like a machine gun (tip: use with sniper)", "no keybind");
  var noRecoil = new client.Hack(function (){
    pc.controls.setShakeAnimation = function(t) {
        this.currentWeapon.ammo--;
        this.app.fire("Overlay:Shoot", !0);
    }
  }, function () {
    
  }, function (){
    pc.controls.setShakeAnimation = function(t) {
        var i = this.currentWeapon.recoil
          , e = this.currentWeapon.cameraShake
          , s = .03 * Math.random() - .03 * Math.random()
          , o = -.15 * i
          , n = 6 * i
          , a = -1.2
          , h = 2
          , r  = this.currentWeapon.spread
          , p = Math.cos(110 * this.spreadCount)
          , c = this.currentWeapon.spread * p;
        this.isFocusing && "Rifle" == this.currentWeapon.type && (o = -.05,
        n = .5,
        a = -.2,
        e *= .5,
        h = .05,
        r = this.currentWeapon.focusSpread,
        c = this.currentWeapon.focusSpread * p),
        "Sniper" != this.currentWeapon.type && "Shotgun" != this.currentWeapon.type || (a = -5,
        h = 5.2),
        this.lookY += .04 * e,
        this.spreadNumber = pc.math.lerp(this.spreadNumber, r, .1),
        this.spreadCount += t,
        this.currentWeapon.ammo--,
        this.app.fire("Overlay:Shoot", !0),
        this.app.tween(this.animation).to({
            bounceX: s,
            bounceZ: o,
            bounceAngle: n,
            shootSwing: h
        }, .03, pc.BackOut).start(),
        this.app.tween(this.animation).to({
            cameraShootBounce: a,
            cameraBounce: this.animation.cameraBounce + .025 * e
        }, .09, pc.BackOut).start(),
        this.animation.activeBounce = pc.math.lerp(this.animation.activeBounce, -e, .05),
        this.animation.horizantalSpread = pc.math.lerp(this.animation.horizantalSpread, .04 * c, .1)
    }
  }, "noRecoil", "no recoil", "no keybind");
  var instaRespawn = new client.Hack(function (){
    
  }, function () {
    if(pc.controls.player.isDeath) {
      pc.app.fire("Network:Respawn", false);
    }
  }, function (){
  
  }, "instaRespawn", "respawn instantly", "no keybind");
  var serverCrash = new client.Hack(function (this_){
    window.allow = false;
    if(this_.config.type == "countdown") {
      pc.app.fire("Network:Chat", "Crashing server in 10 seconds");
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 9 seconds");}, 1000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 8 seconds");}, 2000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 7 seconds");}, 3000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 6 seconds");}, 4000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 5 seconds");}, 5000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 4 seconds");}, 6000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 3 seconds");}, 7000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 2 seconds");}, 8000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Crashing server in 1 seconds");}, 9000);
      setTimeout(function(){pc.app.fire("Network:Chat", "Have a great day :)");}, 9900);
      setTimeout(function(){window.allow=true}, 10000);
    } else {
      window.allow = true;
    }
  }, function () {
    this.type = this.config.type;
    if(window.allow) {
      for(var a = 0; a < 52; a++) {
        var killString = "";
        for(var i = 0; i < 2048; i++){
          killString += "I_am_a_monkey_and_I_love_bananas\n";
        };
        pc.app.root.findByName("Game").findByName("NetworkManager").script.scripts[0].ws.send({monkey:killString, monkey2: killString});
      };
    };
  }, function (){
    
  }, "serverCrash", "Crash the server", "no keybind", false, {type:{type:1,defaultValue:"countdown",possibleValues:["countdown","instant"]}});
  var instantWeaponSwitch = new client.Hack(function (){
    pc.controls.player.setWeapon = function(t) {
      this.movement.disableZoom(),
      this.weaponManager.setWeapon(t),
      this.weaponIndex = this.weapons.indexOf(t),
      this.lastWeapon = t,
      this.lastWeaponChange = Date.now()
    }
    pc.controls.player.weaponManager.setWeapon = function(e, t) {
        if (this.currentWeaponName == e)
            return this.app.fire("Overlay:CircularSelect", e),
            !1;
        if (!t) {
            if (this.movement.isReloading > this.movement.timestamp)
                return !1;
            if (pc.isFinished)
                return !1
        }
        this.app.fire("Player:Focus", !1),
        t || this.app.fire("Network:Weapon", e),
        this.movement.hideWeapon(),
        this.currentWeapon ? (clearTimeout(this.takeOutTimer),
        this.takeOutTimer = setTimeout((function(a) {
            a.setWeaponModel(e, t),
            a.movement.takeout()
        }
        ), 0, this)) : this.setWeaponModel(e, t),
        this.app.fire("Overlay:CircularSelect", e),
        this.app.fire("Overlay:Weapon", e),
        this.currentWeaponName = e
    }
  }, function () {
    
  }, function (){
      pc.controls.player.setWeapon = function(t) {
        if (pc.currentModeOptions && !0 === pc.currentModeOptions.noWeaponChange)
            return !1;
        if (this.lastWeapon == t)
            return !1;
        if (Date.now() - this.lastWeaponChange > 2e3 || this.isDeath) {
            if (this.movement.isShooting > this.movement.timestamp && !this.isDeath)
                return !1;
            if (this.movement.isReloading > this.movement.timestamp && !this.isDeath)
                return !1;
            this.movement.disableZoom(),
            this.weaponManager.setWeapon(t),
            this.weaponIndex = this.weapons.indexOf(t),
            this.lastWeapon = t,
            this.lastWeaponChange = Date.now()
        } else
            this.app.fire("Chat:Message", "Console", "Please wait 2 seconds to change weapon."),
            this.weaponIndex = this.weapons.indexOf(this.lastWeapon)
    }
    pc.controls.player.weaponManager.setWeapon = function(e, t) {
        if (this.currentWeaponName == e)
            return this.app.fire("Overlay:CircularSelect", e),
            !1;
        if (!t) {
            if (this.movement.isReloading > this.movement.timestamp)
                return !1;
            if (pc.isFinished)
                return !1
        }
        this.app.fire("Player:Focus", !1),
        t || this.app.fire("Network:Weapon", e),
        this.movement.hideWeapon(),
        this.currentWeapon ? (clearTimeout(this.takeOutTimer),
        this.takeOutTimer = setTimeout((function(a) {
            a.setWeaponModel(e, t),
            a.movement.takeout()
        }
        ), 300, this)) : this.setWeaponModel(e, t),
        this.app.fire("Overlay:CircularSelect", e),
        this.app.fire("Overlay:Weapon", e),
        this.currentWeaponName = e
    }
  }, "instantWeaponSwitch", "No more weapon switch cooldown", "no keybind");
  var noDrown = new client.Hack(function (this_){
    pc.app.off("Network:Drown");
  }, function () {
    
  }, function (this_){
    pc.app.on("Network:Drown",pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.setDrown,pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager);
  }, "noDrown", "Disabled drowning", "no keybind");
  var noclip = new client.Hack(function () {
    pc.controls.setMovement = function() {
        pc.app.root.findByName("Game").findByName("Player").rigidbody.type="static";
        var t = this.lookEntity.forward
          , i = this.lookEntity.right
          , e = 1
          , s = this.defaultSpeed
          , o = this.strafingSpeed;
        e *= this.animation.movementFactor,
        this.isFocusing && (e = this.focusSpeedFactor),
        this.currentWeapon && "Heavy" == this.currentWeapon.weight ? (e *= .75,
        this.animation.movementFactorStatic = .65) : this.animation.movementFactorStatic = 1,
        this.force.x = 0,
        this.force.z = 0,
        !this.isForward || this.isLeft || this.isRight ? this.isForward && (this.force.x += t.x * o * e,
        this.force.z += t.z * o * e) : (this.force.x += t.x * s * e,
        this.force.z += t.z * s * e),
        this.isBackward && (this.force.x -= t.x * o * e,
        this.force.z -= t.z * o * e),
        this.isLeft && (this.force.x -= i.x * o * e,
        this.force.z -= i.z * o * e),
        this.isRight && (this.force.x += i.x * o * e,
        this.force.z += i.z * o * e)
        if(this.isDown) {
          this.force.y = -120;
        } else {
          if(this.isUp) {
            this.force.y = 120;
          } else {
            this.force.y = 0;
          }
        }
        if(this.isForward == this.isBackward) {this.isForward = this.isBackward = false}
        if(this.isLeft == this.isRight) {this.isLeft = this.isRight = false}
        var e = new pc.Vec3().copy(this.entity.localPosition).add(new pc.Vec3(this.force.x/120,this.force.y/120,this.force.z/120))
        pc.app.root.findByName("Game").findByName("Player").rigidbody.teleport(e);
        this.app.fire("EffectManager:PlayerPosition", this.entity.getPosition().clone());
    }
    pc.controls.setKeyboard = function() {
        if(!pc.app.keyboard.isPressed(pc.KEY_UP) && this.isForward) this.isForward = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_DOWN) && this.isBackward) this.isBackward = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_LEFT) && this.isLeft) this.isLeft = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_RIGHT) && this.isRight) this.isRight = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_W) && this.isForward) this.isForward = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_S) && this.isBackward) this.isBackward = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_A) && this.isLeft) this.isLeft = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_D) && this.isRight) this.isRight = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_SHIFT) && this.isDown) this.isDown = false;
        if(!pc.app.keyboard.isPressed(pc.KEY_SPACE) && this.isUp) this.isUp = false;
        return !this.isFrozen && (!this.player.isDeath && (!pc.isFinished && (!this.locked && ("INPUT" != document.activeElement.tagName && (this.jumpingTime + this.jumpLandTime < this.timestamp && this.currentHeight < this.nearGround && (this.isForward = !1,
        this.isBackward = !1,
        this.isLeft = !1,
        this.isRight = !1),
        (this.app.keyboard.isPressed(pc.KEY_UP) || this.app.keyboard.isPressed(pc.KEY_W) || this.isMobileForward) && (this.isForward = !0),
        (this.app.keyboard.isPressed(pc.KEY_DOWN) || this.app.keyboard.isPressed(pc.KEY_S) || this.isMobileBackward) && (this.isBackward = !0),
        (this.app.keyboard.isPressed(pc.KEY_LEFT) || this.app.keyboard.isPressed(pc.KEY_A) || this.isMobileLeft) && (this.isLeft = !0),
        (this.app.keyboard.isPressed(pc.KEY_RIGHT) || this.app.keyboard.isPressed(pc.KEY_D) || this.isMobileRight) && (this.isRight = !0),
        this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.jump(),
        this.app.keyboard.wasPressed(pc.KEY_R) && this.reload(),
        this.app.keyboard.wasPressed(pc.KEY_F) && this.triggerKeyF(),
        this.app.keyboard.wasPressed(pc.KEY_E) && this.triggerKeyE(),
        this.app.keyboard.wasPressed(pc.KEY_V) && this.player.spray(),
        this.app.keyboard.wasPressed(pc.KEY_X) && (this.leftMouse = !0,
        this.isMouseReleased = !0),
        this.app.keyboard.wasReleased(pc.KEY_X) && (this.leftMouse = !1),
        this.app.keyboard.wasPressed(pc.KEY_L) && (this.app.fire("Mouse:Lock"),
        this.app.fire("Overlay:Pause", !1)),
        this.app.keyboard.wasPressed(pc.KEY_M),
        this.app.keyboard.wasPressed(pc.KEY_J) && this.inspect(),
        this.app.keyboard.wasPressed(pc.KEY_SHIFT) && (this.isDown = !0),
        this.app.keyboard.wasPressed(pc.KEY_SPACE) && (this.isUp = !0),
        this.app.keyboard.wasReleased(pc.KEY_SPACE) && (this.isUp = !1),
        void (this.app.keyboard.wasReleased(pc.KEY_SHIFT) && (this.isDown = !1)))))))
    }
    pc.controls.checkGlitches = function (){}
  }, function () {
  
  }, function () {
    pc.app.root.findByName("Game").findByName("Player").rigidbody.type="dynamic";
    pc.controls.setMovement = function() {
        if (this.player.isDeath)
            return !1;
        if (pc.isFinished)
            return !1;
        if (this.playerAbilities.isDashing)
            return !1;
        var t = this.angleEntity.forward
          , i = this.angleEntity.right
          , e = 1
          , s = this.defaultSpeed
          , o = this.strafingSpeed;
        e *= this.animation.movementFactor,
        this.isFocusing && (e = this.focusSpeedFactor),
        this.currentWeapon && "Heavy" == this.currentWeapon.weight ? (e *= .75,
        this.animation.movementFactorStatic = .65) : this.animation.movementFactorStatic = 1,
        this.force.x = 0,
        this.force.z = 0,
        !this.isForward || this.isLeft || this.isRight ? this.isForward && (this.force.x += t.x * o * e,
        this.force.z += t.z * o * e) : (this.force.x += t.x * s * e,
        this.force.z += t.z * s * e),
        this.isBackward && (this.force.x -= t.x * o * e,
        this.force.z -= t.z * o * e),
        this.isLeft && (this.force.x -= i.x * o * e,
        this.force.z -= i.z * o * e),
        this.isRight && (this.force.x += i.x * o * e,
        this.force.z += i.z * o * e),
        this.entity.rigidbody.applyForce(this.currentForce),
        this.app.fire("EffectManager:PlayerPosition", this.entity.getPosition().clone())
    }
    pc.controls.setKeyboard = function() {
        return !this.isFrozen && (!this.player.isDeath && (!pc.isFinished && (!this.locked && ("INPUT" != document.activeElement.tagName && (this.jumpingTime + this.jumpLandTime < this.timestamp && this.currentHeight < this.nearGround && (this.isForward = !1,
        this.isBackward = !1,
        this.isLeft = !1,
        this.isRight = !1),
        (this.app.keyboard.isPressed(pc.KEY_UP) || this.app.keyboard.isPressed(pc.KEY_W) || this.isMobileForward) && (this.isForward = !0),
        (this.app.keyboard.isPressed(pc.KEY_DOWN) || this.app.keyboard.isPressed(pc.KEY_S) || this.isMobileBackward) && (this.isBackward = !0),
        (this.app.keyboard.isPressed(pc.KEY_LEFT) || this.app.keyboard.isPressed(pc.KEY_A) || this.isMobileLeft) && (this.isLeft = !0),
        (this.app.keyboard.isPressed(pc.KEY_RIGHT) || this.app.keyboard.isPressed(pc.KEY_D) || this.isMobileRight) && (this.isRight = !0),
        this.app.keyboard.wasPressed(pc.KEY_SPACE) && this.jump(),
        this.app.keyboard.wasPressed(pc.KEY_R) && this.reload(),
        this.app.keyboard.wasPressed(pc.KEY_F) && this.triggerKeyF(),
        this.app.keyboard.wasPressed(pc.KEY_E) && this.triggerKeyE(),
        this.app.keyboard.wasPressed(pc.KEY_V) && this.player.spray(),
        this.app.keyboard.wasPressed(pc.KEY_X) && (this.leftMouse = !0,
        this.isMouseReleased = !0),
        this.app.keyboard.wasReleased(pc.KEY_X) && (this.leftMouse = !1),
        this.app.keyboard.wasPressed(pc.KEY_L) && (this.app.fire("Mouse:Lock"),
        this.app.fire("Overlay:Pause", !1)),
        this.app.keyboard.wasPressed(pc.KEY_M),
        this.app.keyboard.wasPressed(pc.KEY_J) && this.inspect(),
        this.app.keyboard.wasPressed(pc.KEY_SHIFT) && (this.isFocusing = !0),
        void (this.app.keyboard.wasReleased(pc.KEY_SHIFT) && (this.isFocusing = !1)))))))
    }
    pc.controls.checkGlitches = function(t) {
        this.entity.rigidbody.linearVelocity.length() > 300 || this.currentHeight > 100 ? (this.glitchThreshold > 2 && this.app.fire("Network:Respawn", !0),
        this.glitchThreshold += t) : this.glitchThreshold = pc.math.lerp(this.glitchThreshold, 0, .1)
    }
  }, "noclip", "fly around freely without collision", "n");
  var grenadeSpam = new client.Hack(function (){
  }, function () {
    pc.controls.playerAbilities.throwCooldown = (pc.controls.player.characterName == "Echo")*0.5;
  }, function () {
    pc.controls.playerAbilities.throwCooldown = 10;
  }, "grenadeSpam", "No grenade throw cooldown", "no keybind");
  var autoGG = new client.Hack(function () {
  
  }, function () {
    this.type = this.config.message;
  }, function () {
  
  }, "autoGG", "say a GG message at the end of every game", "no keybind", false, {message:{type:2,defaultValue:"GG ez no hax"}});
  var antiAFK = new client.Hack(function () {
  
  }, function () {
    pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.send(["s","w",true]);
  }, function () {
    pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.send(["s","w",false]);
  }, "antiAFK", "prevent you from getting kicked for AFK", "no keybind");
  window.stophacks = new client.Hack(function () {
    client.Hacks.forEach(function (hack) {
      if(!hack.isEnabled) return
      hack.disable();
      document.getElementById(hack.name).style.backgroundColor = "rgba(114, 154, 232, 1)";
    });
  }, function () {
      stophacks.disable();
      document.getElementById(stophacks.name).style.backgroundColor = "rgba(114, 154, 232, 1)";
  }, function () {
  
  }, "Disable all hacks", "Disable all hacks", "y");
  var invisibility = new client.Hack(function (){
    pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.send=function(e){if(e[0]=="p"){e=["p",999999999999999999999999999999,0,0,0,0]}this.ws&&this.ws.readyState==this.ws.OPEN&&this.ws.send(this.pack.encode(e))}
  }, function () {
 
  }, function () {
    pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.send=function(e){this.ws&&this.ws.readyState==this.ws.OPEN&&this.ws.send(this.pack.encode(e))}
  }, "invisibility", "become invisible and invincible", "u");
  //menu elements
  new client.MenuElement([fly, infJump, speedHacks, playerTeleport, emergencyTeleport, noclip], "Movement", "0%", "0%");
  new client.MenuElement([bulletHacks, infAmmo, serverKill, opGun, grenadeSpam], "Combat", "25%", "0%");
  new client.MenuElement([ESP, spamChat, noRecoil, invisibility], "Render", "50%", "0%");
  new client.MenuElement([instaRespawn, serverCrash, instantWeaponSwitch, noDrown, autoGG, antiAFK, stophacks], "Game", "75%", "0%");
  //win message
  pc.app.on("Game:Finish", function(){if(autoGG.isEnabled){pc.app.fire("Network:Chat", autoGG.type)}; client.inGame = false; stophacks.enable();});
  pc.app.on("Game:Start", function(){
    client.inGame = true;
    try {
      var obj = JSON.parse(localStorage.config);
      client.Hacks.forEach(function (hack) {
       if(hack.name in obj) {
         hack.enable();
         document.getElementById(hack.name).style.backgroundColor = "white";
       }
      });
    } catch (e) {}
  });
  //config
  localStorage.config = localStorage.config || "{\"autoGG\":true}";
  client.MAIN();
};
client.init();

//
window.client=client;
});

//remember run in a userscript environment with @run-at set to document-start
//venge.io hide playcanvas library bypass (1.2 update)
//version 2.0
window._pc = false;
Object.defineProperty(window, "pc", {
    set (value) {
        if (!window.pc) {
            window._pc = value;
        }
    },
    get () {
        return(window._pc);
    }
});
