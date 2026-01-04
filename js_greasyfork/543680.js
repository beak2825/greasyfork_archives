// ==UserScript==
// @name        bloxd.io hack menu
// @namespace   KOPDbI
// @match       https://*.bloxd.io/*
// @grant       none
// @version     0.3.0
// @author      Developed by floppa
// @description killaura and more
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543680/bloxdio%20hack%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/543680/bloxdio%20hack%20menu.meta.js
// ==/UserScript==
//
// ⚠️⚠️ALWAYS USE ALTS⚠️⚠️
//
//(() => {

//__START__SETTINGS______________________________________________

const defaultColor = "#7e7e7eff" //-------------------ACCENT COLOR

const defaultBackGroundColor = "#007427ff" //---------Bacground color

const ICON_URL = "https://pngimg.com/d/watermelon_PNG232.png"

const defaultBackGroundTransparency = 0.4 //--------Background transparency

const defaultBackGroundBlur = 4 //------------------Background blur

let openKey = "r"; //-------------------------------DEFAULT OPEN CLOSE KEYBIND 💗

const TITLE = "Midnight__" //-----------------------Title

const defaultGradient = `linear-gradient(to right, ${defaultColor}, #001E55, #000000)`;
//--------------------------------------------------Three color gradient

const changeHealthBar = true // --------------------Change health bar color to gradient color
const spoofRanksEnabled = true; // -----------------Gives you all ranks (YT, Super, Developer)
const ATTACK_INTERVAL_MS = 100; // -----------------How fast to hit players with triggerbot/killAura    LOW = BAN
let desiredPotionSlot = 1 //------------------------What slot should potions go to? Numbers start at zero! 0-9
let spikeSlot = 8 //--------------------------------What slot do spikes automatically go in? 0-9
let webSlot = 9 //----------------------------------What slot do webs / nets automatically go in? 0-9


const keybindActions = [{ //-------------------------CHANGE KEYBINDS HERE 💗
        name: "triggerBot",
        type: "keyboard",
        code: "KeyJ",
        action: toggleTriggerBot
    },
    {
        name: "teleport",
        type: "mouse",
        code: 4,
        action: clickTeleportButton
    },
    {
        name: "autoSW",
        type: "keyboard",
        code: "KeyF",
        action: autoSW
    },
    {
        name: "toggleHitBoxes",
        type: "keyboard",
        code: null,
        action: toggleHitBoxes
    },
    {
        name: "toggleWireframe",
        type: "keyboard",
        code: null,
        action: toggleWireframe
    },
    {
        name: "toggleESP",
        type: "keyboard",
        code: null,
        action: toggleESP
    },
    {
        name: "toggleBHOP",
        type: "keyboard",
        code: null,
        action: toggleBHOP
    },
    {
        name: "toggleBlinkWrapper",
        type: "keyboard",
        code: null,
        action: toggleBlinkWrapper
    },
    {
        name: "toggleChestESP",
        type: "keyboard",
        code: null,
        action: toggleChestESP
    },
    {
        name: "toggleOreESP",
        type: "keyboard",
        code: null,
        action: toggleOreESP
    },
    {
        name: "toggleNameTags",
        type: "keyboard",
        code: null,
        action: toggleNameTags
    },
    {
        name: "toggleKillAura",
        type: "keyboard",
        code: null,
        action: toggleKillAura
    },
    {
        name: "toggleSkybox",
        type: "keyboard",
        code: null,
        action: toggleSkybox
    },
    {
        name: "toggleWallJumpScript",
        type: "keyboard",
        code: null,
        action: toggleWallJumpScript
    },
    {
        name: "toggleLockPlayerWaterState",
        type: "keyboard",
        code: null,
        action: toggleLockPlayerWaterState
    },
    {
        name: "togglePickupReach",
        type: "keyboard",
        code: null,
        action: togglePickupReach
    },
];
//__END__SETTINGS______________________________________________

/*	const minimalMouseEvent = {
		button: 2,
		buttons: 2,
		clientX: 315,
		clientY: 177,
		screenX: 315,
		screenY: 316,
		target: document.querySelector('#noa-container'),
		type: "mousedown",
		isTrusted: true,
		view: window,
		bubbles: true,
		cancelable: true,
	};*/

// Credits to wang for the blinksState
// Thanks for helping me with a lot of stuff.
// (It is broken because of me not him)

let blinkState = {
    enabled: false,
    originalSendBytes: null,
    queued: [],
    interval: 0,
    noPacket: false
};

let injectedBool = false;
let chunkDataField = null;
let isInitializing = true;
let wallJumpInterval = null;
let wallJumpRunning = false;
let lockPlayerWaterStateInterval = null;
let waterJumpingEnabled = false
const scannedChunks = new Set();
let killAuraEnabled = false
let myId = 1
let killAuraIntervalId = null
let lastClosestId = null
let newBox = null;
let newBoxId = null;
let __nullKey = null; //Entity enabled key
let __stringKey = null; //Entity ID key "Then why didn't you just label them that?"
let humanoidMeshlist = null;
let animationFrameId = null;
let clientOptions = null;
let noa = null;
let shideFuxny = {};
let noaParent = null;
let noaKeyInParent = null;
let hitBoxEnabled = false;
let wireFramesBool = false;
let espEnabled = false;
let intervalId = null;
let alreadyScaled = new WeakSet();
let isSkyboxHidden = false;
let triggerBotEnabled = false;
let autoAttackInterval = null;
const hitboxes = {};

const possibleNames = [
    //"LegLeftMesh",
    //"LegRightMesh",
    //"TorsoNode",
    //"ArmLeftMesh",
    //"ArmRightMesh",
    "BodyMesh",
    'Body|Armour',
    //"HeadMesh"
]; // Potential detection: If the player has leg armour there is no way leftLegMesh could have been hit.

let cachedNameTagParent = null;
let cachedBHOPParent = null;
let autoPotionEnabled = false;
let autoPotionInterval = null;
let nameTagsEnabled = false;
let nameTagsIntervalId = null;
let nameTagParent = null;
let bhopEnabled = false;
let bhopIntervalId = null;
let playerKey = null;
let moveState = null;
let physState = null;
let pickupReachEnabled = false; //Credits to wang!!!!
let originalGetEntitiesInAABB = null;
let proto = null;
let ghMethodKey = null;
let enemyHealthGuiEnabled = false;
let healthWatcherInterval = null;
let lastPercent = null;
let lastChangeTime = Date.now();
let resetTimeout = null;
let eIdKey = null;
// Hi BloxdDevs! It is my pleasure.
let targetEntity = null;
let targetEntityDistance = null;
const RANGE_MULTIPLIER = 5;
let bhopKnifeEnabled = false;
let spaceVid;
let fadeVolumeInterval;
let spaceHeld = false;
let bigHeadsEnabled = false;


let alreadyConnected = null;

////////////////////////////////////////////////////////////////////////////////////////Main Functions

var r = { //WANG
    keys(e) {
        var t = [],
            o = 0;
        for (var s in e) e != null && (t[o] = s, o++);
        return t
    },
    values(e) {
        for (var t = this.keys(e), o = [], s = 0, i = 0; s < t.length;) {
            var l = t[s],
                d = e[l];
            o[i] = d, i++, s++
        }
        return o
    },
    assign(e, ...t) {
        let o = Object(e);
        for (let s = 0; s < t.length; s++) {
            let i = t[s];
            if (i != null)
                for (let l in i) o[l] = i[l]
        }
        return o
    }
};


function fadeVolume(from, to, duration) {
  const steps = 30;
  const stepTime = duration / steps;
  let current = 0;

  if (fadeVolumeInterval) clearInterval(fadeVolumeInterval);

  fadeVolumeInterval = setInterval(() => {
    current++;
    const progress = current / steps;
    spaceVid.volume = from + (to - from) * progress;

    if (current >= steps) {
      clearInterval(fadeVolumeInterval);
      fadeVolumeInterval = null;
    }
  }, stepTime * 1000);
}

function onKeyDown(e) {
  if (e.code === 'Space' && !spaceHeld) {
    spaceHeld = true;
    spaceVid.style.opacity = '1';
    spaceVid.play();
    fadeVolume(spaceVid.volume, 0.1, 2.5); // fade in to 0.8 over 2 seconds
  }
}


function onKeyUp(e) {
  if (e.code === 'Space') {
    spaceHeld = false;
    spaceVid.style.opacity = '0';
    fadeVolume(spaceVid.volume, 0.1, 2.5); //
    setTimeout(() => {
      if (!spaceHeld) spaceVid.pause();
    }, 500);
  }
}

function toggleBhopKnife() {
	    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
  if (!bhopKnifeEnabled) {
    // Enable
    bhopKnifeEnabled = true;

    spaceVid = document.createElement('video');
    spaceVid.src = 'https://files.catbox.moe/6tm4e7.webm';
    spaceVid.preload = 'auto';
    spaceVid.loop = true;
    spaceVid.muted = false;
    spaceVid.volume = 0;
    spaceVid.playbackRate = 1;
    spaceVid.playsInline = true;

    Object.assign(spaceVid.style, {
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%) scaleX(1.4)', // Stretch only width
      zIndex: 21,
      pointerEvents: 'none',
      opacity: '0',
      transition: 'opacity 2.5s ease',
    });

    document.body.appendChild(spaceVid);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);

  } else {
    // Disable
    bhopKnifeEnabled = false;

    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);

    if (spaceVid) {
      spaceVid.pause();
      if (spaceVid.parentNode) spaceVid.parentNode.removeChild(spaceVid);
      spaceVid = null;
    }

    spaceHeld = false;
    if (fadeVolumeInterval) clearInterval(fadeVolumeInterval);
  }
  updateKnifeButton();
}


function matchesAllPatterns(fn) {
    const patterns = ["this.names.position", ".base[0]"].map(p => p.replace(/\s+/g, ''));
    try {
        const src = fn.toString().replace(/\s+/g, '');
        return patterns.every(p => src.includes(p));
    } catch {
        return false;
    }
}

function findClassConstructor(obj) {
    let current = obj;
    while (current) {
        for (const key of Reflect.ownKeys(current)) {
            let val;
            try {
                const desc = Object.getOwnPropertyDescriptor(current, key);
                val = desc?.value ?? current[key];
            } catch {
                continue;
            }
            if (typeof val === "function" && matchesAllPatterns(val)) {
                return val;
            }
        }
        current = Object.getPrototypeOf(current);
    }
    return null;
}

function findGhMethod(clsConstructor) {
    const protoLocal = clsConstructor?.prototype;
    if (!protoLocal) return null;

    for (const key of Reflect.ownKeys(protoLocal)) {
        if (key === "constructor") continue;
        const fn = protoLocal[key];
        if (typeof fn === "function" && matchesAllPatterns(fn)) {
            return {
                fn,
                key
            };
        }
    }
    return null;
}

function togglePickupReach() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    if (!proto || !originalGetEntitiesInAABB) {
        const cls = findClassConstructor(shideFuxny.NIGHT.entities);
        if (!cls) {
            console.warn("[pickupReach] Could not find class constructor");
            return;
        }

        const ghMethod = findGhMethod(cls);
        if (!ghMethod) {
            console.warn("[pickupReach] Could not find getEntitiesInAABB method");
            return;
        }

        proto = cls.prototype;
        originalGetEntitiesInAABB = ghMethod.fn;
        ghMethodKey = ghMethod.key;
    }

    if (pickupReachEnabled) {
        // Disable patch
        proto[ghMethodKey] = originalGetEntitiesInAABB;
        pickupReachEnabled = false;
        console.log("[pickupReach] Patch disabled");
    } else {
        // Enable patch
        proto[ghMethodKey] = function(box, name) {
            const center = [
                (box.base[0] + box.max[0]) / 2,
                (box.base[1] + box.max[1]) / 2,
                (box.base[2] + box.max[2]) / 2,
            ];
            const halfSize = [
                (box.max[0] - box.base[0]) / 2,
                (box.max[1] - box.base[1]) / 2,
                (box.max[2] - box.base[2]) / 2,
            ];

            const enlarged = {
                base: center.map((c, i) => c - halfSize[i] * RANGE_MULTIPLIER),
                max: center.map((c, i) => c + halfSize[i] * RANGE_MULTIPLIER)
            };

            return originalGetEntitiesInAABB.call(this, enlarged, name);
        };
        pickupReachEnabled = true;
        console.log("[pickupReach] Patch enabled");
    }
    updatePickupReachButton()
}

