// ==UserScript==
// @name         Gamer's Mod
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  This is a Mod i made For my Friends
// @author       Gamer
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383223/Gamer%27s%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/383223/Gamer%27s%20Mod.meta.js
// ==/UserScript==

//Remove Adds
document.querySelectorAll('.ad-unit').forEach(function(a) {
  a.remove();
});

// DIV STYLE
var Style1 = document.querySelectorAll('.hud-map, .hud-resources, .hud-menu-shop, .hud-menu-party, .hud-menu-settings, .hud-shop-grid .hud-shop-item, .hud-party-link, .hud-party-members, .hud-party-grid, .hud-settings-grid, .hud-toolbar-item, .hud-toolbar-building, .hud-menu-icon, .hud-spell-icon, .hud-intro-form, .hud-intro-guide, .hud-intro-name, .hud-intro-server, .hud-party-tag, .hud-party-share, .hud-chat-input');
for (var i = 0; i < Style1.length; i++) {
  Style1[i].style.borderRadius = '1em'; // standard
  Style1[i].style.MozBorderRadius = '1em'; // Mozilla
  Style1[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style1[i].style.color = "#2DD480";
  Style1[i].style.border = "2px solid #2DD480";
}

// INPUT AND SELECT STYLE
var Style2 = document.querySelectorAll('select, input');
for (var i = 0; i < Style2.length; i++) {
  Style2[i].style.borderRadius = '1em'; // standard
  Style2[i].style.MozBorderRadius = '1em'; // Mozilla
  Style2[i].style.WebkitBorderRadius = '1em'; // WebKitww
  Style2[i].style.color = "#2DD480";
  Style2[i].style.border = "2px solid #2DD480";
  Style2[i].style.backgroundColor = "#FFFFFF";
}

//The Mod
window.onload = function() {
document.getElementsByClassName('hud-intro-corner-top-left')[0].innerHTML = "<legend>By: ★彡 ѕ¢αяє∂? 彡★</legend>";
document.getElementsByClassName('hud-intro-footer')[0].remove();
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[1].innerHTML = "<h1>Gamers Mod</h1>";
document.getElementsByClassName("hud-intro-wrapper")[0].childNodes[3].innerHTML = "<h2>Mod. Upgrade. Rebel.</h2>";
document.getElementsByClassName('hud-intro-guide')[0].innerHTML = "<h1>Hope You Have a Good Time</h1>";
document.getElementById('hud-menu-party').style.width = "650px";
document.getElementById('hud-menu-party').style.height = "460px";
document.getElementsByClassName('hud-intro-form')[0].style.width = "325px";
document.getElementsByClassName('hud-intro-form')[0].style.height = "235px";
document.getElementsByClassName("hud-party-joining")[0].remove();
document.getElementsByClassName("hud-day-night-overlay")[0].remove();
document.getElementsByClassName("hud-respawn-share")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-right")[0].remove();
document.getElementsByClassName("hud-intro-corner-bottom-left")[0].remove();
document.getElementsByClassName("hud-intro-name")[0].setAttribute("maxlength", 29);
document.getElementsByClassName("hud-party-tag")[0].setAttribute("maxlength", 25);

window.Leave = function() {
Game.currentGame.network.sendRpc({ "name": "LeaveParty" })
}
window.UpgradeAll = function() {
    function UPGRADEALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "UpgradeBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }
}
window.SellAll = function() {
    function SELLALL() {
        var entities = Game.currentGame.world.entities;
        for(var uid in entities) {
            if(!entities.hasOwnProperty(uid)) continue;
            var obj = entities[uid];
            if(obj.fromTick.model !== "GoldStash") {
                Game.currentGame.network.sendRpc({
                    name: "DeleteBuilding",
                    uid: obj.fromTick.uid
                });
            }
        }
    }
}

//Settings
var Settings = '';
Settings += "<center><h2>My Scripts</h2>";
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="Leave();">Leave Party!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="UpgradeAll();">Upgrade All!</button>';
Settings += "<br><br>"
Settings += '<button class="btn btn-blue" style="width: 60%;" onclick="SellAll();">Sell All!</button>';
Settings += "<br><br>"

document.getElementsByClassName('hud-settings-grid')[0].innerHTML = Settings;

//Speed
function CARL() {
    document.getElementsByClassName("hud-shop-actions-equip")[1].click();
}
function WOODY() {
    document.getElementsByClassName("hud-shop-actions-equip")[2].click();
}
var timer = null;
function speed(e) {
    switch (e.code) {
    case "KeyV":
        if (timer === null) {
            timer = setInterval(() => {
                CARL();
                WOODY();
            }, 0);
        } else {
            clearInterval(timer);
            timer = null;
        }
        break;
    default:
        return;
    }
}
document.addEventListener("keydown", function(e) {
    speed(e);
});

//Auto Evolver
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-evolve");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Auto Reviver
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-shop-actions-revive");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Auto Respawn
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Auto Heal
(function() {
  heal = document.getElementsByClassName('hud-shop-item')[10];
  petHeal = document.getElementsByClassName('hud-shop-item')[11];
  useHeal = document.getElementsByClassName('hud-toolbar-item')[4];
  usePetHeal = document.getElementsByClassName('hud-toolbar-item')[5];
  healthBar = document.getElementsByClassName('hud-health-bar-inner')[0];
  up = new Event('mouseup');
  healLevel = 99;

  HEAL = function() {
    heal.attributes.class.value = 'hud-shop-item';
    petHeal.attributes.class.value = 'hud-shop-item';
    useHeal.dispatchEvent(up);
    usePetHeal.dispatchEvent(up);
    heal.click();
    petHeal.click();
  };

  script = function(e) {
    if (e.keyCode == 82) {
      HEAL();
    }
  };
  document.addEventListener('keydown', function(e) {
    script(e);
  });
  observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
      if (parseInt(mutations[0].target.style.width) < healLevel) {
        HEAL();
      }
    });
  });
  observer.observe(healthBar, {
    attributes: true,
    attributeFilter: ['style']
  });
})();

