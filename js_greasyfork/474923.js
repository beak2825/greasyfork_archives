// ==UserScript==
// @name         CRAFTNITE.IO HACKED CLIENT - fly, triggerbot, esp, rapidFire, speedHacks, and more!
// @namespace    http://tampermonkey.net/
// @version      20230909.1.0.0_alpha1
// @description  Reduce craftnite to shit
// @author       ExplodIng_Andrey
// @match        https://craftnite.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=craftnite.io
// @grant        none
// @license      by-nd 4.0
// @downloadURL https://update.greasyfork.org/scripts/474923/CRAFTNITEIO%20HACKED%20CLIENT%20-%20fly%2C%20triggerbot%2C%20esp%2C%20rapidFire%2C%20speedHacks%2C%20and%20more%21.user.js
// @updateURL https://update.greasyfork.org/scripts/474923/CRAFTNITEIO%20HACKED%20CLIENT%20-%20fly%2C%20triggerbot%2C%20esp%2C%20rapidFire%2C%20speedHacks%2C%20and%20more%21.meta.js
// ==/UserScript==

//VHC designed by ExplodIng_Andrey

//dispose of old client (if any)
if(client) {
  client.dispose();
};

var client = {
  Hacks: [],
  version: "1.0.0_alpha1",
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
    menuElement.innerHTML = "<div style='border-bottom: solid black 4px; /*height: 2.5%;*/ padding: 5%; background-color: rgba(149, 180, 240, 1); font-size: 200%' id="+title+"header >"+title+"</div>";
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
        if(!window.GAME) {client.error("You must be in a game to enable hacks!"); return};
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
client.menuElement.style.zIndex = 1000;
client.menuElement.style.top = "0";

client.hackList = document.createElement("h1");
document.body.appendChild(client.hackList);
client.hackList.style.color = "#fff";
client.hackList.style.position = "fixed";
client.hackList.style.top = "40%";
client.hackList.innerHTML = "VHC version "+client.version+"<br>";
client.hackList.style.zIndex = 1000;
client.hackList.style.fontSize = "20px";
client.hackList.style.textAlign = "left";

client.keyBindElement = document.createElement("h1");
document.body.appendChild(client.keyBindElement);
client.keyBindElement.style.color = "#fff";
client.keyBindElement.style.position = "fixed";
client.keyBindElement.style.top = "40%";
client.keyBindElement.style.fontSize = "132%";
client.keyBindElement.style.right = 0;
client.keyBindElement.innerHTML = "Keybinds:<br>z - open menu<br><br>";
client.keyBindElement.style.zIndex = 1000;
client.keyBindElement.style.textAlign = "right";

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
client.errorElement.style.zIndex = "1000";

client.followText = "";
client.follow = document.createElement("div");
client.follow.style.pointerEvents = "none";
client.follow.style.position = "absolute";
client.follow.style.minWidth = "10em";
client.follow.style.maxWidth = "20em";
client.follow.style.zIndex = "9999";
client.follow.style.backgroundColor = "rgba(114, 154, 232, 1)";
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
      if(!client.menuToggled && client.inGame){if(client.menuToggled){GAME.uiManager.menuActive=false;};GAME.a865.player.controls.lock(); GAME.closea793(); GAME.inChat = false};
    };
    if (client.keyBinds[event.key]) {
      try {
        if(document.activeElement==document.getElementById("chat")) return;
      } catch (e) {}
      if(!client.inGame) {client.error("You must be in a game to enable hacks!"); return};
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
    /*
    try {
      client.inGame = !!pc.app.root.findByName("Game").findByName("NetworkManager").script.networkManager.ws;
    } catch (e) {
      client.inGame && stophacks.enable();
      client.inGame = false;
    }
    */
    client.hackList.innerHTML = "CraftShit version "+client.version+"<br>";
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
  var Fly = new client.Hack(function () {
    G.CONFIG.a143 = true;
  }, function () {

  }, function () {
    G.CONFIG.a143 = false;
  }, "Fly", "Enable flight", "c");
  var WaterLevel = new client.Hack(function (this_) {
    this_.a = GAME.oceanHeightTo
  }, function () {
    GAME.oceanHeightTo = Number(this.config["water level"]);
    this.type = this.config["water level"];
    if(!Number(this.config["water level"])) this.config["water level"] = this.oldlev;
    this.oldlev = this.config["water level"];
  }, function (this_) {
    GAME.oceanHeightTo = this_.a;
  }, "WaterLevel", "Change the water height on your side", "no keybind", false, {"water level":{defaultValue:260,type:2}});
  var SpeedHack = new client.Hack(function () {

  }, function () {
    if(G.Keybinds.moveForward.a730) GAME.a865.player.vZ=2.5;
  }, function () {

  }, "SpeedHack", "Increase walking speed", "t");
  var RapidFire = new client.Hack(function (this_) {
    if(!Date.now.a) {
      window.a = Date.now;
      Date.now=function(){
        function getStackTrace(){
          var obj = this;
          Error.captureStackTrace(obj, getStackTrace);
          return obj.stack;
        }
        if(getStackTrace().includes("a822er.update")) {
          return a.call(Date);
        } else {
          return a.call(Date)*(window.multiplier||1)-(window.warp||0);
        }
      }
      Date.now.a=true;
    }
  }, function () {
    this.type = this.config.multiplier+"x";
    if(this.oldmult != undefined && this.config.multiplier != this.oldmult) {
      if(!Number(this.config.multiplier)) this.config.multiplier = this.oldmult;
      window.warp = a.call(Date)-Date.now();
    }
    window.multiplier = this.config.multiplier;
    this.oldmult = this.config.multiplier;
  }, function (this_) {
    window.warp = a.call(Date)-Date.now();
    window.multiplier = 1;
  }, "RapidFire", "Shoot and reload faster", "no keybind", false, {multiplier:{defaultValue:2,type:2}});
  var InfAmmo = new client.Hack(function (this_) {
    this_.a = GAME.a865.player.updatea809Total;
    GAME.a865.player.updatea809Total = new Function;
  }, function () {

  }, function (this_) {
    GAME.a865.player.updatea809Total = this_.a;
  }, "InfAmmo", "Never run out of ammunition", "k");
  var TriggerBot = new client.Hack(function (this_) {
    this_.geometry = new THREE.BufferGeometry();
    this_.geometry.setFromPoints([new THREE.Vector3(0, 0, 0),new THREE.Vector3(0, 0, 1)]);
    this_.material = new THREE.LineBasicMaterial({
        depthTest: false,
        depthWrite: false,
        fog: false,
    });
    this_.hitboxes = [];
  }, function () {
    var chunks = [];
    GAME.scene.children.forEach(function(e) {
      if(e.type == "Mesh") {
        chunks.push(e);
      }
    });
     var this_ = this;
     G.othera822ers.forEach(function (player) {
        if(player && player.a240 && !player.hitbox_triggerBot) {
          var hitbox = new THREE.Mesh(new THREE.BoxGeometry);
          hitbox.scale.set(3,10,3);
          hitbox.renderOrder = 9999;
          hitbox.material.depthTest = false;
          hitbox.material.transparent = true;
          hitbox.material.opacity = 0;
          player.hitbox_triggerBot = hitbox;
          this_.hitboxes.push(hitbox);
          player.a240.add(hitbox);
          hitbox.visible = true;
          hitbox.player = player;
        }
    });
    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.raycaster.set(GAME.a865.player.camera.position, vec=new THREE.Vector3(),GAME.a865.player.camera.getWorldDirection(vec),vec);
    var result = this.raycaster.intersectObjects(this.hitboxes.concat(chunks));
    if(result[0] && result[0].object.player && result[0].object.parent) {
      G.Keybinds.shoot.a730=true
      setTimeout(function () {
        G.Keybinds.shoot.a730=false;
      }, 10);
    }
  }, function (this_) {
    this_.hitboxes.forEach(function (hitbox) {
       hitbox.parent.remove(hitbox);
       delete hitbox.player.hitbox_triggerBot;
     });
     GAME.pointerLockEnabled=false;
  }, "TriggerBot", "Shoots your gun when automatically there is a player under your crosshair", "no keybind");
  var ESP = new client.Hack(function (this_) {
    this_.hitboxes = [];
  }, function () {
    var this_ = this;
    G.othera822ers.forEach(function (e) {
      if(e &&e.a240 && !e.hitbox) {
          var hitbox = new THREE.Mesh(new THREE.BoxGeometry,new THREE.MeshBasicMaterial({color:"red",fog:false,depthTest:false}));
          hitbox.scale.set(3,10,3);
          hitbox.renderOrder=Infinity
          hitbox.position.y++;
          this_.hitboxes.push(hitbox);
          hitbox.player=e;
          e.hitbox=hitbox;
          e.a240.add(hitbox);
      }
    });
  }, function (this_) {
    this_.hitboxes.forEach(function (e) {
      e.parent.remove(e);
      delete e.player.hitbox;
    });
    this_.hitboxes = []
  }, "ESP", "See players through walls!", ";");
  var InfoHUD = new client.Hack(function (this_){
    if(!this_.HUD) {
      this_.HUD = document.createElement("div");
      this_.HUD.style = "position: fixed; top: 2vh; right: 15vw; background-color:black; opacity: 0.7; width: 20vw"
    }
    document.body.appendChild(this_.HUD);
    this_.HUD.style.display = "block";
    this_.kills = this_.kills || 0;
    this_.old = this_.old || 0;
  }, function () {
      this.HUD.innerHTML = "Player position: X "+Math.trunc(GAME.a865.player.position.x*100)/100+" Y "+Math.trunc(GAME.a865.player.position.x*100)/100+" Z "+Math.trunc(GAME.a865.player.position.x*100)/100+"<br>Connected to: "+G.socket.url.split("/")[2]+"<br>Total kills: "+(this.kills+GAME.a865.player.a649)+"<br>"+new Date().toGMTString();
      if(GAME.a865.player.a649 == 0) {
        this.kills += this.old;
      }
      this.old = GAME.a865.player.a649;
  }, function (this_) {
      this_.HUD.style.display = "none";
  }, "InfoHUD", "Nice HUD for valuable info!", "m");
  var NoFog = new client.Hack(function (this_) {
    this_.a = GAME.a865.scene.fog.far;
    GAME.a865.scene.fog.far = Infinity;
  }, function () {

  }, function (this_) {
    GAME.a865.scene.fog.far = this_.a;
  }, "NoFog", "Get rid of the fog", "no keybind");
  var ChatSpam = new client.Hack(function () {

  }, function () {
    document.getElementById("chat").value = crypto.randomUUID();
    var e = new a201;
    e.msg = GAME.chatInput.value;
    G.socket.send(e.a614());
  }, function () {

  }, "ChatSpam", "Spam the game chat", "no keybind", false);
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
  //menu elements
  new client.MenuElement([Fly, WaterLevel, SpeedHack], "Movement", "0%", "0%");
  new client.MenuElement([RapidFire, InfAmmo, TriggerBot], "Combat", "25%", "0%");
  new client.MenuElement([ESP, InfoHUD, NoFog], "Render", "50%", "0%");
  new client.MenuElement([ChatSpam, stophacks], "Game", "75%", "0%");
  //win message
  //pc.app.on("Game:Finish", function(){if(autoGG.isEnabled){pc.app.fire("Network:Chat", autoGG.type)}; client.inGame = false; stophacks.enable();});
  function tempLoop(){
    if(window.GAME) {
      client.inGame = true;
      GAME.disconnect=function(){if(!client.menuToggled){location.reload()}};
      try {
        var obj = JSON.parse(localStorage.config);
        client.Hacks.forEach(function (hack) {
         if(hack.name in obj) {
           hack.enable();
           document.getElementById(hack.name).style.backgroundColor = "white";
         }
        });
      } catch (e) {}
      return;
    }
    setTimeout(tempLoop, 1);
  }
  tempLoop();
  //config
  localStorage.config = localStorage.config || "{\"autoGG\":true}";
  client.MAIN();
};
client.init();