function passiveFeatures() {

    if (changeHealthBar) {
        (function() { // FROM ENTITY
            'use strict';

            const healthBar = document.getElementsByClassName("BottomScreenStatBar")[0];

            if (healthBar) {
                // Clear all conflicting styles
                healthBar.style.background = defaultGradient;
                healthBar.style.backgroundColor = 'transparent';
                healthBar.style.boxShadow = 'none';
                healthBar.style.border = 'none';
                healthBar.style.backgroundRepeat = 'no-repeat';
                healthBar.style.backgroundSize = '100% 100%';
                healthBar.style.outline = 'none';

                // Also fix child elements (some bars use internal fill divs)
                for (const child of healthBar.children) {
                    child.style.background = 'transparent';
                    child.style.backgroundColor = 'transparent';
                    child.style.boxShadow = 'none';
                    child.style.border = 'none';
                }

                // Force override with CSS injection if still persists
                const style = document.createElement('style');
                style.textContent = `
            .BottomScreenStatBar {
                background: ${defaultGradient} !important;
                background-size: 100% 100% !important;
                background-repeat: no-repeat !important;
                box-shadow: none !important;
                border: none !important;
            }
            .BottomScreenStatBar * {
                background: transparent !important;
                background-color: transparent !important;
                box-shadow: none !important;
                border: none !important;
            }
        `;
                document.head.appendChild(style);

                console.log("✅ Applied clean default gradient to health bar");
            } else {
                console.warn("❌ Could not find health bar element");
            }
        })();
    }

    ////////Anti-cobweb
    Object.defineProperty(shideFuxny.entities[shideFuxny.impKey].moveState.list[0].speedMultiplier.multipliers, "inCobweb", {
        configurable: true,
        enumerable: true,
        get() {
            return 1; // always return 1
        },
        set(value) {
            // ignore all attempts to change it
        }
    });

    if (spoofRanksEnabled) {
        shideFuxny.entityList[1][1].ranks[0] = "developer";
        shideFuxny.entityList[1][1].ranks[1] = "youtuber";
        shideFuxny.entityList[1][1].ranks[2] = "super";
    } else {

    }


}

function emitSafePrimaryFire() {
    const realEvent = new MouseEvent("mousedown");
    const fakeEvent = {
        timeStamp: performance.now(),
        altKey: false,
        ctrlKey: realEvent.ctrlKey,
        shiftKey: realEvent.shiftKey,
        metaKey: realEvent.metaKey,
        button: realEvent.button,
        buttons: realEvent.buttons,
        clientX: realEvent.clientX,
        clientY: realEvent.clientY,
        screenX: realEvent.screenX,
        screenY: realEvent.screenY
    };

    shideFuxny.NIGHT.inputs.down.emit("primary-fire", fakeEvent);
}

function inMenu() {
    const requests = shideFuxny.Props.pointerLockWrapper.pointerUnlockRequests;
    return requests.includes("SettingsMenuComponent") || requests.includes("InGameMenu");
}


function movePotionToSlot() {
    if (!playerInventoryParent || !playerInventoryParent.playerInventory?.items) {
        console.warn("❌ playerInventoryParent is not set. Run findAndSavePlayerInventoryParent() first.");
        return false;
    }
    const items = playerInventoryParent.playerInventory.items;
    let potionSlot = null;
    for (let i = desiredPotionSlot; i < items.length; i++) {
        const item = items[i];
        if (!item || typeof item.name !== 'string') continue;
        const name = item.name.toLowerCase();
        if (
            name.includes("potion") &&
            name.includes("splash") &&
            (name.includes("healing") || name.includes("shield"))
        ) {


            potionSlot = i;
            break;
        }
    }
    if (potionSlot === null) {
        return false;
    }
    console.log(`🔁 Swapping potion from slot ${potionSlot} with slot ${desiredPotionSlot}`);
    playerInventoryParent.swapPosClient(potionSlot, desiredPotionSlot, null);
    return true;
}




function makeHitboxes() {
    if (!injectedBool) {
        console.log("NOT INJECTED NO TARGET");
        return;
    }

    const rendering = r.values(shideFuxny.rendering)[18];
    const objectData = rendering?.objectData;
    if (!objectData || !eIdKey) return;

    const activeEIds = new Set();

    // First, build a set of currently valid entity IDs
    for (const key in objectData) {
        if (key === "1") continue;
        const obj = objectData[key];
        const eId = obj[eIdKey];

        if (
            eId == null ||
            eId === myId ||
            obj.pickable === false ||
            obj.type !== "Player" ||
            !shideFuxny.entities.getState(eId, "genericLifeformState")
        ) continue;

        activeEIds.add(eId);

        // If hitbox already exists, skip
        if (hitboxes[eId]) continue;

        // Create the hitbox
        let newBox_00 = shideFuxny.Lion.Mesh.CreateBox("mesh", 1, false, 1, shideFuxny.Lion.scene);
        newBox_00.renderingGroupId = 2;

        newBox_00.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene);
        newBox_00.material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
        newBox_00.material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
        newBox_00.name = 'hitBox';
        newBox_00.id = 'hitBox_' + eId;

        let defaultPosition = new newBox_00.position.constructor(0, 0.32, 0);
        newBox_00.position = defaultPosition.clone();
        newBox_00._scaling._y = 2.2;
        newBox_00.material.alpha = 0.2;
        newBox_00.isVisible = hitBoxEnabled;

        rendering.attachTransformNode(newBox_00, key, 13);
        r.values(shideFuxny.rendering)[27].call(shideFuxny.rendering, newBox_00);

        Object.defineProperty(newBox_00._nodeDataStorage, '_isEnabled', {
            get: () => true,
            set: (v) => {},
            configurable: false
        });

        hitboxes[eId] = newBox_00;
    }

    // Cleanup hitboxes of players no longer present
    for (const eId in hitboxes) {
        if (!activeEIds.has(eId)) {
            hitboxes[eId]?.dispose();
            delete hitboxes[eId];
        }
    }

    // Visibility toggle based on node[0].enabled and hitBoxEnabled
    for (const key in objectData) {
        const obj = objectData[key];
        const eId = obj?.[eIdKey];
        if (!eId || !hitboxes[eId]) continue;

        const baseNode = obj.nodes?.[0];
        if (!baseNode) continue;

        hitboxes[eId].isVisible = baseNode.enabled && hitBoxEnabled;
    }
}



(() => {
    // Remove if already present
    const old = document.getElementById("vertical-health-bar");
    if (old) old.remove();

    // Create bar container
    const container = document.createElement("div");
    container.id = "vertical-health-bar";
    Object.assign(container.style, {
        position: "fixed",
        left: "calc(50% - 200px)", // 100px left of center
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "200px",
        background: "#000",
        border: "2px solid black",
        zIndex: 120,
        pointerEvents: "none",
        display: "flex",
        alignItems: "flex-end",
        overflow: "hidden"
    });

    // Create fill element
    const fill = document.createElement("div");
    Object.assign(fill.style, {
        width: "100%",
        height: "100%",
        background: "limegreen",
        transform: "scaleY(1)",
        transformOrigin: "bottom",
        transition: "transform 0.2s ease, background 0.2s ease", // <-- add comma here
    });

    container.appendChild(fill);
    document.body.appendChild(container);

    // Function to compute smooth gradient color from green → red
    function getHealthColor(health) {
        const ratio = health / 100;

        if (ratio > 0.5) {
            // Bright green → orange
            const t = (ratio - 0.5) * 2;
            const r = Math.round(255 * (1 - t));
            const g = 255;
            return `rgb(${r}, ${g}, 0)`; // green to yellow to orange
        } else {
            // Orange → red
            const t = ratio * 2;
            const r = 255;
            const g = Math.round(255 * t);
            return `rgb(${r}, ${g}, 0)`; // orange to red
        }
    }


    // Global health setter and show/hide toggle
    setHealthBar = function(health, show = true) {
        const clamped = Math.max(0, Math.min(health, 100));
        fill.style.transform = `scaleY(${clamped / 100})`;
        fill.style.background = getHealthColor(clamped);
        container.style.display = show ? "flex" : "none";
    };
})();

setHealthBar(100, false)

function toggleEnemyHealthGui() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    enemyHealthGuiEnabled = !enemyHealthGuiEnabled;

    if (enemyHealthGuiEnabled) {
        startHealthWatcher();
    } else {
        // Toggle off: clean up everything
        if (healthWatcherInterval) clearInterval(healthWatcherInterval);
        if (resetTimeout) clearTimeout(resetTimeout);
        setHealthBar(100, false); // hide bar
        lastPercent = null;
    }
    updateEnemyHealthGuiButton();
}

function startHealthWatcher() {
    if (healthWatcherInterval) clearInterval(healthWatcherInterval);

    healthWatcherInterval = setInterval(() => {
        const list = shideFuxny.entities[shideFuxny.impKey].entityName.list;
        let percent = null;
        let foundTarget = false;


        for (let i = 0; i < list.length; i++) {
            const targetEntity = list[i];
            if (r.values(targetEntity)[0] === lastClosestId) {
                percent = r.values(targetEntity)[7];
                foundTarget = true;
                break;
            }
        }

        // Hide health bar if not found, or at full/near full
        if (!foundTarget) { // || percent === 0 || percent >= 0.99) {
            if (resetTimeout) {
                clearTimeout(resetTimeout)
            };
            setHealthBar(100, false);
            lastPercent = null;
            return;
        }

        // Update bar only if changed
        if (percent !== null) {
            lastPercent = percent;
            lastChangeTime = Date.now();
            setHealthBar(percent * 100, true);

            if (resetTimeout) clearTimeout(resetTimeout);
            resetTimeout = setTimeout(() => {
                setHealthBar(100, false);
                lastPercent = null;
            }, 10000);
        }
    }, 300);
}

function checkAndClick() {
    const hit = playerEntity.tryHitEntity();

    if (hit?.hitEId != null) {
        if (
            !playerEntity.breaking &&
            !inMenu() &&
            shideFuxny.entities.getState(1, "genericLifeformState").isAlive &&
            shideFuxny.entities.getState(hit.hitEId, "genericLifeformState") &&
            shideFuxny.entities.getState(hit.hitEId, "genericLifeformState").isAlive &&
            r.values(shideFuxny.entityList)?.[1]?.[hit.hitEId].canAttack
        ) {
            emitSafePrimaryFire();
            lastClosestId = hit.hitEId
        }
    }
}


function toggleTriggerBot() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!')
    }
    if (triggerBotEnabled) {
        clearTimeout(autoAttackInterval);
        triggerBotEnabled = false;
        console.log("⛔ Auto-attack stopped");
    } else {
        triggerBotEnabled = true;

        function autoAttackLoop() {
            if (!triggerBotEnabled) return;
            checkAndClick();
            const nextDelay = ATTACK_INTERVAL_MS + (Math.random() * 40 - 20); // ±20ms
            autoAttackInterval = setTimeout(autoAttackLoop, nextDelay);
        }
        autoAttackLoop();
        console.log("▶️ Auto-attack started");
    }
    updateTriggerBotButton();
}


function toggleLockPlayerWaterState() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    const movementList = shideFuxny.entities[shideFuxny.impKey]?.movement?.list;
    if (!Array.isArray(movementList) || movementList.length === 0) return;

    const c = movementList[0];

    if (waterJumpingEnabled) {
        // Restore defaults (optional: redefine properties as writable again)
        waterJumpingEnabled = false;
        console.log("🔓 Player water state unlocked");
        updateWaterJumpButton();
        return;
    }

    try {
        Object.defineProperty(c, "inAirFromWater", {
            get: () => false,
            set: () => {},
            configurable: true
        });

        Object.defineProperty(c, "_jumpCount", {
            get: () => 0,
            set: () => {},
            configurable: true
        });

        Object.defineProperty(c, "_ticksOutOfWater", {
            get: () => 346,
            set: () => {},
            configurable: true
        });

        // Add this too if you want to lock ice status:
        Object.defineProperty(c, "isOnIce", {
            get: () => true,
            set: () => {},
            configurable: true
        });

        waterJumpingEnabled = true;
        console.log("🔒 Player water state locked");
        updateWaterJumpButton();
    } catch (e) {
        console.error("Error locking player water state:", e);
    }
}


