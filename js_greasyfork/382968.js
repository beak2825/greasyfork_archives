// ==UserScript==
// @name         UWUHAXX - Aimbot, Wallhack, Auto-Reload, Fast/slow speedhack, Time stop, Bhop, Auto Weapon-Swap
// @namespace    pornhub mods
// @version      1.2.5
// @description  AIMBOT, ESP, AUTO-RELOAD, FAST/SLOW SPEEDHACK, TIME STOP, BHOP, AUTO WEAPON-SWAP
// @author       Bee#7291 and DemidShow#2088
// @include      https://krunker.io/
// @include      https://krunker.io/?game=*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/382968/UWUHAXX%20-%20Aimbot%2C%20Wallhack%2C%20Auto-Reload%2C%20Fastslow%20speedhack%2C%20Time%20stop%2C%20Bhop%2C%20Auto%20Weapon-Swap.user.js
// @updateURL https://update.greasyfork.org/scripts/382968/UWUHAXX%20-%20Aimbot%2C%20Wallhack%2C%20Auto-Reload%2C%20Fastslow%20speedhack%2C%20Time%20stop%2C%20Bhop%2C%20Auto%20Weapon-Swap.meta.js
// ==/UserScript==


var OnOffMode;
(function (OnOffMode) {
    OnOffMode["On"] = "On";
    OnOffMode["Off"] = "Off";
})(OnOffMode || (OnOffMode = {}));
class Module {
    constructor() {
        this.allStates = this.getAllModes();
        this.currentModeIndex = this.allStates.indexOf(this.getInitialMode());
    }
    onModeChanged() {
    }
    onTick() {
    }
    getInitialMode() {
        return this.allStates[0];
    }
    onKeyPressed() {
        this.currentModeIndex++;
        if (this.currentModeIndex >= this.allStates.length) {
            this.currentModeIndex = 0;
        }
        this.onModeChanged();
    }
    isEnabled() {
        return this.currentModeIndex !== 0;
    }
    getStatus() {
        return this.allStates[this.currentModeIndex].toString();
    }
    getCurrentMode() {
        return this.allStates[this.currentModeIndex];
    }
}