//Auto Respawn
setTimeout(() => {
 let elements = document.getElementsByClassName("hud-respawn-btn");
 setInterval(() => {
    for (let element of elements) {
      element.click();
    }
  }, 1);
}, 1);

//Information in Chat
class GetInfo {
        constructor() {}

        init() {
                this.SendChatMessage(("★彡 ѕ¢αяє∂? 彡★ Joined"), "Global")

                setTimeout(() => {
                        const lastMessage = this.GetLastMessage(),
                                style = document.createElement("style"),
                                disabledInfo = [
                                        "aimingYaw",
                                        "availableSkillPoints",
                                        "baseSpeed",
                                        "collisionRadius",
                                        "damage",
                                        "energy",
                                        "energyRegenerationRate",
                                        "entityClass",
                                        "experience",
                                        "firingTick",
                                        "hatName",
                                        "height",
                                        "interpolatedYaw",
                                        "isBuildingWalking",
                                        "isInvulnerable",
                                        "isPaused",
                                        "lastDamage",
                                        "lastDamageTarget",
                                        "lastDamageTick",
                                        "lastPetDamage",
                                        "lastPetDamageTarget",
                                        "lastPetDamageTick",
                                        "level",
                                        "maxEnergy",
                                        "maxHealth",
                                        "model",
                                        "msBetweenFires",
                                        "reconnectSecret",
                                        "slowed",
                                        "speedAttribute",
                                        "startChargingTick",
                                        "stunned",
                                        "weaponName",
                                        "weaponTier",
                                        "width",
                                        "yaw",
                                        "zombieShieldHealth",
                                        "zombieShieldMaxHealth"
                                ]

                        style.innerHTML = ".hud-chat .hud-chat-message { white-space: normal; } .hud-chat-messages { resize: both; }"

                        document.head.appendChild(style)

                        Game.currentGame.network.addEntityUpdateHandler(e => {
                                const entities = Game.currentGame.world.entities

                                let HTML = ""

                                Object.keys(entities).forEach((t, i) => {
                                        const entity = entities[t].fromTick

                                        if (entity.entityClass !== "PlayerEntity") return

                                        Object.keys(entity).forEach((prop, index) => {
                                                if (disabledInfo.indexOf(prop) >= 0) return

                                                if (entity[prop].x && entity[prop].y) {
                                                        HTML += `<p>${prop}: ${entity[prop].x}, ${entity[prop].y}</p>`
                                                } else {
                                                        HTML += `<p>${prop}: ${entity[prop]}</p>`
                                                }
                                        })

                                        HTML += "<hr>"
                                })

                                lastMessage.innerHTML = HTML
                        })
                }, 1000)
        }