let bigHeadsInterval = null;

function toggleBigHeads() {
	if (!injectedBool) {
		showTemporaryNotification('You need to inject first habibi!');
		return;
	}

	const objectData = r.values(shideFuxny.rendering)[18].objectData;

	if (!bigHeadsEnabled) {
		// Initial scale-up
		for (let key in objectData) {
			let obj = objectData[key];

			if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
				let node = obj.nodes[16];

				node.scale._x = 6;
				node.scale._y = 6;
				node.scale._z = 6;

				node.position._y = -1;
			}
		}

		// Start periodic check every 10 seconds
		bigHeadsInterval = setInterval(() => {
			for (let key in objectData) {
				let obj = objectData[key];

				if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
					let node = obj.nodes[16];

					// Only update if scale hasn't already been changed
					if (node.scale._x === 1 && node.scale._y === 1 && node.scale._z === 1) {
						node.scale._x = 6;
						node.scale._y = 6;
						node.scale._z = 6;

						node.position._y = -1;
					}
				}
			}
		}, 10000); // 10 seconds
	} else {
		// Restore original size
		for (let key in objectData) {
			let obj = objectData[key];

			if (obj?.type === "Player" && obj.nodes?.[16] && obj !== objectData[1]) {
				let node = obj.nodes[16];

				node.scale._x = 1;
				node.scale._y = 1;
				node.scale._z = 1;

				node.position._y = 0.7199999690055847;
			}
		}

		// Clear the interval
		clearInterval(bigHeadsInterval);
		bigHeadsInterval = null;
	}

	bigHeadsEnabled = !bigHeadsEnabled;
	updateBigHeadButton();
}


function toggleWallJumpScript() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    const client = shideFuxny?.clientOptions;
    const body = shideFuxny?.physics?.bodies?.[0];

    if (!client || !body) return;

    if (wallJumpRunning) {
        // Unlock airJumpCount (optional reset)
        Object.defineProperty(client, "airJumpCount", {
            value: 0,
            writable: true,
            configurable: true
        });

        wallJumpRunning = false;
        console.log("🧱 Wall jump script disabled");
        updateWallJumpButton();
        return;
    }

    // Lock airJumpCount based on body.resting direction
    Object.defineProperty(client, "airJumpCount", {
        get() {
            if (!body.resting) return 0;
            const [rx, , rz] = body.resting;
            return (rx === 1 || rx === -1 || rz === 1 || rz === -1) ? 999 : 0;
        },
        set(_) {}, // Prevent assignment
        configurable: true
    });

    wallJumpRunning = true;
    console.log("🧱 Wall jump script enabled");
    updateWallJumpButton();
}




function wangPlace(position) {

    let heldBlock = r.values(shideFuxny.NIGHT.entities[shideFuxny.impKey])[22].list[0]._blockItem;
    let worldInstanceKey = Object.keys(heldBlock)[0];
    let worldInstance = Object.values(heldBlock)[0];
    let targetedBlockKey = Object.keys(worldInstance)[25];
    let targetedBlock = worldInstance[targetedBlockKey];

    function spoofTargetedBlock(position) {
        return new Proxy({}, {
            get(target, prop, receiver) {
                if (prop === worldInstanceKey) {
                    return new Proxy(worldInstance, {
                        get(inner, key) {
                            if (key === targetedBlockKey) {
                                let spoofedTargetedBlock = structuredClone(targetedBlock) || {};
                                spoofedTargetedBlock.position = position;
                                return spoofedTargetedBlock;
                            }
                            return worldInstance[key];
                        },
                    });
                }

                if (prop == "checkTargetedBlockCanBePlacedOver") {
                    return () => true;
                }

                if (typeof heldBlock[prop] == "function") {
                    return heldBlock[prop].bind(heldBlock);
                } else {
                    return heldBlock[prop];
                }
            },
        });
    }

    heldBlock.placeBlock.call(spoofTargetedBlock(position));
}

function placeToPlayer(position) {

    // Convert to block coordinates by flooring each component
    const blockX = Math.floor(position[0]);
    const blockY = Math.floor(position[1]);
    const blockZ = Math.floor(position[2]);
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 3, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 3, blockZ) === 0) {
        wangPlace([blockX, blockY - 3, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 2, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 2, blockZ) === 0) {
        wangPlace([blockX, blockY - 2, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY - 1, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY - 1, blockZ) === 0) {
        wangPlace([blockX, blockY - 1, blockZ])
    }
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY, blockZ) === 0) {
        wangPlace([blockX, blockY, blockZ])
    }

}

function placeSpike(position) {

    // Convert to block coordinates by flooring each component
    const blockX = Math.floor(position[0]);
    const blockY = Math.floor(position[1]);
    const blockZ = Math.floor(position[2]);
    if (playerEntity.checkTargetedBlockCanBePlacedOver([blockX, blockY + 1, blockZ]) || r.values(shideFuxny.world)[47].call(shideFuxny.world, blockX, blockY + 1, blockZ) === 0) {
        wangPlace([blockX, blockY + 1, blockZ])
    }
}

function moveItem(itemName, desiredSlot) {
    if (!playerInventoryParent || !playerInventoryParent.playerInventory?.items) {
        console.warn("❌ playerInventoryParent is not set. Run findAndSavePlayerInventoryParent() first.");
        return false;
    }
    const items = playerInventoryParent.playerInventory.items;
    let oldSlot = null;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];

        if (!item || typeof item.name !== 'string') continue;
        const name = item.name.toLowerCase();
        if (name.includes(itemName)) {


            oldSlot = i;
            break;
        }
    }
    if (oldSlot === null) {
        console.warn(`❌ No ${itemName} found in slot 10 or higher.`);
        return false;
    }
    console.log(`🔁 Swapping ${itemName} from slot ${oldSlot} with slot ${desiredSlot}`);
    playerInventoryParent.swapPosClient(oldSlot, desiredSlot, null);
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function autoSW() {
    if (lastClosestId && targetEntityDistance <= 36) { // place web then spikes

        if (moveItem("net", webSlot) || moveItem("web", webSlot)) {
            let enemyPos = shideFuxny.entities.getState(lastClosestId, 'position').position;

            shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${webSlot + 1}`]();

            placeToPlayer(enemyPos);

            await sleep(50); // delay before switching to spikes

            if (moveItem("spikes", spikeSlot)) {
                shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${spikeSlot + 1}`]();
                placeSpike(enemyPos);
            }
        } else { // just place spikes
            if (moveItem("spikes", spikeSlot)) {
                shideFuxny.NIGHT.inputs.down['_events'][`HotBarSlot${spikeSlot + 1}`]();
                await sleep(50);

                let enemyPos = shideFuxny.entities.getState(lastClosestId, 'position').position;
                placeToPlayer(enemyPos);
            } else {
                console.log("no spikes or webs!");
            }
        }
        shideFuxny.NIGHT.inputs.down['_events'].HotBarSlot1();
    } else {
        console.log("No target or too far");
    }
}


function startTargetFinder() {
    let armourNodeNum = r.values(shideFuxny.rendering)[18].getNamedNode(1, "Body|Armour")
    let closestObj = null;
    targetFinderId = setInterval(() => {
        if (!injectedBool) {

            console.log("NOT INJECTED NO TARGET")
        }
        const myPos = shideFuxny.entities.getState?.(myId, 'position')?.position;
        if (!myPos) return;

        const rendering = r.values(shideFuxny.rendering)[18];
        const objectData = rendering?.objectData;
        if (!objectData) return;

        if (!eIdKey) return;

        let closestId = null;
        let minDist = 100;


        for (const key in objectData) {
            const obj = objectData[key];
            const eId = obj[eIdKey];

            if (
                eId == null ||
                eId === myId ||
                obj.pickable === false ||
                obj.type !== "Player" ||
                !shideFuxny.entities.getState(1, "genericLifeformState").isAlive ||
                !shideFuxny.entities.getState(eId, "genericLifeformState") ||
                !shideFuxny.entities.getState(eId, "genericLifeformState").isAlive
            ) continue;


            if (!eId || eId === myId || obj.pickable === false || obj.type !== "Player") continue;

            const state = shideFuxny.entities.getState(eId, "genericLifeformState");
            if (!state || !state.isAlive) continue;

            const ent = r.values(shideFuxny.entityList)?.[1]?.[eId];
            if (!ent || ent.canAttack !== true) continue;

            const pos = shideFuxny.entities.getState(eId, 'position')?.position;
            if (!pos) continue;

            const dx = pos[0] - myPos[0];
            const dy = pos[1] - myPos[1];
            const dz = pos[2] - myPos[2];

            if (Math.abs(dy) > 3) continue; // optional Y-axis restriction

            const dist = dx * dx + dy * dy + dz * dz;
            if (dist < minDist) {
                minDist = dist;
                closestId = eId;
                closestObj = obj;
            }


            // Choose a random name from the list
            //const randomName = possibleNames[Math.floor(Math.random() * possibleNames.length)];
            // Set both name and id
        }

        const armourNode = closestObj?.nodes?.[armourNodeNum];
        if (armourNode?.actuallyEnabled) {
            newBox.name = possibleNames[1];
            newBox.id = possibleNames[1];
        } else {
            newBox.name = possibleNames[0];
            newBox.id = possibleNames[0];
        }


        if (closestId != null) {
            if (!newBox.metadata) newBox.metadata = {};
            newBox.metadata.eId = closestId;

            if (closestId !== lastClosestId) {
                if (hitboxes[closestId]) {
                    hitboxes[closestId].material.diffuseColor = new shideFuxny.Lion.Color3(1, 0, 0);
                    hitboxes[closestId].material.emissiveColor = new shideFuxny.Lion.Color3(1, 0, 0);
                    for (const id in hitboxes) {
                        if (id !== closestId && hitboxes[id]) {
                            hitboxes[id].material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
                            hitboxes[id].material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
                        }
                    }
                }

                lastClosestId = closestId;
            }
        } else {
            lastClosestId = null;
        }

        // Final visibility and distance logic
        if (killAuraEnabled && closestId != null && minDist < 10) { //12 for now
            newBox[__nullKey] = true;
            targetEntityDistance = Math.floor(Math.sqrt(minDist));
        } else {
            newBox[__nullKey] = false;
            targetEntityDistance = null;
        }


    }, 50);
}




function toggleKillAura() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }
    if (killAuraEnabled) {
        console.log("⛔ Kill aura disabled");
    } else {
        newBox[__nullKey] = false;

    }
    killAuraEnabled = !killAuraEnabled;
    updateKillAuraButton();
}



function toggleHitBoxes() {
    if (!injectedBool) {
        showTemporaryNotification('You need to inject first habibi!');
        return;
    }

    hitBoxEnabled = !hitBoxEnabled;

    // Toggle visibility on all hitboxes
    for (const eId in hitboxes) {
        const box = hitboxes[eId];
        if (box && box.isVisible !== hitBoxEnabled) {
            box.isVisible = hitBoxEnabled;
        }
    }

    updateHitboxButton();
}


function toggleSkybox() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    (function saveSkyboxEntity() {
        for (let i = 0; i < 10000; i++) {
            const meshState = shideFuxny.entities.getState(i, "mesh");
            if (meshState?.mesh?.id === "skyBox") {
                console.log(`✔ Found skyBox entity: ${i}`);
                skyboxEntity = i; // Save globally
                skyboxMesh = meshState.mesh; // Optional: save mesh reference too
                break;
            }
        }
    })();

    if (!skyboxMesh) {
        console.warn("❌ skyboxMesh is not defined.");
        return;
    }

    isSkyboxHidden = !isSkyboxHidden;
    skyboxMesh.isVisible = isSkyboxHidden ? false : true;

    console.log(`🌌 Skybox is now ${isSkyboxHidden ? "hidden" : "visible"}`);
    updateSkyboxButton()
}

/*
 function rainbowSky() {
	 rainbowSkyEnabled = !rainbowSkyEnabled
	 
	 if (!rainbowSkyEnabled) {
		
	 }
	 
	 
	 
	 
	 
	 
	 
	 
 }*/