var AimbotMode;
(function (AimbotMode) {
    AimbotMode["Off"] = "Off";
    AimbotMode["Quickscoper"] = "Quickscoper";
    AimbotMode["OnRMB"] = "On RMB";
})(AimbotMode || (AimbotMode = {}));
class Aimbot extends Module {
    constructor() {
        super(...arguments);
        this.scopingOut = false;
        this.canShoot = true;
    }
    getName() {
        return 'Aimbot';
    }
    getKey() {
        return 'T';
    }
    getAllModes() {
	    return [AimbotMode.Off, AimbotMode.Quickscoper, AimbotMode.OnRMB, AimbotMode.AutoShoot];
    }
    onTick() {
        if (!this.players) {
            return;
        }
        const possibleTargets = this.players
            .filter(player => {
            return player.active && player.inView && !player.isYou && (!player.team || player.team !== this.me.team);
        })
            .sort((p1, p2) => this.distance(this.me, p1) - this.distance(this.me, p2));
        let isLockedOn = false;
        if (possibleTargets.length > 0) {
            const target = possibleTargets[0];
            switch (this.getCurrentMode()) {
                case AimbotMode.Quickscoper:
                    isLockedOn = this.runQuickscoper(target);
                    break;
                case AimbotMode.OnRMB:
                    isLockedOn = this.runOnRMB(target);
                    break;
            }
        }
        if (!isLockedOn) {
            this.control.camLookAt(null);
            this.control.target = null;
            if (this.getCurrentMode() === AimbotMode.Quickscoper) {
                this.control.mouseDownL = 0;
                this.control.mouseDownR = 0;
            }
        }
    }
    runQuickscoper(target) {
        if (this.me.didShoot) {
            this.canShoot = false;
            setTimeout(() => {
                this.canShoot = true;
            }, this.me.weapon.rate);
        }
        if (this.control.mouseDownL === 1) {
            this.control.mouseDownL = 0;
            this.control.mouseDownR = 0;
            this.scopingOut = true;
        }
        if (this.me.aimVal === 1) {
            this.scopingOut = false;
        }
        if (this.scopingOut || !this.canShoot || this.me.recoilForce > 0.01) {
            return false;
        }
        this.lookAt(target);
        if (this.control.mouseDownR === 0) {
            this.control.mouseDownR = 1;
        }
        else if (this.me.aimVal < 0.2) {
            this.control.mouseDownL = 1 - this.control.mouseDownL;
        }
        return true;
    }
    runOnRMB(target) {
        if (this.control.mouseDownR === 0) {
            return false;
        }
        this.lookAt(target);
        return true;
    }
    lookAt(target) {
        this.control.camLookAt(target.x2, target.y2 + target.height - 1.5 - 2.5 * target.crouchVal - this.me.recoilAnimY * 0.3 * 25, target.z2);
    }
    distance(player1, player2) {
        const dx = player1.x - player2.x;
        const dy = player1.y - player2.y;
        const dz = player1.z - player2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

var Bhop;
(function (Bhop) {
    Bhop["Off"] = "Off";
    Bhop["Jump"] = "Jump";
    Bhop["SlideJump"] = "Slide Jump";
})(Bhop || (Bhop = {}));
class AutoBHop extends Module {
    constructor() {
        super(...arguments);
        this.isSliding = false;
    }
    getName() {
        return 'Bhop';
    }
    getKey() {
        return 'B';
    }
    getAllModes() {
        return [Bhop.Off, Bhop.Jump, Bhop.SlideJump, Bhop.SlideAnti];
    }
    onTick() {
        this.control.keys[32] = !this.control.keys[32];
        if (this.getCurrentMode() === Bhop.SlideJump) {
            if (this.isSliding) {
                this.inputs[8] = 1;
                return;
            }
            if (this.me.yVel < -0.04 && this.me.canSlide) {
                this.isSliding = true;
                setTimeout(() => {
                    this.isSliding = false;
                }, 350);
                this.inputs[8] = 1;
            }
        }
    }
}

class AutoWeaponSwap extends Module {
    getName() {
        return 'Auto-WS';
    }
    getKey() {
        return 'G';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
if (this.me.ammos[this.me.weaponIndex] === 0 && this.me.ammos[0] != this.me.ammos[1]) {
            this.inputs[10] = -1
        }
    }
}

class AutoReload extends Module {
    getName() {
        return 'Auto-Reload';
    }
    getKey() {
        return 'H';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.On;
    }
    onTick() {
      if (this.me.ammos[this.me.weaponIndex] === 0) {
            this.inputs[9] = 1;
        }
    }
}


class FasterSpeedHack extends Module {
    getName() {
        return 'Faster Speedhack';
    }
    getKey() {
        return 'M';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
this.inputs[1] *= 2.000;
    }
}

class FastSpeedHack extends Module {
    getName() {
        return 'Fast Speedhack';
    }
    getKey() {
        return 'U';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
        this.inputs[1] *= 1.275;
    }
}

class SlowSpeedHack extends Module {
    getName() {
        return 'SlowSpeedhack';
    }
    getKey() {
        return 'I';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
this.inputs[1] *= 1.133;
    }
}

class Timestop extends Module {
    getName() {
        return 'ZA WARUDO';
    }
    getKey() {
        return 'N';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        return OnOffMode.Off;
    }
    onTick() {
        this.inputs[1] *= 0;
    }


    //epic sound effect copyrkt by Anoh4xer https://www.youtube.com/channel/UC0-d0_6kPIKjJwJOQlaRZ7w
    onModeChanged() {
        if (this.getCurrentMode() === OnOffMode.On) {
            new Audio("https://www.myinstants.com/media/sounds/za-warudo-stop-time-sound.mp3").play();

        }
    }
}

class WallHack extends Module {
    getName() {
        return 'Wallhack';
    }
    getKey() {
        return 'L';
    }
    getAllModes() {
        return [OnOffMode.Off, OnOffMode.On];
    }
    getInitialMode() {
        unsafeWindow.wallHackEnabled = true;
        return OnOffMode.On;
    }
    onModeChanged() {
        unsafeWindow.wallHackEnabled = this.getCurrentMode() === OnOffMode.On;
    }
}

class KC {
    constructor() {
        this.modules = [];
    }
    init() {
        this.modules.push(new Aimbot());
        this.modules.push(new AutoReload());
        this.modules.push(new AutoWeaponSwap());
        this.modules.push(new FasterSpeedHack());
        this.modules.push(new FastSpeedHack());
        this.modules.push(new SlowSpeedHack());
        this.modules.push(new Timestop());
        this.modules.push(new WallHack());
        this.modules.push(new AutoBHop());
        const initInfoBoxInterval = setInterval(() => {
            if (this.canInjectInfoBox()) {
                clearInterval(initInfoBoxInterval);
                this.injectInfoBox();
                this.updateInfoBox();
            }
        }, 100);
    }
    onTick(me, inputs) {
        this.modules.forEach(module => {
            if (module.isEnabled()) {
                module.me = me;
                module.inputs = inputs;
                module.control = unsafeWindow.control;
                module.players = unsafeWindow.players;
                module.onTick();
            }
        });
    }
    onKeyPressed(e) {
        let shouldUpdateInfoBox = false;
        this.modules.forEach(module => {
            if (module.getKey().toUpperCase() === e.key.toUpperCase()) {
                module.onKeyPressed();
                shouldUpdateInfoBox = true;
            }
        });
        if (shouldUpdateInfoBox) {
            this.updateInfoBox();
        }
    }
    updateInfoBox() {
        const infoBox = unsafeWindow.document.querySelector('#KCInfoBox');
        if (infoBox === null) {
            return;
        }
        const moduleLines = this.modules.map(module => {
            return `
        <div class="leaderItem">
          <div class="leaderNameF">[${module.getKey().toUpperCase()}] ${module.getName()}</div>
          <div class="leaderScore">${module.getStatus()}</div>
        </div>
      `;
        });
        infoBox.innerHTML = `
      <div class="KCTitle">UWUHAXX</div>
      ${moduleLines.join('')}
    `.trim();
    }
    injectInfoBox() {
        const infoBox = unsafeWindow.document.createElement('div');
        infoBox.innerHTML = `
      <div>
        <style>
          #KCInfoBox {
            text-align: center;
            width: 220px;
            z-index: 3;
            padding: 10px;
            padding-left: 20px;
            padding-right: 20px;
            color: rgba(255, 255, 255, 0.7);
            line-height: 25px;
            margin-top: 20px;
            background-color: rgba(26, 26, 26);
          }

          #KCInfoBox .KCTitle {
            font-size: 19px;
            font-weight: bold;
            text-align: center;
            color: #fff;
            margin-top: 5px;
            margin-bottom: 5px;
          }

          #KCInfoBox .leaderItem {
           font-size: 14px;
          }
        </style>

        <div id="KCInfoBox"></div>
      </div>
    `.trim();
        const leaderDisplay = unsafeWindow.document.querySelector('#leaderDisplay');
        leaderDisplay.parentNode.insertBefore(infoBox.firstChild, leaderDisplay.nextSibling);
    }
    canInjectInfoBox() {
        return unsafeWindow.document.querySelector('#leaderDisplay') !== null;
    }
}

// tslint:disable no-console
class Logger {
    constructor(prefix) {
        this.prefix = prefix;
    }
    log(...message) {
        console.log(this.prefix, ...message);
    }
    error(...message) {
        console.error(this.prefix, ...message);
    }
    crash(message) {
        document.open();
        document.write(`
      <html lang="en">
        <head>
          <title>KC has crashed!</title>

          <style>
            .container {
              position: absolute;
              top: 50%;
              left: 50%;
              -moz-transform: translateX(-50%) translateY(-50%);
              -webkit-transform: translateX(-50%) translateY(-50%);
              transform: translateX(-50%) translateY(-50%);
              text-align: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';
            }

            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }

            .message {
              font-size: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="title">KC has crashed!</div>
            <div class="message">Error message: ${message}</div>
          </div>
        </body>
      </html>
    `);
        document.close();
        throw new Error(`${this.prefix} ${message}`);
    }
}
const logger = new Logger('[KC]');

function applyPatch(script, method, regex, replacer) {
    const newScript = script.replace(regex, replacer);
    if (script === newScript) {
        logger.crash(`${method} was not successful`);
    }
    return newScript;
}
function patchControl(script) {
    return applyPatch(script, 'patchControl', /var ([a-zA-Z0-9]+)=this,([a-zA-Z0-9]+)=([a-zA-Z0-9]+)\.renderer\.domElement/, ($0, $1, $2, $3) => {
        return `var ${$1} = window.control = this, ${$2} = ${$3}.renderer.domElement;`;
    });
}
function patchPlayers(script) {
    return applyPatch(script, 'patchPlayers', /if\(this\.now/, 'window.players = this.players.list; if (this.now');
}
function patchOnTick(script) {
    return applyPatch(script, 'patchOnTick', /,([a-zA-Z0-9]+)\.procInputs\(([a-zA-Z0-9]+)/, ($0, $1, $2) => {
        return `, window.onTick(${$1}, ${$2}), ${$1}.procInputs(${$2}`;
    });
}
function patchOnKeyPressed(script) {
    return applyPatch(script, 'patchOnKeyPressed', /"keyup",function\(([a-zA-Z0-9]+)\){/, ($0, $1) => {
        return `"keyup", function (${$1}) { if (document.activeElement !== chatInput) { window.onKeyPressed(${$1}); }`;
    });
}
function patchForAimbot(script) {
    return applyPatch(script, 'patchForAimbot', /{if\(this\.target\){(.+)}},this.camLookAt=/, ($0, $1) => {
        return `
      {
        if (this.target) {
          this.object.rotation.y = this.target.yD;
          this.pitchObject.rotation.x = this.target.xD;

          const half = Math.PI / 2;
          this.pitchObject.rotation.x = Math.max(-half, Math.min(half, this.pitchObject.rotation.x));

          this.yDr = this.pitchObject.rotation.x % Math.PI;
          this.xDr = this.object.rotation.y % Math.PI;

          ${$1}
        }
      }, this.camLookAt =
    `;
    });
}
function patchForWallHack(script) {
    return applyPatch(script, 'patchForWallHack', /if\(([a-zA-Z0-9]+)\.inView\){(.+)}else ([a-zA-Z0-9]+)\.style\.display="none"}var ([a-zA-Z0-9]+);/, ($0, $1, $2, $3, $4) => {
        return `
      if (${$1}.inView || window.wallHackEnabled) {
        ${$2}
      } else ${$3}.style.display = "none"
      } var ${$4};
    `;
    });
}
function patchIsHacker(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9]+)\.isHacker&&/, `&& 1 === 0 &&`);
}
function patchLastHack(script) {
    return applyPatch(script, 'patchIsHacker', /&&([a-zA-Z0-9]+)\.lastHack&&/, `&& 1 === 0 &&`);
}
/*
function patchServerSearch(script) {
    return applyPatch(script, 'patchServerSearch', /([a-zA-Z0-9]+)\.data\.([a-zA-Z0-9]+)\.toLowerCase/, ($0, $1, $2) => {
        return `(${$1}.data.${$2} || '').toLowerCase`;
    });
}
*/
function patchStyleErrors(script) {
    return applyPatch(script, 'patchStyleErrors', /else document\.getElementById\("healthBarE"\+([a-zA-Z0-9]+)\)\.style\.width=([a-zA-Z0-9]+)\+"%"/, ($0, $1, $2) => {
        return `else (document.getElementById("healthBarE" + ${$1}) || { style: {} }).style.width = ${$2} + "%"`;
    });
}
function patchGameScript(script) {
    logger.log('Patching the game script...');
    script = patchControl(script);
    script = patchPlayers(script);
    script = patchOnTick(script);
    script = patchOnKeyPressed(script);
    script = patchForAimbot(script);
    script = patchForWallHack(script);
    script = patchIsHacker(script);
    script = patchLastHack(script);
    // script = patchServerSearch(script);
    script = patchStyleErrors(script);
    logger.log('Successfully patched the game script!');
    return script;
}

function request(url) {
    return new Promise(resolve => {
        logger.log(`Retrieving ${url}`);
        GM_xmlhttpRequest({
            url,
            method: 'GET',
            onload: response => resolve(response.responseText),
        });
    });
}

function replaceRemoteScriptWithInline(html, partialSrc, script) {
    const inline = `<script type="text/javascript">${script}</script>`;
    const regExp = new RegExp(`<script src="[^"]*${partialSrc}[^"]*"></script>`);
    const withoutScriptTag = html.replace(regExp, '');
    return withoutScriptTag + inline;
}
async function inlineRemoteScript(html, partialSrc) {
    const regExp = new RegExp(`<script src="([^"]*)${partialSrc}([^"]*)"></script>`);
    const [, prefix, suffix] = regExp.exec(html);
    const script = await request(prefix + partialSrc + suffix);
    return replaceRemoteScriptWithInline(html, partialSrc, script);
}
(async () => {
    if (unsafeWindow.navigator.userAgent.includes('Firefox')) {
        alert('KC does not work on Firefox.');
        return;
    }
    window.stop();
    logger.log('Loading KC...');
    let newHtml = await request(document.location.href);
    const gameScriptHash = /game\.([^\.]+)\.js/.exec(newHtml)[1];
    const gameScript = await request(`https://krunker.io/js/game.${gameScriptHash}.js`);
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip.js');
    newHtml = await inlineRemoteScript(newHtml, 'libs/zip-ext.js');
    newHtml = replaceRemoteScriptWithInline(newHtml, 'js/game', patchGameScript(gameScript));
    const bot = new KC();
    bot.init();
    unsafeWindow.onTick = (me, inputs) => bot.onTick(me, inputs);
    unsafeWindow.onKeyPressed = (e) => bot.onKeyPressed(e);
    document.open();
    document.write(newHtml);
    document.close();
    logger.log('Successfully loaded UWUHAXX!');
})();

 var checkgameloaded;

  window.WebSocket.prototype.oldSend = WebSocket.prototype.send;
  window.WebSocket.prototype.send = function(m){
        if (!checkgameloaded){
          activatehack(this);
        }
        this.oldSend(m);
  }

window.stop();
document.innerHTML = ``;

window.gameCode = "";
window.zip = "";
window.zipExt = "";


window.chatmessage = window.Ze = (t, e, i) => {
        for (chatList.innerHTML += i ? "<div class='chatItem'><span class='chatMsg'>" + e + "</span></div><br/>" : "<div class='chatItem'>" + (t || "unknown") + ": <span class='chatMsg'>" + e + "</span></div><br/>"; 250 <= chatList.scrollHeight;) chatList.removeChild(chatList.childNodes[0])
    }

  function activatehack(socket){
    window.socket = socket;
    checkgameloaded = socket;

  }

setTimeout( () => {
    pending = true;
}, 5000);