        SendChatMessage(msg, channel) {
                Game.currentGame.network.sendRpc({
                        name: "SendChatMessage",
                        channel: channel,
                        message: msg
                })
        }

        SendFakeChatMessage(name, msg) {
                Game.currentGame.ui.getComponent("Chat").onMessageReceived({
                        displayName: name,
                        message: msg
                })
        }

        GetLastMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.pop.call(messagesArray)
        }

        GetFirstMessage() {
                const messages = document.querySelectorAll(".hud-chat-message"),
                        messagesArray = Array.prototype.slice.call(messages)

                return Array.prototype.shift.call(messagesArray)
        }
}
if (!Game.currentGame.world.inWorld) Game.currentGame.network.addEnterWorldHandler(() => new GetInfo().init())
else new GetInfo().init()

//BackGround Intro Changer
var Introleft = '';
Introleft += "<h3> Background Intro Changer!</h3>";
Introleft += "<input class='input' type='text'></input>";
Introleft += "&nbsp;";
Introleft += "<button class=\"btn btn-apply\" style=\"width: 24%;\">Apply</button>";

document.getElementsByClassName('hud-intro-left')[0].innerHTML = Introleft;

let element = document.getElementsByClassName('btn btn-apply')[0];
  element.addEventListener("click", function(e) {
           let value = document.getElementsByClassName('input')[0].value;
           let css = '<style type="text/css">.hud-intro::after { background: url('+ value +'); background-size: cover; }</style>';
   console.log("new background!")
           document.body.insertAdjacentHTML("beforeend", css);
});
var timer = null;

function speed(e) {
    switch (e.keyCode) {
        case 89:
            if (timer == null) {
                timer = setInterval(function () {
                    document.getElementsByClassName("btn btn-green hud-intro-play")[0].click();
                }, -999);
            } else {
                clearInterval(timer);
                timer = null;
            }
            break;
    }
}
setInterval(function () {
    if (document.querySelectorAll(".hud-chat .hud-chat-input:focus")[0]) {
        window.removeEventListener("keydown", speed);
    } else {
        window.addEventListener("keydown", speed);
    }
}, 0);

//Background pic
var css = ".hud-menu-settings { background: url(\'https://cdn.wallpapersafari.com/66/7/vd6sHf.jpg') }";
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = ".hud-menu-shop { background: url(\'https://cdn.wallpapersafari.com/66/7/vd6sHf.jpg') }";
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);

var css = ".hud-menu-party { background: url(\'https://cdn.wallpapersafari.com/66/7/vd6sHf.jpg') }";
var style = document.createElement('style');
style.appendChild(document.createTextNode(css));

document.head.appendChild(style);
}

const $ = function(className) {
    var elem = document.getElementsByClassName(className);
    if (elem.length > 1) return elem;
    return elem[0];
};
window.addEventListener("load", function(e) {
    var chat = $("hud-chat");
    var html = `<div class='GLB'>
                   <button style='opacity: 0; transition: opacity 0.15s ease-in-out;' class='GLBbtn'>Send it as Global message...</button>
                </div>`;
    chat.insertAdjacentHTML("afterend", html);
    var sendBtn = $("GLBbtn");
    sendBtn.addEventListener("click", function(e) {
        let msg = $("hud-chat-input").value;
        Game.currentGame.network.sendRpc({
            name: "SendChatMessage",
            channel: "Global",
            message: msg
        });
    });
    var input = document.querySelectorAll(".hud-chat")[0];
    var observer = new MutationObserver(styleChangedCallback);

    function styleChangedCallback(mutations) {
        var newIndex = mutations[0].target.className;

        if (newIndex == "hud-chat is-focused") {
            sendBtn.style.opacity = 1;
        } else {
            sendBtn.style.opacity = 0;
        }
    }
    observer.observe(input, {
        attributes: true,
        attributeFilter: ["class"]
    });
});