function toggleWireframe() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    wireFramesBool = !wireFramesBool;

    const renderings = r.values(shideFuxny.rendering);
    for (const rendering of renderings) {
        const thinMeshes = r.values(shideFuxny.rendering)[18].thinMeshes;
        if (!Array.isArray(thinMeshes)) continue;

        for (const thinMesh of thinMeshes) {
            const mesh = thinMesh?.mesh;
            const material = mesh?.material;
            const name = mesh?.name;

            if (
                material &&
                typeof material.wireframe === "boolean" &&
                !(typeof name === "string" && name.includes("Armour"))
            ) {
                material.wireframe = wireFramesBool;
            }
        }
    }

    updateWireframeButton();
}


let chestESPEnabled = false;
let oreESPEnabled = false;
let chestOreInterval = null;
let chestBoxes = {};


function clearESPBoxes() {
    for (const key in chestBoxes) {
        for (const {
                mesh,
                id
            }
            of chestBoxes[key]) {
            mesh.dispose();
            shideFuxny.entities.deleteEntity(id);
        }
    }
    scannedChunks.clear();
    chestBoxes = {};
}


function reverseIndex(i, stride) {
    const x = Math.floor(i / stride[0]);
    const remX = i % stride[0];
    const y = Math.floor(remX / stride[1]);
    const z = remX % stride[1];
    return [x, y, z];
}

function getChunkKey(chunk) {
    const [wx, wy, wz] = chunk.pos || [0, 0, 0];
    const cx = Math.floor(wx / 32);
    const cy = Math.floor(wy / 32);
    const cz = Math.floor(wz / 32);
    return `${cx}|${cy}|${cz}|overworld`;
}

function scanChunk(chunk, blockIDs) {
    const blockData = chunk[chunkDataField];
    if (!blockData) return;

    const {
        data,
        stride
    } = blockData;

    const pos = chunk.pos || [0, 0, 0];
    if (!data || !stride) return;

    const chunkKey = getChunkKey(chunk);
    for (let i = 0; i < data.length; i++) {
        const blockID = data[i];
        if (!blockIDs.includes(blockID)) continue;




        const [x, y, z] = reverseIndex(i, stride);
        const worldX = pos[0] + x + 0.5;
        const worldY = pos[1] + y + 0.5;
        const worldZ = pos[2] + z + 0.5;

        const mesh = shideFuxny.Lion.Mesh.CreateBox("espbox", 0.5, false, 1, shideFuxny.Lion.scene);
        mesh.position.set(worldX, worldY, worldZ);
        mesh.renderingGroupId = 1;

        mesh.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene)

        const id = shideFuxny.entities.add([worldX, worldY, worldZ], null, null, mesh);
        if (!chestBoxes[chunkKey]) chestBoxes[chunkKey] = [];
        chestBoxes[chunkKey].push({
            mesh,
            id
        });


        if ([204, 205, 206, 207].includes(blockID)) {
            console.log("FOUNDCHEST")

            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(1, 0.5, 0); // orange
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(1, 0.5, 0); // makes it glow orange
        }
        if (blockID === 45) {
            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(0, 0, 1); // blue
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(0, 0, 1); // makes it glow blue
        }

        if (blockID === 465) {
            mesh.material.diffuseColor = new shideFuxny.Lion.Color3(0.7, 0.5, 1); // pale purple
            mesh.material.emissiveColor = new shideFuxny.Lion.Color3(0.7, 0.5, 1); // makes it glow pale purple
        }




    }
}




function scanAllChunks() {
    if (!shideFuxny?.world || !shideFuxny?.world?.[shideFuxny.impKey]?.hash) return;
    const chunkHash = shideFuxny.world[shideFuxny.impKey].hash;
    // Step 1: Remove boxes for chunks no longer loaded
    for (const scannedKey of scannedChunks) {
        if (!(scannedKey in chestBoxes)) continue;

        if (!Object.values(chunkHash).some(chunk => getChunkKey(chunk) === scannedKey)) {
            // Delete all meshes for this chunk
            for (const {
                    mesh,
                    id
                }
                of chestBoxes[scannedKey]) {
                mesh.dispose(); // remove from scene
                shideFuxny.entities.deleteEntity(id); // remove from entity system if needed
            }
            delete chestBoxes[scannedKey];
            scannedChunks.delete(scannedKey);
        }
    }

    // Step 2: Scan newly loaded chunks
    for (const chunkKey in chunkHash) {

        const chunk = chunkHash[chunkKey];
        if (!chunkDataField) {
            autoDetectChunkDataField(chunk);
            if (!chunkDataField) continue; // Skip if still not found
        }

        const blockData = chunk[chunkDataField];
        if (!blockData?.data || !blockData.stride || !chunk.pos) continue;


        const key = getChunkKey(chunk);
        if (scannedChunks.has(key)) continue;
        scannedChunks.add(key);
        if (chestESPEnabled) scanChunk(chunk, [204, 205, 206, 207]);
        if (oreESPEnabled) scanChunk(chunk, [44, 45, 465, 50]);
    }
}


function toggleChestESP() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    chestESPEnabled = !chestESPEnabled;
    if (chestESPEnabled || oreESPEnabled) {
        scanAllChunks();
        chestOreInterval = setInterval(scanAllChunks, 5000);
    } else {
        clearInterval(chestOreInterval);
        chestOreInterval = null;
        clearESPBoxes();
        scannedChunks.clear(); // Allow rescan next time
    }
    updateChestESPButton();
}

function toggleOreESP() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    oreESPEnabled = !oreESPEnabled;
    if (chestESPEnabled || oreESPEnabled) {
        scanAllChunks();
        chestOreInterval = setInterval(scanAllChunks, 5000);
    } else {
        clearInterval(chestOreInterval);
        chestOreInterval = null;
        clearESPBoxes();
        scannedChunks.clear(); // Allow rescan next time
    }
    updateOreESPButton();
}



function toggleESP() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    if (!shideFuxny.impKey) return;
    espEnabled = !espEnabled;
    const groupId = espEnabled ? 2 : 0;

    if (Array.isArray(r.values(shideFuxny.rendering)[18].thinMeshes)) {
        for (const thinMesh of r.values(shideFuxny.rendering)[18].thinMeshes) {
            if (thinMesh?.mesh && typeof thinMesh.mesh.renderingGroupId === "number") {
                thinMesh.mesh.renderingGroupId = groupId;
            }
        }
        console.log(`✅ Thin meshes render group set to ${groupId}`);
    } else {
        console.error("❌ thinMeshes array not found.");
    }
    updateESPButton?.();
}




// Utility Functions
function findNoaAndKey() {

let winDescriptors = Object.getOwnPropertyDescriptors(window);
        let wpName = Object.keys(winDescriptors).find(key => winDescriptors[key]?.set?.toString().includes("++"));
        let wpInstance = window[wpName] = window[wpName];
		
		    // HILOCATOR push
    wpInstance.push([
        [Math.floor(Math.random() * 90000) + 10000], {},
        function(wpRequire) {
            shideFuxny.findModule = (code) => wpRequire(Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes(code))]);
            shideFuxny.Props = Object.values(shideFuxny.findModule("nonBlocksClient:")).find(prop => typeof prop == "object");
            shideFuxny.NIGHT = Object.values(shideFuxny.Props).find(prop => prop?.entities);
            //Credits to, you guessed it wang!
        }
    ]);


    if (!shideFuxny.NIGHT) {

        console.warn("❌ Could not find noa using backup.");


        const visited = new WeakSet();

        function recurse(obj, parent = null, parentKey = null) {
            if (typeof obj !== 'object' || obj === null || visited.has(obj)) return null;
            visited.add(obj);
            try {
                if ('entities' in obj && obj.entities?.t) {
                    noaParent = parent;
                    noaKeyInParent = parentKey;
                    return obj;
                }
            } catch {}

            for (const key in obj) {
                if (!Object.hasOwn(obj, key)) continue;
                try {
                    const result = recurse(obj[key], obj, key);
                    if (result) return result;
                } catch {}
            }
            return null;
        };
        shideFuxny.NIGHT = recurse(window);
    };


    const targetValue = r.values(shideFuxny.NIGHT.entities)[2];
    const entityEntries = Object.entries(shideFuxny.NIGHT.entities);
    shideFuxny.impKey = entityEntries.find(([_, val]) => val === targetValue)?.[0];
    shideFuxny.registry = r.values(shideFuxny.NIGHT)[17]
    shideFuxny.rendering = r.values(shideFuxny.NIGHT)[12]
    shideFuxny.entities = shideFuxny.NIGHT.entities;



    if (shideFuxny.impKey) {
        console.log("importantList identified:", shideFuxny.impKey);

        // Attempt to find BHOP references
        const key = shideFuxny.impKey;
        if (key) {
            const entity = shideFuxny.NIGHT.entities?.[key];
            if (entity?.moveState?.list?.[0] && entity?.movement?.list?.[0]) {
                playerKey = key;
                moveState = entity.moveState.list[0];
                physState = entity.movement.list[0];
                cachedBHOPParent = entity;
                console.log("✅ Cached BHOP entity data");
            } else {
                console.warn("⚠️ Found key but missing BHOP components");
            }
        } else {
            console.warn("❌ BHOP player key not found");
        }




    }

    (function findECS() {
        const noaObj = shideFuxny.NIGHT;
        if (!noaObj) {
            console.error("❌ noa object not found");
            return;
        }

        for (const [key, val] of Object.entries(noaObj)) {
            if (key === "entities") continue; // skip known non-ECS

            if (typeof val === "object" && typeof val.getState === "function") {
                console.log(`✅ Found ECS at noa.${key}`);
                shideFuxny.ECS = val;
                break;
            }
        }

    })();

    function findeIdKey() {

        const rendering = r.values(shideFuxny.rendering)[18];
        const objectData = rendering?.objectData;
        if (!objectData) return;

        const sample = objectData[1];
        for (const key in sample) {
            if (sample[key] === 1) {
                eIdKey = key;
                break;
            }
        }
    }

    findeIdKey();

    function findAddComponentFunction(obj) {
        const exclude = ['overwriteComponent', 'deleteComponent', 'removeComponent', 'getState'];
        for (const key in obj) {
            if (exclude.includes(key)) continue;
            const fn = obj[key];
            if (typeof fn !== 'function') continue;
            try {
                fn(999999, "__FAKE_COMPONENT__", {});
            } catch (err) {
                const msg = (err?.message || "").toLowerCase();
                if (
                    msg.includes("unknown component") ||
                    msg.includes("already has component") ||
                    (msg.includes("component") && msg.includes("missing"))
                ) {
                    console.log(`🧩 Candidate: ${key} → likely addComponent()`);
                    return key;
                }
            }
        }
        console.warn("❌ Could not identify an addComponent-like function.");
        return null;
    }



    let mesh = r.values(shideFuxny.rendering)[7].meshes[0];
    let scene = r.values(shideFuxny.rendering)[7];
    let engine = scene.getEngine();
    let StandardMaterial = mesh.material.constructor;
    let Color3 = mesh.material.diffuseColor.constructor;
    const addKey = findAddComponentFunction(shideFuxny.NIGHT.entities);
    const addComponent = shideFuxny.NIGHT.entities[addKey];
    shideFuxny.world = r.values(shideFuxny.NIGHT)[11]
    shideFuxny.physics = shideFuxny.NIGHT.physics
    shideFuxny.camera = shideFuxny.NIGHT.camera
    shideFuxny.bloxd = shideFuxny.NIGHT.bloxd
    shideFuxny.clientOptions = r.values(shideFuxny.NIGHT)[29]
    shideFuxny.Lion = {
        scene,
        engine,
        InstancedMesh: mesh.constructor,
        Mesh: mesh.constructor,
        Scene: scene.constructor,
        Engine: engine.constructor,
        Color3,
        StandardMaterial,
        addComponent,
        addKey
    };
    playerInventoryParent = shideFuxny.entities[shideFuxny.impKey].inventory.list[0].opWrapper


    function autoDetectChunkDataField(chunk) {
        for (const key of Object.keys(chunk)) {
            const val = chunk[key];
            if (!val) continue;

            if (
                typeof val === "object" &&
                Array.isArray(val.stride) &&
                val.stride.length === 3 &&
                (
                    Array.isArray(val.data) ||
                    ArrayBuffer.isView(val.data) // covers Uint16Array etc.
                )
            ) {
                console.log("✅ Detected chunk data field:", key);
                chunkDataField = key;
                return key;
            }
        }

        console.warn("❌ Failed to auto-detect chunk data field");
        return null;
    }

    autoDetectChunkDataField(Object.values(shideFuxny.world[shideFuxny.impKey].hash)[0]);

    const maybeEntity = r.values(r.values(shideFuxny.entities[shideFuxny.impKey])[22].list[0])[1];

    const hasDoAttackDirect = typeof maybeEntity?.doAttack === 'function';
    const hasDoAttackBreakingItem = typeof maybeEntity?.breakingItem?.doAttack === 'function';

    if (hasDoAttackDirect) {
        console.log("maybeEntity has doAttack");
        playerEntity = maybeEntity;
    } else if (hasDoAttackBreakingItem) {
        console.log("maybeEntity.breakingItem has doAttack");
        playerEntity = maybeEntity.breakingItem;
    } else {
        console.warn("Neither maybeEntity nor its breakingItem has doAttack");
        playerEntity = null;
    }




    mesh = null;
    scene = null;
    engine = null;
    StandardMaterial = null;
    Color3 = null;


    /*
    		(function findRenderingModule() {
    			const scene = shideFuxny?.Lion?.scene;
    			if (!scene) {
    				console.error("❌ shideFuxny.Lion.scene not set");
    				return;
    			}

    			for (const [key, val] of Object.entries(shideFuxny.NIGHT)) {
    				if (typeof val === "object" && val !== null) {
    					for (const nestedVal of Object.values(val)) {
    						if (nestedVal === scene) {
    							console.log(`✅ Found scene in noa["${key}"]`);
    							shideFuxny.rendering = val;
    							return;
    						}
    					}
    				}
    			}



    		})();

    */


    startTargetFinder()



    // Create box


    newBox = shideFuxny.Lion.Mesh.CreateBox("mesh", 1, false, 1, shideFuxny.Lion.scene);
    newBox.renderingGroupId = 1;
    newBoxId = shideFuxny.entities.add([0, 10, 0], null, null, newBox);

    //newBox.Da = true;
    newBox.material = new shideFuxny.Lion.StandardMaterial("mat", shideFuxny.Lion.scene);
    newBox.material.diffuseColor = new shideFuxny.Lion.Color3(1, 1, 1);
    newBox.material.emissiveColor = new shideFuxny.Lion.Color3(1, 1, 1);
    newBox.name = 'BodyMesh';
    newBox.id = 'BodyMesh';
    newBox.isVisible = false;

    // Find null key
    __nullKey = null;
    for (const key in newBox) {
        if (key.length === 2 && newBox[key] === null) {
            __nullKey = key;
            break;
        }
    }
    if (__nullKey) {
        newBox[__nullKey] = false;
    }

    shideFuxny.entityList = r.values(shideFuxny.NIGHT)[30]

    humanoidMeshlist = shideFuxny.entities[shideFuxny.impKey]?.humanoidMesh?.list;
    __stringKey = null;
    if (Array.isArray(humanoidMeshlist)) {
        outerLoop: for (const obj of humanoidMeshlist) {
            for (const key in obj) {
                if (typeof obj[key] === "string") {
                    __stringKey = key;
                    break outerLoop;
                }
            }
        }
    }
    else {
        console.error("❌ Invalid humanoidMeshlist path.");
    }

    // Follow loop
    function followHeadLoop() {
        if (newBox) {
            const playerId = 1;
            const playerPosState = shideFuxny.entities.getState(playerId, "position");

            if (playerPosState && Array.isArray(playerPosState.position)) {
                const [x, y, z] = playerPosState.position;
                const newPos = [x, y + 1.5, z];
                shideFuxny.entities.setPosition(newBoxId, newPos);
            } else {
                console.error("Player position not found or invalid");
            }
        }

        animationFrameId = requestAnimationFrame(followHeadLoop);
    }

    // Start the loop
    animationFrameId = requestAnimationFrame(followHeadLoop);


    passiveFeatures();


    const visitedTags = new WeakSet();

    function findParentOfNameTag(obj, path = '') {
        if (typeof obj !== 'object' || obj === null || visitedTags.has(obj)) return null;
        visitedTags.add(obj);

        for (const key in obj) {
            if (!Object.hasOwn(obj, key)) continue;
            try {
                const value = obj[key];
                const currentPath = path + (Array.isArray(obj) ? `[${key}]` : (path ? '.' : '') + key);

                if (value && typeof value === 'object' && value.id === '1NameTag') {
                    console.log("✅ Path to NameTag parent:", currentPath);
                    return obj;
                }

                const result = findParentOfNameTag(value, currentPath);
                if (result) return result;
            } catch {}
        }
        return null;
    }

    cachedNameTagParent = shideFuxny.Lion.scene //findParentOfNameTag(shideFuxny.world[shideFuxny.impKey].hash)     Все ебать.


    // Run the function every 15 seconds
    setInterval(makeHitboxes, 1000);



}



