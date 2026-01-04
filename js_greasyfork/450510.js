// ==UserScript==
// @name         Alts
// @namespace    By Havy me fix
// @version      0.5
// @description  Let build base
// @author       You
// @match        Zombs.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450510/Alts.user.js
// @updateURL https://update.greasyfork.org/scripts/450510/Alts.meta.js
// ==/UserScript==

    document.querySelector('#hud').insertAdjacentHTML('beforeend', `
<div class="hud-menu-iframe">
<button class="alts-btn alts-white" id="sendalt">Send Alt</button>
<button class="alts-btn alts-white" id="delalt">Delete Alt</button>
<input class="alts-textbox" id="delid" style="width: 10%" placeholder="Alt's Id">
<button class="alts-btn alts-white" id="delallalt">Delete All Alt</button>
<button class="alts-btn alts-white" id="altmove">Stay</button>
</div>

<style>
.hud-menu-iframe{
text-align: center;
display: none;
position: fixed;
padding: 20px 0px;
top: 48%;
left: 50%;
width: 600px;
height: 400px;
transform: translate(-50%, -52%);
background: rgba(0, 0, 0, 0.6);
color: #eee;
z-index: 20;
}
.hud-menu-icons .hud-menu-icon[data-type=Iframe]::before {
background-image: url("https://media.discordapp.net/attachments/870020008128958525/876133010360107048/unknown.png");
background-size: 30px;
}
</style>
`)

    let mm = document.getElementsByClassName("hud-menu-iframe")[0];
    function iframeMenu() {
        if(["none", ""].includes(mm.style.display)) {
            mm.style.display = "block";
            for(let i of Array.from(document.getElementsByClassName("hud-menu"))) {
                if(i.classList.contains('hud-menu-iframe')) { return; };
                i.style.display = "none";
            };
        } else {
            mm.style.display = "none";
        };
    };

    document.getElementsByClassName("hud-menu-icons")[0].insertAdjacentHTML("beforeend", `<div class="hud-menu-icon" data-type="Iframe"></div>`);
    document.querySelectorAll(".hud-menu-icon")[3].addEventListener("click", iframeMenu)
    document.getElementsByClassName("hud-menu-iframe")[0].style.overflow = "auto";


    for (let i of Array.from(document.querySelector("#hud").childNodes)) {
        if (i.className != "hud-menu-iframe" && i.className != "hud-center-right" && i.className != "hud-center-left") {
            i.addEventListener('click', function() {
                if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
                    document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
                };
            });
        };
    };

    for (let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
        if (i.dataset.type !== "Iframe") {
            i.addEventListener('click', function() {
                if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
                    document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
                };
            });
        };
    };

    for (let i of Array.from(document.getElementsByClassName("hud-spell-icon"))) {
        if (i.dataset.type !== "HealTowersSpell" && i.dataset.type !== "TimeoutItem") {
            i.addEventListener('click', function() {
                if (document.getElementsByClassName("hud-menu-iframe")[0].style.display == "block") {
                    document.getElementsByClassName("hud-menu-iframe")[0].style.display = "none";
                };
            });
        };
    };

    document.addEventListener("keyup", e => {
        if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
            if (e.key === "o" || e.key === "p" || e.key === "b" || e.key === "/" || e.keyCode == 27) {
                if (mm.style.display == "block") {
                    mm.style.display = "none";
                }
            }
        }
    })

    let IframesCount = 0;
    let NearestToCursor;
    document.getElementById('sendalt').addEventListener('click', function(){
        let iframe = document.createElement('iframe');
        IframesCount++;
        iframe.id = "iframeId" + IframesCount;
        iframe.className = "iframeAlts";
        iframe.src = `http://zombs.io/#/${game.options.serverId}/${game.ui.playerPartyShareKey}/${iframe.id}/noscript`;

        iframe.addEventListener('load', function(e) {
            iframe.contentWindow.eval(`
          window.nearestToCursor = false;
          let iframeId = location.hash.split("/")[3];

          document.querySelectorAll("#stats, #hud-intro > div > h2, #hud-intro > div > h1, .hud-menu-settings, .hud-menu-shop, .hud-building-overlay, .hud-menu-party, .hud-day-night-overlay, .hud-announcement-overlay, .hud-popup-overlay, .hud-pip-overlay, .hud-buff-bar, .hud-center-right, .hud-center-left, .hud-bottom-right, .hud-bottom-center, .hud-bottom-left, .hud-top-right, .hud-top-center, .hud-top-left, .hud-reconnect, .hud-respawn, .hud-debug, .hud-preroll-ad, .hud-intro-corner-top-left, .hud-intro-corner-top-right, .hud-intro-corner-bottom-left, .hud-intro-corner-bottom-right, .hud-intro-footer, .hud-intro-tree, .hud-intro-stone, .ad-unit-leaderboard.ad-unit-leaderboard-atf, .hud-intro-left, .hud-intro-guide").forEach(e => e.remove());
          game.renderer.scene.setVisible(false)
          document.getElementsByClassName("hud-intro-play")[0].click();
game.renderer.ground.setVisible(false)
game.renderer.scenery.setVisible(false)
game.renderer.projectiles.setVisible(false)
          var joinedGameCheck = setTimeout(function(){
            if (document.getElementsByClassName('hud-intro-error')[0].innerHTML !== "" && !game.world.inWorld) {
              parent.game.ui.getComponent('PopupOverlay').showHint(document.getElementsByClassName('hud-intro-error')[0].innerHTML, 6000);
              parent.IframesCount--;
              parent.document.getElementById(iframeId).remove();
            }
          }, 2000)

          game.network.addEnterWorldHandler(function(e) {
                clearTimeout(joinedGameCheck);
          })

          function MoveAltTo(position){
            let x = Math.round(position.x);
            let y = Math.round(position.y);

            if (game.ui.playerTick.position.y-y > 100) {
              game.network.sendInput({down: 0})
            } else {
              game.network.sendInput({down: 1})
            }
            if (-game.ui.playerTick.position.y+y > 100) {
               game.network.sendInput({up: 0})
            } else {
               game.network.sendInput({up: 1})
            }
            if (-game.ui.playerTick.position.x+x > 100) {
               game.network.sendInput({left: 0})
            } else {
               game.network.sendInput({left: 1})
            }
            if (game.ui.playerTick.position.x-x > 100) {
               game.network.sendInput({right: 0})
            } else {
               game.network.sendInput({right: 1})
            }
          }

          game.network.addEntityUpdateHandler(() => {
            if (game.ui.playerTick){
              switch (parent.document.getElementById('altmove').innerText){
                case "Follow Player":
                  MoveAltTo(parent.game.ui.playerTick.position);
                  break;
                case "Follow Cursor":
                  MoveAltTo(parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y));
                  break;
                case "Stay":
                  game.network.sendInput({left: 0});
                  game.network.sendInput({right: 0});
                  game.network.sendInput({up: 0});
                  game.network.sendInput({down: 0});
                  break;
                case "Move Exactly":
                  if(parent.document.getElementById('hud-chat').className.includes('is-focus')) break;
                  let xyVel = {x: 0, y: 0};
                  if (parent.game.inputManager.keysDown[87]) xyVel.y++; // w
                  if (parent.game.inputManager.keysDown[65]) xyVel.x--; // a
                  if (parent.game.inputManager.keysDown[83]) xyVel.y--; // s
                  if (parent.game.inputManager.keysDown[68]) xyVel.x++; // d
                  game.network.sendInput({up: xyVel.y > 0 ? 1 : 0});
                  game.network.sendInput({left: xyVel.x < 0 ? 1 : 0});
                  game.network.sendInput({down: xyVel.y < 0 ? 1 : 0});
                  game.network.sendInput({right: xyVel.x > 0 ? 1 : 0});
                  break;
              }

              //Aim
              let worldMousePos = parent.game.renderer.screenToWorld(parent.game.ui.mousePosition.x, parent.game.ui.mousePosition.y);
              if (parent.game.inputManager.mouseDown) {
                game.network.sendInput({mouseDown: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }
              if (!parent.game.inputManager.mouseDown) {
                if (!window.nearestToCursor && parent.game.inputManager.keysDown[73]) game.network.sendInput({mouseUp: 0});
                game.network.sendInput({mouseMoved: game.inputPacketCreator.screenToYaw((-game.ui.playerTick.position.x + worldMousePos.x)*100, (-game.ui.playerTick.position.y + worldMousePos.y)*100)});
              }

              if(!parent.game.inputManager.mouseDown){
                if (window.nearestToCursor && parent.game.inputManager.keysDown[73]) {
                  game.network.sendRpc({name: "JoinPartyByShareKey",partyShareKey: parent.document.getElementById('AltHitInput').value});
                  game.network.sendInput({mouseDown: 0});
                }
                if(parent.game.inputManager.keysDown[73] && game.ui.playerPartyShareKey === parent.document.getElementById('AltHitInput').value){
                  game.network.sendRpc({ name: "LeaveParty"})
                  game.network.sendInput({mouseUp: 0});
                }
                else{
                  game.network.sendInput({mouseUp: 0});
                }
              }
              game.network.addRpcHandler("Dead", function(e) {
                game.network.sendPacket(3, { respawn: 1 })
              })

              if(parent.game.inputManager.keysDown[76]) game.network.sendRpc({ name: "LeaveParty"})
            }
          })
          function GetDistanceToCursor(cursorPos){
            let pos = game.ui.playerTick.position;
            let xDistance = Math.abs(pos.x - cursorPos.x);;
            let yDistance = Math.abs(pos.y - cursorPos.y);
            return Math.sqrt((xDistance * xDistance) + (yDistance * yDistance));
          }
        `);
        })
        iframe.style.display = 'none';
        document.body.append(iframe);
    })

    let AltMoveClicks = 0;
    var AltMoveStyle = "Stay";
    document.getElementById('altmove').addEventListener('click', function(){
        let moveOrder = ["Stay", "Follow Cursor", "Follow Player", "Move Exactly"];
        AltMoveClicks++;
        AltMoveStyle = moveOrder[AltMoveClicks % 4]
        document.getElementById('altmove').innerText = AltMoveStyle;
    })

    document.getElementById('delallalt').addEventListener('click', function(){
        let deleteAltLoop = setInterval(function(){
            if (document.getElementsByClassName('iframeAlts').length > 0){
                for(let iframe of document.getElementsByClassName('iframeAlts')){
                    iframe.remove();
                }
            }
            else{
                clearInterval(deleteAltLoop);
            }
        })
        })

    var nearestToCursorIframeId;
    setInterval(() => {
        let nearestIframeDistance = 9999999999999999;
        for(let iframe of document.getElementsByClassName('iframeAlts')){
            if (typeof(iframe.contentWindow.nearestToCursor) === 'undefined') continue;
            iframe.contentWindow.nearestToCursor = false;
            let mousePosition = game.renderer.screenToWorld(game.ui.mousePosition.x, game.ui.mousePosition.y);
            let distance = iframe.contentWindow.GetDistanceToCursor(mousePosition);
            if(distance < nearestIframeDistance){
                nearestIframeDistance = distance;
                nearestToCursorIframeId = iframe.id;
            }
        }
        if (document.getElementById(nearestToCursorIframeId)) {
            let iframeWindow = document.getElementById(nearestToCursorIframeId).contentWindow;
            if (typeof(iframeWindow.nearestToCursor) === 'boolean'){
                iframeWindow.nearestToCursor = true;
            }
        }
    },100)