function findElementByText(text) {
    const all = document.querySelectorAll('div, span, button, a');
    for (const el of all)
        if (el.textContent.trim() === text) return el;
    return null;
}

function clickTeleportButton() {
    const teleportButtonText = findElementByText('Teleport To Lobby Spawn');
    if (teleportButtonText) {
        let clickable = teleportButtonText;
        while (clickable && !clickable.onclick && clickable.tagName !== 'BUTTON') clickable = clickable.parentElement;
        if (clickable) {
            console.log('Clicking teleport button:', clickable);
            clickable.click();
        } else {
            console.warn('No clickable parent found, trying to click text element itself');
            teleportButtonText.click();
        }
    } else console.warn('Teleport button text not found in DOM');
}


function toggleAutoPot() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    autoPotionEnabled = !autoPotionEnabled;
    if (autoPotionEnabled) {
        autoPotionInterval = setInterval(movePotionToSlot, 1000);
        console.log("AutoPotion enabled");
    } else {
        clearInterval(autoPotionInterval);
        autoPotionInterval = null;
        console.log("AutoPotion disabled");
    }
    updateAutoPotButton();
}


function toggleNameTags() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }

    nameTagsEnabled = !nameTagsEnabled;
    if (nameTagsEnabled) {
        if (!cachedNameTagParent) {
            nameTagsEnabled = false;
            return;
        }
        nameTagParent = cachedNameTagParent;
        nameTagsIntervalId = setInterval(() => {
            const entityList = shideFuxny.entityList;
            if (!entityList || typeof entityList !== 'object') return;

            for (const subGroup of Object.values(entityList)) {
                if (!subGroup || typeof subGroup !== 'object') continue;

                for (const obj of Object.values(subGroup)) {
                    if (obj?.lobbyLeaderboardValues) {
                        try {
                            const descTag = Object.getOwnPropertyDescriptor(obj, 'hasPriorityNametag');
                            if (!descTag || descTag.configurable) {
                                Object.defineProperty(obj, 'hasPriorityNametag', {
                                    get() {
                                        return true;
                                    },
                                    set(val) {
                                        if (val !== true) {}
                                    },
                                    configurable: true
                                });
                            }

                            const descSee = Object.getOwnPropertyDescriptor(obj, 'canSee');
                            if (!descSee || descSee.configurable) {
                                Object.defineProperty(obj, 'canSee', {
                                    get() {
                                        return true;
                                    },
                                    set(val) {
                                        if (val !== true) {}
                                    },
                                    configurable: true
                                });
                            }

                        } catch (e) {}
                    }
                }
            }

            for (const key in nameTagParent) {
                const tag = nameTagParent;
                if (tag && typeof tag === 'object' && typeof tag.id === 'string' && tag.id.includes('NameTag')) {
                    try {
                        const descVisible = Object.getOwnPropertyDescriptor(tag, '_isVisible');
                        if (!descVisible || descVisible.configurable) {
                            Object.defineProperty(tag, '_isVisible', {
                                get() {
                                    return true;
                                },
                                set(val) {
                                    if (val !== true) {}
                                },
                                configurable: true
                            });
                        }

                        const descRenderGroup = Object.getOwnPropertyDescriptor(tag, 'renderingGroupId');
                        if (!descRenderGroup || descRenderGroup.configurable) {
                            Object.defineProperty(tag, 'renderingGroupId', {
                                get() {
                                    return 3;
                                },
                                set(val) {
                                    if (val !== 3) {}
                                },
                                configurable: true
                            });
                        }
                    } catch (e) {}
                }
            }
        }, 15000);
        console.log("✅ NameTag visibility lock: ON");
    } else {
        clearInterval(nameTagsIntervalId);
        nameTagsIntervalId = null;
        if (nameTagParent) {
            for (const key in nameTagParent) {
                const tag = nameTagParent[key];
                if (tag && typeof tag === 'object' && typeof tag.id === 'string' && tag.id.includes('NameTag')) {
                    try {
                        const current = tag._isVisible;
                        delete tag._isVisible;
                        tag._isVisible = current;
                    } catch (e) {
                        console.warn("Failed to unlock _isVisible on", tag);
                    }
                }
            }
        }
        nameTagParent = null;
        console.log("🟡 NameTag visibility lock: OFF");
    }
    updateNameTagsButton();
}

function toggleBHOP() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    bhopEnabled = !bhopEnabled;
    if (bhopEnabled) {
        if (!moveState || !physState) {
            console.warn("❌ BHOP references not initialized. Did you inject?");
            bhopEnabled = false;
            return;
        }
        bhopIntervalId = setInterval(bunnyHop, 10); //was 60
        console.log("BHOP: ON");
    } else {
        clearInterval(bhopIntervalId);
        bhopIntervalId = null;
        console.log("BHOP: OFF");
    }
    updateBHOPButton();
}

function toggleBlinkWrapper() {
    if (!injectedBool) {

        showTemporaryNotification('You need to inject first habibi!')

    }
    const colyRoom = shideFuxny?.bloxd?.client?.msgHandler?.colyRoom;
    if (!colyRoom || typeof colyRoom.sendBytes !== "function") {
        console.warn("[Blink] colyRoom or sendBytes not ready.");
        return;
    }

    // Initialize blinkState if needed
    if (!blinkState) {
        blinkState = {
            enabled: false,
            originalSendBytes: colyRoom.sendBytes,
            queued: [],
            interval: 0,
            noPacket: false
        };
    } else if (typeof blinkState.originalSendBytes !== "function") {
        // Safeguard: recapture originalSendBytes if corrupted
        blinkState.originalSendBytes = colyRoom.sendBytes;
    }

    // Toggle
    blinkState.enabled = !blinkState.enabled;
    blinkState.interval = 0; // optional tweak
    blinkState.noPacket = false;

    if (blinkState.enabled) {
        console.log(`[Blink] ENABLED — interval: ${blinkState.interval}, noPacket: ${blinkState.noPacket}`);

        colyRoom.sendBytes = (...args) => {
            const [J, T] = args;
            const send = () => {
                if (typeof blinkState.originalSendBytes === "function") {
                    blinkState.originalSendBytes.call(colyRoom, J, T);
                } else {
                    console.warn("[Blink] originalSendBytes is invalid.");
                }
            };

            if (blinkState.interval > 0) {
                setTimeout(send, blinkState.interval);
            } else {
                blinkState.queued.push([J, T]);
            }
        };
    } else {
        console.log(`[Blink] DISABLED — sending ${blinkState.queued.length} packets.`);
        for (const [J, T] of blinkState.queued) {
            if (typeof blinkState.originalSendBytes === "function") {
                blinkState.originalSendBytes.call(colyRoom, J, T);
            } else {
                console.warn("[Blink] Cannot replay packets — originalSendBytes is invalid.");
                break;
            }
        }
        colyRoom.sendBytes = blinkState.originalSendBytes;
        blinkState.queued = [];
    }

    // Update UI
    if (typeof updateBlinkButton === "function") {
        updateBlinkButton();
    }
}


// ⛏ BHOP logic
function bunnyHop() {
    if (!bhopEnabled || !physState.isOnGround?.() || moveState.crouching || moveState.speed < 0.05) return;
    moveState.jumping = true;
    physState._hadJumpInputPrevTick = false;
    setTimeout(() => {
        moveState.jumping = false;
    }, 20);
}




//////////////////////////////////////////////////////////////////////////////////////GUI

document.getElementById("rndAsciiGUI")?.remove();
document.getElementById("rndAsciiGUI_minimized")?.remove();

let miniPos = {
    left: 10,
    top: 10
};
let accent = {
    color: defaultColor,
    alpha: 1
};
let bg = {
    color: defaultBackGroundColor,
    alpha: defaultBackGroundTransparency,
    blur: defaultBackGroundBlur
};
let isGuiVisible = true;
let minimizedIcon = null;

const style = document.createElement("style");
style.textContent = `
  :root {
    --accent-color: ${defaultColor};
    --accent-gradient: ${defaultGradient};
    --accent-hover-color: ${defaultColor};
  }

  .gradient-indicator {
    background: var(--accent-gradient);
  }

  #rndAsciiGUI {
    position: fixed;
    top: 10vh;
    left: 10vw;
    width: 35vw; /* Change width to one-third of the original */
    height: auto;
    z-index: 999999;
    border-radius: 8px;
    overflow: hidden;
    font-family: sans-serif;
    pointer-events: none;
  }

  #rndAsciiTopBar {
    height: 40px;
    background: var(--accent-gradient);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    cursor: move;
    pointer-events: auto;
  }

  #rndAsciiTopBar img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
    border-radius: 4px;
  }

  #rndAsciiTopBarTitle {
    display: flex;
    align-items: center;
    pointer-events: auto;
  }

  #rndAsciiMinBtn {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 0 10px;
    pointer-events: auto;
  }

  #rndAsciiContent {
    display: flex;
    height: auto;
    pointer-events: auto;
  }

  #rndAsciiSidebar {
    width: 150px;
    display: flex;
    flex-direction: column;
  }

.rndAsciiBtn {
    box-sizing: border-box;
    padding: 12px 10px;
    color: rgba(255, 255, 255, 0.8);
    background: none;
    text-align: left;
    position: relative;
    cursor: pointer;
    outline: none;
    border: none;
    box-shadow: none;
    transition: all 0.2s;
    pointer-events: auto;
    font-size: 14px;
    height: 50px;
    display: flex;
    align-items: center;
    border-radius: 4px;
    margin: 2px 5px;
  }

  .rndAsciiBtn.active {
    font-weight: bold;
    background: rgba(255, 255, 255, 0.1);
  }

  .rndAsciiBtn:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  .rndAsciiBtn.indicatorLine {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px
    width: 0%;
    background: var(--accent-gradient);
    transition: width 0.3s;
    border-radius: 2px;
}


  #rndAsciiDivider {
    width: 2px;
    background: var(--accent-color, ${defaultColor});
    margin: 0 5px;
  }

  #rndAsciiPage {
    flex: 1;
    padding: 20px;
    color: white;
    overflow-y: auto;
    pointer-events: auto;
  }

  #rndAsciiGUI_minimized {
    position: fixed;
    width: 32px;
    height: 32px;
    background: var(--accent-gradient);
    border-radius: 4px;
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    user-select: none;
    pointer-events: auto;
  }

  #rndAsciiGUI_minimized img {
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }

  .rndAsciiGroup {
    margin-bottom: 20px;
  }

  .rndAsciiGroup label {
    display: block;
    margin-bottom: 4px;
    font-weight: bold;
  }

  input[type="range"] {
    width: 100%;
    accent-color: var(--accent-color, ${defaultColor});
    pointer-events: auto;
  }

  input[type="color"] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    outline: none;
    height: 30px;
    border-radius: 4px;
    cursor: pointer;
    pointer-events: auto;
  }

  input[type="text"] {
    background: rgba(255, 255, 255, 0.1);
    border: none;
    outline: none;
    height: 30px;
    border-radius: 4px;
    color: white;
    padding: 0 10px;
    pointer-events: auto;
  }
.gradient-border {
  position: relative;
  color: white;
  background-color: transparent;
  border: none; /* Remove the border from the main element */
  border-radius: 8px;
  cursor: pointer;
  z-index: 0;
}

`;
document.head.appendChild(style);




const gui = document.createElement("div");
gui.id = "rndAsciiGUI";
document.body.appendChild(gui);

const topHTML = `
  <style>
    #rndAsciiTopBarTitle span {
  text-shadow:
    0 0 5px rgba(255, 255, 255, 0.9),
    0 0 10px rgba(255, 255, 255, 0.8),
    0 0 15px rgba(255, 255, 255, 0.7);
}
  </style>
  <div id="rndAsciiTopBar">
    <div id="rndAsciiTopBarTitle">
      <img src="${ICON_URL}" alt="icon">
      <span>${TITLE}</span>
    </div>
    <button id="rndAsciiMinBtn">_</button>
  </div>
`;


const contentHTML = `
		  <div id="rndAsciiContent">
			<div id="rndAsciiSidebar"></div>
			<div id="rndAsciiDivider"></div>
			<div id="rndAsciiPage"></div>
		  </div>
		`;

gui.innerHTML = topHTML + contentHTML;

const sidebar = gui.querySelector("#rndAsciiSidebar");
const page = gui.querySelector("#rndAsciiPage");

const waterJumpBtn = createButton("Water Jump")
const hitboxBtn = createButton("Hitbox");
const wireframeBtn = createButton("Wireframes");
const espBtn = createButton("ESP");
const bhopBtn = createButton("BHOP");
const enemyHealthGuiBtn = createButton("Enemy Healh Bar")
const blinkBtn = createButton("Blink");
const chestESPBtn = createButton("Chest ESP");
const oreESPBtn = createButton("Ore ESP");
const nameTagBtn = createButton("Nametags")
const killAuraBtn = createButton("Kill Aura")
const skyBoxBtn = createButton("Night")
const wallJumpBtn = createButton("Wall Jump")
const triggerBotBtn = createButton("TriggerBot")
const pickupReachBtn = createButton("Pickup Reach")
const autoPotBtn = createButton("Auto Potion")
const knifeBtn = createButton("BHOP Knife")
const bigHeadsBtn = createButton("BIGHEADS")

const pageNames = [
    "Inject & Enumerate",
    "Combat",
    "Movement"
];

const customizationElements = [];
const pageBtns = [];
const pageContents = [
    [],
    [killAuraBtn, waterJumpBtn],
    [oreESPBtn, nameTagBtn, pickupReachBtn],
    customizationElements
];


function createButton(label) {
    const btn = document.createElement('button');
    btn.textContent = label;
    btn.className = 'rndAsciiBtn';
    btn.style.width = 'calc(100% - 10px)';
    btn.style.padding = '12px 10px';
    btn.style.position = 'relative';
    btn.style.margin = '3px 5px';
    btn.style.border = 'none';
    btn.style.borderRadius = '4px';
    btn.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    btn.style.color = 'rgba(255, 255, 255, 0.8)';
    btn.style.cursor = 'pointer';
    btn.style.fontSize = '14px';
    btn.style.textAlign = 'left';
    btn.style.height = '50px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.transition = 'all 0.2s';

    const indicatorLine = document.createElement('div');
    indicatorLine.className = 'indicatorLine gradient-indicator';
    indicatorLine.style.position = 'absolute';
    indicatorLine.style.bottom = '0';
    indicatorLine.style.left = '0';
    indicatorLine.style.width = '0%';
    indicatorLine.style.height = '4px';
    indicatorLine.style.setProperty('height', '4px', 'important');
    indicatorLine.style.transition = 'width 0.3s';

    btn.appendChild(indicatorLine);
    btn.indicatorLine = indicatorLine;

    btn.onmouseenter = function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
    };

    btn.onmouseleave = function() {
        if (!this.classList.contains('active')) {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
        }
    };

    return btn;
}

for (let i = 0; i < pageNames.length; i++) {
    const btn = createButton(pageNames[i]);
    btn.indicatorLine.style.display = i === 0 ? "block" : "none";

    btn.onclick = () => {
        // Clear existing active styles
        pageBtns.forEach((b) => {
            b.classList.remove("active");
            b.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
            b.style.fontWeight = "normal";
            b.indicatorLine.style.width = "0%";
        });

        // Apply active styles to current button
        btn.classList.add("active");
        btn.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
        btn.style.fontWeight = "bold";
        btn.indicatorLine.style.width = "100%";

        // Clear current page content
        page.innerHTML = "";

        // Load appropriate page
        if (i === 0) {
            createPageOneContent(); // Inject page
        } else if (i === 5) {
            showCustomizationPage();
            pageContents[i].forEach(el => page.appendChild(el));
        } else {
            pageContents[i].forEach(el => page.appendChild(el));
        }
    };

    if (i === 0) btn.classList.add("active");
    sidebar.appendChild(btn);
    pageBtns.push(btn);
}




pageContents[0].forEach(el => page.appendChild(el));

function showCustomizationPage() {
    customizationElements.length = 0;

    // Accent customization group
    const accentGroup = document.createElement("div");
    accentGroup.className = "rndAsciiGroup";

    const accentColorLabel = document.createElement("label");
    accentColorLabel.textContent = "Accent Color";

    const accentColorInput = document.createElement("input");
    accentColorInput.type = "color";
    accentColorInput.id = "accentColor";
    accentColorInput.value = accent.color;

    const accentAlphaLabel = document.createElement("label");
    accentAlphaLabel.textContent = "Accent Transparency";

    const accentAlphaInput = document.createElement("input");
    accentAlphaInput.type = "range";
    accentAlphaInput.id = "accentAlpha";
    accentAlphaInput.min = "0";
    accentAlphaInput.max = "1";
    accentAlphaInput.step = "0.01";
    accentAlphaInput.value = accent.alpha;

    accentGroup.appendChild(accentColorLabel);
    accentGroup.appendChild(accentColorInput);
    accentGroup.appendChild(accentAlphaLabel);
    accentGroup.appendChild(accentAlphaInput);

    // Background customization group
    const bgGroup = document.createElement("div");
    bgGroup.className = "rndAsciiGroup";

    const bgColorLabel = document.createElement("label");
    bgColorLabel.textContent = "Background Color";

    const bgColorInput = document.createElement("input");
    bgColorInput.type = "color";
    bgColorInput.id = "bgColor";
    bgColorInput.value = bg.color;

    const bgAlphaLabel = document.createElement("label");
    bgAlphaLabel.textContent = "Background Transparency";

    const bgAlphaInput = document.createElement("input");
    bgAlphaInput.type = "range";
    bgAlphaInput.id = "bgAlpha";
    bgAlphaInput.min = "0";
    bgAlphaInput.max = "1";
    bgAlphaInput.step = "0.01";
    bgAlphaInput.value = bg.alpha;

    const bgBlurLabel = document.createElement("label");
    bgBlurLabel.textContent = "Blur Strength";

    const bgBlurInput = document.createElement("input");
    bgBlurInput.type = "range";
    bgBlurInput.id = "bgBlur";
    bgBlurInput.min = "0";
    bgBlurInput.max = "30";
    bgBlurInput.step = "1";
    bgBlurInput.value = bg.blur;

    bgGroup.appendChild(bgColorLabel);
    bgGroup.appendChild(bgColorInput);
    bgGroup.appendChild(bgAlphaLabel);
    bgGroup.appendChild(bgAlphaInput);
    bgGroup.appendChild(bgBlurLabel);
    bgGroup.appendChild(bgBlurInput);

    // Toggle key customization group
    const toggleKeyGroup = document.createElement("div");
    toggleKeyGroup.className = "rndAsciiGroup";

    const toggleKeyLabel = document.createElement("label");
    toggleKeyLabel.textContent = "Toggle Key";

    const toggleKeyInput = document.createElement("input");
    toggleKeyInput.type = "text";
    toggleKeyInput.id = "openKey";
    toggleKeyInput.value = openKey;

    const toggleKeyDesc = document.createElement("p");
    toggleKeyDesc.textContent = "Press a key to bind it...";

    toggleKeyGroup.appendChild(toggleKeyLabel);
    toggleKeyGroup.appendChild(toggleKeyInput);
    toggleKeyGroup.appendChild(toggleKeyDesc);

    // Keybind customization group
    const keybindGroup = document.createElement("div");
    keybindGroup.className = "rndAsciiGroup";

    keybindActions.forEach((bind) => {
        const bindLabel = document.createElement("label");
        bindLabel.textContent = `${bind.name} Keybind`;

        const bindInput = document.createElement("input");
        bindInput.type = "text";
        bindInput.value = bind.code;
        bindInput.dataset.name = bind.name;

        bindInput.addEventListener("focus", (e) => {
            const handleKeyDown = (event) => {
                event.preventDefault();
                const newKey = event.code;
                bindInput.value = newKey;

                // Update the keybind
                const actionIndex = keybindActions.findIndex((action) => action.name === bind.name);
                if (actionIndex !== -1) {
                    keybindActions[actionIndex].code = newKey;
                }

                document.removeEventListener("keydown", handleKeyDown);
                bindInput.blur();
            };

            document.addEventListener("keydown", handleKeyDown, {
                once: true
            });
        });

        keybindGroup.appendChild(bindLabel);
        keybindGroup.appendChild(bindInput);
    });

    customizationElements.push(accentGroup, bgGroup, toggleKeyGroup, keybindGroup);

    // Event listeners for accent and background customization
    accentColorInput.oninput = (e) => {
        accent.color = e.target.value;
        applyTheme();
    };

    accentAlphaInput.oninput = (e) => {
        accent.alpha = parseFloat(e.target.value);
        applyTheme();
    };

    bgColorInput.oninput = (e) => {
        bg.color = e.target.value;
        applyTheme();
    };

    bgAlphaInput.oninput = (e) => {
        bg.alpha = parseFloat(e.target.value);
        applyTheme();
    };

    bgBlurInput.oninput = (e) => {
        bg.blur = parseFloat(e.target.value);
        applyTheme();
    };

    toggleKeyInput.addEventListener("focus", () => {
        const handleKeyDown = (e) => {
            e.preventDefault();
            openKey = e.key;
            toggleKeyInput.value = openKey;
            console.log(openKey);
            document.removeEventListener("keydown", handleKeyDown);
            toggleKeyInput.blur();
        };
        document.addEventListener("keydown", handleKeyDown, {
            once: true
        });
    });
}


showCustomizationPage();

function applyTheme() {
    const accentRGBA = hexToRgba(accent.color, accent.alpha);
    const bgRGBA = hexToRgba(bg.color, bg.alpha);
    gui.style.setProperty("--accent-color", accent.color);
    gui.style.setProperty("--accent-gradient", defaultGradient);

    gui.style.background = bgRGBA;
    gui.style.backdropFilter = `blur(${bg.blur}px)`;

    // Apply the gradient to the minimized icon
    const minimizedIcon = document.getElementById("rndAsciiGUI_minimized");
    if (minimizedIcon) {
        minimizedIcon.style.background = `var(--accent-gradient)`;
    }

    // Apply the gradient to the indicator lines
    const indicatorLines = document.querySelectorAll(".indicatorLine");
    indicatorLines.forEach(line => {
        line.style.background = `var(--accent-gradient)`;
    });

    // Apply the gradient to all buttons
    // const buttons = document.querySelectorAll(".rndAsciiBtn");
    //  buttons.forEach(button => {
    //   button.style.background = `var(--accent-gradient)`;
    // });
    // I DIDNT WANT GRADIENT HERE


    const draggableAreas = document.querySelectorAll(".draggable-area");
    draggableAreas.forEach(area => {
        area.style.background = `var(--accent-gradient)`;
    });
}


// Helper function to get a complementary color
function getComplementaryColor(hex) {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    // Calculate complementary color
    const compR = (255 - r).toString(16).padStart(2, '0');
    const compG = (255 - g).toString(16).padStart(2, '0');
    const compB = (255 - b).toString(16).padStart(2, '0');

    return `#${compR}${compG}${compB}`;
}



function hexToRgba(hex, alpha = 1) {
    const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

applyTheme();

const topBar = gui.querySelector("#rndAsciiTopBar");
let dragging = false,
    offsetX = 0,
    offsetY = 0;

topBar.addEventListener("mousedown", (e) => {
    if (e.target.id === "rndAsciiMinBtn") return;
    dragging = true;
    const rect = gui.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    e.stopPropagation();
});

document.addEventListener("mousemove", (e) => {
    if (dragging) {
        gui.style.left = `${e.clientX - offsetX}px`;
        gui.style.top = `${e.clientY - offsetY}px`;
    }
});

document.addEventListener("mouseup", () => {
    dragging = false;
});

gui.querySelector("#rndAsciiMinBtn").onclick = () => {
    gui.style.display = "none";
    isGuiVisible = false;
    showMinimizedIcon();
};

function showMinimizedIcon() {
    minimizedIcon = document.createElement("div");
    minimizedIcon.id = "rndAsciiGUI_minimized";
    minimizedIcon.className = "minimized-icon";
    minimizedIcon.style.left = `${miniPos.left}px`;
    minimizedIcon.style.top = `${miniPos.top}px`;
    minimizedIcon.style.position = "fixed";
    minimizedIcon.style.width = "32px";
    minimizedIcon.style.height = "32px";
    minimizedIcon.style.background = accent.color; // Set the background color here
    minimizedIcon.style.borderRadius = "4px";
    minimizedIcon.style.zIndex = "130";
    minimizedIcon.style.display = "flex";
    minimizedIcon.style.alignItems = "center";
    minimizedIcon.style.justifyContent = "center";
    minimizedIcon.style.cursor = "move";
    minimizedIcon.style.userSelect = "none";
    minimizedIcon.style.pointerEvents = "auto";

    // Create a separate draggable area
    const draggableArea = document.createElement("div");
    draggableArea.className = "draggable-area";
    draggableArea.style.width = "100%";
    draggableArea.style.height = "100%";
    draggableArea.style.position = "absolute";
    draggableArea.style.cursor = "move";
    draggableArea.style.borderRadius = "4px";

    // Create the image element
    const img = document.createElement("img");
    img.src = ICON_URL;
    img.alt = "icon";
    img.style.width = "20px";
    img.style.height = "20px";
    img.style.borderRadius = "4px";
    img.style.pointerEvents = "none";

    minimizedIcon.appendChild(draggableArea);
    minimizedIcon.appendChild(img);
    document.body.appendChild(minimizedIcon);

    let draggingMini = false;
    let clickStart = 0;
    let offsetX = 0;
    let offsetY = 0;

    draggableArea.addEventListener("mousedown", (e) => {
        draggingMini = true;
        const rect = minimizedIcon.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        clickStart = Date.now();
        e.stopPropagation();
    });

    document.addEventListener("mousemove", (e) => {
        if (draggingMini) {
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            minimizedIcon.style.left = `${x}px`;
            minimizedIcon.style.top = `${y}px`;
            miniPos = {
                left: x,
                top: y
            };
        }
    });

    document.addEventListener("mouseup", (e) => {
        if (!draggingMini) return;
        draggingMini = false;
        const moved = Math.abs(e.clientX - (miniPos.left + offsetX)) > 4 ||
            Math.abs(e.clientY - (miniPos.top + offsetY)) > 4;
        const shortClick = (Date.now() - clickStart) < 200;
        if (!moved && shortClick) {
            gui.style.display = "block";
            isGuiVisible = true;
            minimizedIcon.remove();
        }
    });
}


document.addEventListener("keydown", (e) => {
    if (e.key === openKey) {
        if (isGuiVisible) {
            gui.style.display = "none";
            isGuiVisible = false;
            showMinimizedIcon();
            if (shideFuxny.Props.pointerLockWrapper) {
                shideFuxny.Props.pointerLockWrapper.removePointerUnlockRequest("Menu")
            }
        } else {

            gui.style.display = "block";
            isGuiVisible = true;
            if (minimizedIcon) minimizedIcon.remove();
            if (shideFuxny.Props.pointerLockWrapper) {
                shideFuxny.Props.pointerLockWrapper.requestPointerUnlock("Menu")
            }
        }
    }
});


document.addEventListener("keydown", (event) => {
    for (const bind of keybindActions) {
        if (bind.type === "keyboard" && event.code === bind.code) {
            event.preventDefault();
            console.log(`Triggered: ${bind.name} via key ${event.code}`);
            bind.action?.();
        }
    }
});

document.addEventListener("mousedown", (event) => {
    // Handle custom behavior for mouse button 1 (left click)
    if (event.button === 0) {
        if (!triggerBotEnabled && injectedBool && enemyHealthGuiEnabled) {
            const hit = playerEntity.tryHitEntity();
            if (hit?.hitEId != null) {
                if (
                    !playerEntity.breaking &&
                    !inMenu() &&
                    shideFuxny.entities.getState(1, "genericLifeformState").isAlive &&
                    shideFuxny.entities.getState(hit.hitEId, "genericLifeformState") &&
                    shideFuxny.entities.getState(hit.hitEId, "genericLifeformState").isAlive &&
                    r.values(shideFuxny.entityList)?.[1]?.[hit.hitEId].canAttack
                ) {
                    lastClosestId = hit.hitEId
                }
            }
        }
        // Add custom logic here
    }

    // Existing keybind handling
    for (const bind of keybindActions) {
        if (bind.type === "mouse" && event.button === bind.code) {
            event.preventDefault();
            console.log(`Triggered: ${bind.name} via mouse button ${event.button}`);
            bind.action?.();
        }
    }
});

let injectButton = null;

function createPageOneContent() {
    const page = document.getElementById("rndAsciiPage");
    page.innerHTML = "";

    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100%";

    // Inject Button
    injectButton = document.createElement("button");
    injectButton.textContent = injectedBool ? "Injected!" : "Waiting for game...";
    injectButton.className = "rndAsciiBtn gradient-border";
    injectButton.disabled = true;
    Object.assign(injectButton.style, {
        backgroundImage: defaultGradient,
        color: "#fff",
        border: "none",
        padding: "2px 12px",
        fontSize: "14px",
        textShadow: "0 0 6px rgba(255, 255, 255, 0.6)",
        marginBottom: "8px",
        cursor: "pointer",
        width: "150px",
        height: "30px",
        boxSizing: "border-box",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    });

    injectButton.style.textShadow = `
        0 0 5px #fff,
        0 0 10px ${defaultColor},
        0 0 20px ${defaultColor},
        0 0 30px ${defaultColor}
    `;

    injectButton.onmouseenter = () => {
        injectButton.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
    };
    injectButton.onmouseleave = () => {
        injectButton.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    };
    injectButton.onmousedown = () => {
        injectButton.style.transform = "scale(0.98)";
    };
    injectButton.onmouseup = () => {
        injectButton.style.transform = "scale(1)";
    };

    injectButton.onclick = () => {
        try {
            findNoaAndKey();
            if (!shideFuxny.NIGHT) {
                console.warn("❌ Could not find noa");
                injectButton.textContent = "Failed";
                return;
            }
            console.log("Injection completed!");
            injectButton.textContent = "Injected!";
            injectedBool = true;
            applyTheme();
        } catch (err) {
            console.error("Error running findNoaAndKey:", err);
            injectButton.textContent = "Error";
            alert("Error running function. See console.");
        }
    };

    // Shared button style
    const buttonStyle = {
        backgroundColor: "#5865F2",
        color: "#fff",
        border: "none",
        padding: "2px 10px",
        fontSize: "12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        textShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        height: "25px",
        boxSizing: "border-box",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "6px"
    };

    const addHoverHandlers = (btn) => {
        btn.onmouseenter = () => {
            btn.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.3)";
        };
        btn.onmouseleave = () => {
            btn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        };
        btn.onmousedown = () => {
            btn.style.transform = "scale(0.97)";
        };
        btn.onmouseup = () => {
            btn.style.transform = "scale(1)";
        };
    };

    // Discord Button
    const discordButton = document.createElement("button");
    discordButton.textContent = "Discord";
    discordButton.className = "rndAsciiBtn";
    Object.assign(discordButton.style, buttonStyle);
    discordButton.style.textShadow = `
        0 0 5px #fff,
        0 0 10px #5865F2,
        0 0 20px #5865F2,
        0 0 30px #5865F2
    `;
    discordButton.onclick = () => {
        window.open("https://discord.gg/5bPrfFw3", "_blank");
    };
    addHoverHandlers(discordButton);

    // Clear Cookies Button
    const clearCookiesButton = document.createElement("button");
    clearCookiesButton.textContent = "unban";
    clearCookiesButton.className = "rndAsciiBtn";
    Object.assign(clearCookiesButton.style, {
        backgroundColor: "#e74c3c", // Red color you liked
        color: "#fff",
        border: "none",
        padding: "2px 10px",
        fontSize: "12px",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold",
        textShadow: "0 0 4px rgba(0, 0, 0, 0.3)",
        height: "25px",
        boxSizing: "border-box",
        textAlign: "center",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        marginTop: "6px"
    });
    clearCookiesButton.style.textShadow = `
    0 0 5px #fff,
    0 0 10px #e74c3c,
    0 0 20px #e74c3c,
    0 0 30px #e74c3c
`;
    clearCookiesButton.onclick = () => {
        window.onbeforeunload = null; // Disable unload warning
        document.cookie.split(";").forEach(cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        });
        setTimeout(() => location.reload(), 150);
    };

    addHoverHandlers(clearCookiesButton);


    // Append elements
    container.appendChild(injectButton);
    container.appendChild(discordButton);
    container.appendChild(clearCookiesButton);
    page.appendChild(container);

let winDescriptors = Object.getOwnPropertyDescriptors(window);
        let wpName = Object.keys(winDescriptors).find(key => winDescriptors[key]?.set?.toString().includes("++"));
        let wpInstance = window[wpName] = window[wpName];
		
		    // HILOCATOR push
    wpInstance.push([
        [Math.floor(Math.random() * 90000) + 10000], {},
        function(wpRequire) {
            shideFuxny.findModule = (code) => wpRequire(Object.keys(wpRequire.m)[Object.values(wpRequire.m).findIndex(m => m.toString().includes(code))]);
            shideFuxny.Props = Object.values(shideFuxny.findModule("nonBlocksClient:")).find(prop => typeof prop == "object");
            shideFuxny.NIGHT = Object.values(shideFuxny.Props).find(prop => prop?.entities);
            //Credits to, you guessed it wang!
        }
    ]);
    alreadyConnected = (shideFuxny?.Props?.connectedWebsocketUrl !== null);

}


const sidebarButtons = document.querySelectorAll(".rndAsciiBtn");
sidebarButtons.forEach((btn, i) => {
    if (i === 0) {
        btn.onclick = () => {
            sidebarButtons.forEach(b => {
                b.classList.remove("active");
                const ind = b.querySelector(".indicatorLine");
                if (ind) ind.style.display = "none";
            });
            btn.classList.add("active");
            const indicatorLine = btn.querySelector(".indicatorLine");
            if (indicatorLine) indicatorLine.style.display = "block";
            createPageOneContent();
        };
    }
});

createPageOneContent();

function updateButtonUnderline(btn, isEnabled) {
    btn.classList.toggle("active", isEnabled);
    btn.indicatorLine.style.width = isEnabled ? "100%" : "0%";
}




function showTemporaryNotification(message, duration = 1500) {
    const defaultBackGroundTransparency = 0.5;
    const defaultBackGroundBlur = 9;

    // Create a notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.style.position = 'fixed';
        notificationContainer.style.bottom = '20px';
        notificationContainer.style.right = '20px';
        notificationContainer.style.zIndex = '132';
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.textContent = message;

    // Style the notification
    notification.style.padding = '12px';
    notification.style.color = '#fff';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    notification.style.transition = 'opacity 0.5s ease-in-out, transform 0.5s ease-in-out';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.marginBottom = '10px';
    notification.style.backgroundColor = defaultBackGroundColor;
    notification.style.opacity = defaultBackGroundTransparency;

    notification.style.backdropFilter = `blur(${defaultBackGroundBlur}px)`;
    notification.style.border = '2px solid transparent';
    notification.style.borderImage = 'var(--accent-gradient) 1';
    notification.style.backgroundClip = 'padding-box';

    // Add to container
    notificationContainer.appendChild(notification);

    // Trigger the fade-in effect
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);

    // Set up the fade-out and removal
    setTimeout(() => {
        notification.style.opacity = '0';
        //notification.style.transform = 'translateY(-20px)'; I DONT LIKE THIS

        // Remove after transition completes
        setTimeout(() => {
            notification.remove();

            // Remove container if no more notifications
            if (notificationContainer.children.length === 0) {
                notificationContainer.remove();
            }
        }, 500); // Match this with the transition duration
    }, duration);
}



// Update functions
function updateWireframeButton() {
    updateButtonUnderline(wireframeBtn, wireFramesBool);
    if (!isInitializing) showTemporaryNotification('Wireframes toggled: ' + wireFramesBool);
}

function updateHitboxButton() {
    updateButtonUnderline(hitboxBtn, hitBoxEnabled);
    if (!isInitializing) showTemporaryNotification('HitBoxes toggled: ' + hitBoxEnabled);
}


function updateESPButton() {
    updateButtonUnderline(espBtn, espEnabled);
    if (!isInitializing) showTemporaryNotification('ESP toggled: ' + espEnabled);
}

function updateEnemyHealthGuiButton() {
    updateButtonUnderline(enemyHealthGuiBtn, enemyHealthGuiEnabled);
    if (!isInitializing) showTemporaryNotification('Enemy Health Bar: ' + enemyHealthGuiEnabled);
}

function updateBHOPButton() {
    updateButtonUnderline(bhopBtn, bhopEnabled);
    if (!isInitializing) showTemporaryNotification('BHOP toggled: ' + bhopEnabled);
}

function updateBlinkButton() {
    updateButtonUnderline(blinkBtn, blinkState.enabled);
    if (!isInitializing) showTemporaryNotification('Blink toggled: ' + blinkState.enabled);
}

function updateChestESPButton() {
    updateButtonUnderline(chestESPBtn, chestESPEnabled);
    if (!isInitializing) showTemporaryNotification('ChestESP toggled: ' + chestESPEnabled);
}

function updateOreESPButton() {
    updateButtonUnderline(oreESPBtn, oreESPEnabled);
    if (!isInitializing) showTemporaryNotification('OreESP toggled: ' + oreESPEnabled);
}

function updateNameTagsButton() {
    updateButtonUnderline(nameTagBtn, nameTagsEnabled);
    if (!isInitializing) showTemporaryNotification('Name Tags toggled: ' + nameTagsEnabled);
}

function updateKillAuraButton() {
    updateButtonUnderline(killAuraBtn, killAuraEnabled);
    if (!isInitializing) showTemporaryNotification('Kill Aura toggled: ' + killAuraEnabled);
}

function updateSkyboxButton() {
    updateButtonUnderline(skyBoxBtn, isSkyboxHidden);
    if (!isInitializing) showTemporaryNotification('Skybox toggled: ' + isSkyboxHidden);
}

function updateWaterJumpButton() {
    updateButtonUnderline(waterJumpBtn, waterJumpingEnabled);
    if (!isInitializing) showTemporaryNotification('Water Jump toggled: ' + waterJumpingEnabled);
}

function updateWallJumpButton() {
    updateButtonUnderline(wallJumpBtn, wallJumpRunning);
    if (!isInitializing) showTemporaryNotification('Wall Jump toggled: ' + wallJumpRunning);
}

function updateTriggerBotButton() {
    updateButtonUnderline(triggerBotBtn, triggerBotEnabled);
    if (!isInitializing) showTemporaryNotification('Trigger Bot toggled: ' + triggerBotEnabled);
}


function updatePickupReachButton() {
    updateButtonUnderline(pickupReachBtn, pickupReachEnabled);
    if (!isInitializing) showTemporaryNotification('Pickup Reach toggled: ' + pickupReachEnabled);
}

function updateAutoPotButton() {
    updateButtonUnderline(autoPotBtn, autoPotionEnabled);
    if (!isInitializing) showTemporaryNotification('Auto Potion toggled: ' + autoPotionEnabled);
}

function updateKnifeButton() {
    updateButtonUnderline(knifeBtn, bhopKnifeEnabled);
    if (!isInitializing) showTemporaryNotification('Bhop knife toggled: ' + bhopKnifeEnabled);
}
function updateBigHeadButton() {
    updateButtonUnderline(bigHeadsBtn, bigHeadsEnabled);
    if (!isInitializing) showTemporaryNotification('BIGHEADS toggled: ' + bigHeadsEnabled);
}


// Button click handlers
hitboxBtn.onclick = toggleHitBoxes;
waterJumpBtn.onclick = toggleLockPlayerWaterState;
wireframeBtn.onclick = toggleWireframe;
espBtn.onclick = toggleESP;
bhopBtn.onclick = toggleBHOP;
blinkBtn.onclick = toggleBlinkWrapper;
chestESPBtn.onclick = toggleChestESP;
oreESPBtn.onclick = toggleOreESP;
nameTagBtn.onclick = toggleNameTags;
killAuraBtn.onclick = toggleKillAura;
skyBoxBtn.onclick = toggleSkybox;
wallJumpBtn.onclick = toggleWallJumpScript;
triggerBotBtn.onclick = toggleTriggerBot;
pickupReachBtn.onclick = togglePickupReach;
enemyHealthGuiBtn.onclick = toggleEnemyHealthGui;
autoPotBtn.onclick = toggleAutoPot;
knifeBtn.onclick = toggleBhopKnife;
bigHeadsBtn.onclick = toggleBigHeads;


// Initialize button appearances (without showing notifications)
updateHitboxButton();
updateWireframeButton();
updateESPButton();
updateBHOPButton();
updateBlinkButton();
updateChestESPButton();
updateOreESPButton();
updateNameTagsButton();
updateKillAuraButton();
updateSkyboxButton();
updateWaterJumpButton();
updateWallJumpButton();
updateTriggerBotButton();
updatePickupReachButton();
updateEnemyHealthGuiButton();
updateAutoPotButton();
updateKnifeButton();
updateBigHeadButton();

injectedBool = false;
isInitializing = false;


/*
	function retoggleEnabledFeatures() {
	  const toggles = [
	    { enabled: wireFramesBool, btn: wireframeBtn },
	    { enabled: espEnabled, btn: espBtn },
	    { enabled: bhopEnabled, btn: bhopBtn },
	    { enabled: blinkState?.enabled, btn: blinkBtn },
	    { enabled: chestESPEnabled, btn: chestESPBtn },
	    { enabled: oreESPEnabled, btn: oreESPBtn },
	    { enabled: nameTagsEnabled, btn: nameTagBtn },
	    { enabled: killAuraEnabled, btn: killAuraBtn },
	    { enabled: isSkyboxHidden, btn: skyBoxBtn },
	    { enabled: waterJumpingEnabled, btn: waterJumpBtn },
	    { enabled: wallJumpRunning, btn: wallJumpBtn },
	    { enabled: triggerBotEnabled, btn: triggerBotBtn },
	    { enabled: pickupReachEnabled, btn: pickupReachBtn },
		  { enabled: enemyHealthGuiEnabled, btn: enemyHealthGuiBtn },
	  ];

	  for (const { enabled, btn } of toggles) {
	    if (enabled && btn?.click) {
	      btn.click();
	    }
	  }
	}
*/

function waitForElement(selector, callback) {
    if (alreadyConnected) {
        injectButton.disabled = false;
        injectButton.textContent = "Click if game loaded."
        startWebSocketWatcher();
        return;
    }
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            for (const node of mutation.addedNodes) {
                if (node.nodeType === 1 && node.matches(selector)) {
                    observer.disconnect();
                    callback(node);
                    return;
                }
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Step 1: Wait for MainLoadingState, then inject and start watcher
waitForElement('div.MainLoadingState.FullyFancyText', (el) => {
    console.log('Target div appeared:', el);
    injectButton.disabled = false;
    injectButton.click();
    injectButton.textContent = "Injected!"
    startWebSocketWatcher(); // Start watching after injecting
});

function startWebSocketWatcher() {
    let waitingForConnect = true;
    let wasConnected = false;

    const interval = setInterval(() => {
        const url = shideFuxny?.Props?.connectedWebsocketUrl;

        if (waitingForConnect) {
            if (url) {
                console.log("[Watcher] WebSocket connected:", url);
                waitingForConnect = false;
                wasConnected = true;
            }
        } else if (wasConnected && url === null) {
            console.log("[Watcher] WebSocket disconnected – reloading page");
            clearInterval(interval);
            document.getElementById("rndAsciiGUI")?.remove();
            document.getElementById("rndAsciiGUI_minimized")?.remove();
            location.reload();
        }
    }, 2000);
}

//})();