// ==UserScript==
// @name         Zeph Menu Development Build
// @match        *://kour.io/*
// @version      2.1
// @author       Happyjeffery & Rasperiiii
// @icon         https://i.imgur.com/11sYWVM.png
// @description  Speed Hack, Invisibility, Instakill, Set Secondary and Melee Weapons, Profiler Modder (Set Class Kills, Stats Setter), Aimbot
// @run-at       document-start
// @grant        unsafeWindow
// @namespace https://greasyfork.org/users/1369586
// @downloadURL https://update.greasyfork.org/scripts/532842/Zeph%20Menu%20Development%20Build.user.js
// @updateURL https://update.greasyfork.org/scripts/532842/Zeph%20Menu%20Development%20Build.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  /***************************************
   * Performance.now Speed Hack
   ***************************************/
  const originalPerfNow = performance.now.bind(performance);

  function updatePerformanceNow(multiplier) {
    if (multiplier === 1) {
      performance.now = originalPerfNow;
      return;
    }

    performance.now = new Proxy(originalPerfNow, {
      apply(target, thisArg, argArray) {
        try {
          throw new Error();
        } catch (e) {
          if (!e.stack.includes("invoke_")) {
            return target.apply(thisArg, argArray) * multiplier;
          }
        }
        return target.apply(thisArg, argArray);
      },
    });
  }

  updatePerformanceNow(1);

  /***************************************
   * Invisibility + Instakill
   ***************************************/
  const Signatures = {
    damageTaken: "f3 04 c8 02 f5 15 04",
    updateState: "f3 02 fd 02 f4 03 c8",
  };

  function hexOf(buf) {
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join(" ");
  }

  function shouldBlockDamage(ev) {
    return (
      ev.data instanceof ArrayBuffer &&
      hexOf(ev.data).startsWith(Signatures.damageTaken) &&
      kourInstance.config.Invisible
    );
  }

  (function hookWS() {
    const OrigWS = unsafeWindow.WebSocket;
    unsafeWindow.WebSocket = function (...args) {
      const ws = new OrigWS(...args);

      const { addEventListener } = ws;
      ws.addEventListener = (type, fn, opts) =>
        addEventListener.call(
          ws,
          type,
          type === "message" ? (ev) => shouldBlockDamage(ev) || fn(ev) : fn,
          opts
        );

      const protoDesc = Object.getOwnPropertyDescriptor(
        OrigWS.prototype,
        "onmessage"
      );
      Object.defineProperty(ws, "onmessage", {
        set(fn) {
          protoDesc.set.call(this, (ev) => shouldBlockDamage(ev) || fn(ev));
        },
        get() {
          return protoDesc.get.call(this);
        },
      });

      const originalSend = ws.send;
      ws.send = function (data) {
        if (data instanceof ArrayBuffer) {
          const hex = hexOf(data);
          if (
            hex.startsWith(Signatures.updateState) &&
            kourInstance.config.Instakill
          ) {
            for (let i = 0; i < 41; i++) originalSend.call(ws, data);
            return;
          }
        }
        return originalSend.call(ws, data);
      };

      return ws;
    };
    unsafeWindow.WebSocket.prototype = OrigWS.prototype;
  })();

  class Kour {
    constructor() {
      this.config = {
        Invisible: true,
        Instakill: false,
      };
    }
  }
  const kourInstance = new Kour();
  unsafeWindow.kourInstance = kourInstance;

  /***************************************
   * Weapon Changer (Lobby Only!)
   ***************************************/
  const weapons = [
    { name: "AK-47", id: "0" },
    { name: "Deagle", id: "1" },
    { name: "AWP", id: "2" },
    { name: "Bayonet", id: "3" },
    { name: "Uzi", id: "4" },
    { name: "PKM", id: "5" },
    { name: "Revolver", id: "6" },
    { name: "RPG", id: "7" },
    { name: "USPS", id: "8" },
    { name: "MP5", id: "9" },
    { name: "Shotgun", id: "10" },
    { name: "Glock", id: "11" },
    { name: "Karambit", id: "12" },
    { name: "Knife", id: "13" },
    { name: "Scar", id: "14" },
    { name: "Minigun", id: "15" },
    { name: "Famas", id: "16" },
    { name: "Vector", id: "17" },
    { name: "Flamethrower", id: "18" },
    { name: "Kar98k", id: "19" },
    { name: "M4A4", id: "20" },
    { name: "Tec-9", id: "21" },
    { name: "CZ", id: "22" },
    { name: "Berretta92fs", id: "23" },
    { name: "AK-109", id: "24" },
    { name: "P90", id: "25" },
    { name: "Thompson", id: "26" },
    { name: "UMP45", id: "27" },
    { name: "XM1014", id: "28" },
    { name: "Butterfly", id: "29" },
    { name: "Laser Gun", id: "30" },
    { name: "Bomb", id: "31" },
    { name: "Smoke Grenade", id: "32" },
    { name: "Molotov", id: "33" },
    { name: "Grenade", id: "34" },
    { name: "Flashbang", id: "35" },
    { name: "Glizzy", id: "36" },
    { name: "Axe", id: "37" },
    { name: "Bare Fists", id: "38" },
  ];

  function setSecondaryWeapon(weaponID) {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .child("overrideWeaponIndexes1")
      .set(weaponID);
    showUserDetails(
      firebase.auth().currentUser.email,
      firebase.auth().currentUser
    );
  }

  function setMeleeWeapon(weaponID) {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .child("overrideWeaponIndexes2")
      .set(weaponID);
    showUserDetails(
      firebase.auth().currentUser.email,
      firebase.auth().currentUser
    );
  }

  /***************************************
   * Class Kills
   ***************************************/
  const classMap = {
    Soldier: "class0kills",
    Hitman: "class1kills",
    Gunner: "class2kills",
    Heavy: "class3kills",
    Rocketeer: "class4kills",
    Agent: "class5kills",
    Brawler: "class6kills",
    Investor: "class7kills",
    Assassin: "class8kills",
    Juggernaut: "class9kills",
    Recon: "class10kills",
    Pyro: "class11kills",
    Rayblader: "class15kills",
  };

  function setClassKills() {
    const existingDialog = document.getElementById("classSelectionDialog");
    if (existingDialog) existingDialog.remove();

    const classSelectionDialog = document.createElement("div");
    classSelectionDialog.id = "classSelectionDialog";
    Object.assign(classSelectionDialog.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#5a2d72",
      color: "#fff",
      padding: "20px",
      zIndex: "10002",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      width: "300px",
      maxHeight: "400px",
      overflowY: "auto",
      cursor: "move",
      userSelect: "none",
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "5px";
    closeBtn.style.right = "5px";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener("click", () => classSelectionDialog.remove());
    classSelectionDialog.appendChild(closeBtn);

    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "Select Class";
    dialogTitle.style.fontWeight = "bold";
    dialogTitle.style.fontSize = "18px";
    dialogTitle.style.marginBottom = "15px";
    dialogTitle.style.textAlign = "center";
    classSelectionDialog.appendChild(dialogTitle);

    const classButtonContainer = document.createElement("div");
    classButtonContainer.style.display = "grid";
    classButtonContainer.style.gridTemplateColumns = "repeat(2, 1fr)";
    classButtonContainer.style.gap = "8px";

    Object.keys(classMap).forEach((className) => {
      const classBtn = document.createElement("button");
      classBtn.textContent = className;
      Object.assign(classBtn.style, {
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "5px",
        fontSize: "13px",
        color: "#fff",
        transition: "background-color 0.3s",
      });

      classBtn.addEventListener(
        "mouseover",
        () => (classBtn.style.backgroundColor = "#a74cbf")
      );
      classBtn.addEventListener(
        "mouseout",
        () => (classBtn.style.backgroundColor = "#9b3e9f")
      );

      classBtn.addEventListener("click", () => {
        const killsValue = prompt(
          `Enter kill count for ${className}:`,
          "10000"
        );
        if (killsValue === null) return;

        const numKills = Number(killsValue);
        if (isNaN(numKills)) {
          alert("Please enter a valid number!");
          return;
        }

        const dbField = classMap[className];
        updateClassKills(dbField, numKills);
        classSelectionDialog.remove();
      });

      classButtonContainer.appendChild(classBtn);
    });

    classSelectionDialog.appendChild(classButtonContainer);

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel";
    Object.assign(cancelBtn.style, {
      width: "100%",
      marginTop: "15px",
      padding: "8px",
      cursor: "pointer",
      backgroundColor: "#444",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
    });
    cancelBtn.addEventListener("click", () => classSelectionDialog.remove());
    classSelectionDialog.appendChild(cancelBtn);

    let pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
    classSelectionDialog.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
        return;
      }

      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      classSelectionDialog.style.top =
        classSelectionDialog.offsetTop - pos2 + "px";
      classSelectionDialog.style.left =
        classSelectionDialog.offsetLeft - pos1 + "px";
      classSelectionDialog.style.transform = "none";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }

    document.body.appendChild(classSelectionDialog);
  }

  function updateClassKills(classField, killCount) {
    if (!firebase.auth().currentUser) {
      console.log("[Zeph Menu] User is not logged in");
      return;
    }

    const updateData = {};
    updateData[classField] = killCount;

    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .update(updateData)
      .then(() => {
        showUserDetails(
          firebase.auth().currentUser.email,
          firebase.auth().currentUser
        );
        console.log(
          `[Zeph Menu] ${classField} successfully updated to ${killCount}`
        );
        showUserDetails(
          firebase.auth().currentUser.email,
          firebase.auth().currentUser
        );
      })
      .catch((err) => {
        console.error(`[Zeph Menu] Failed to update ${classField}:`, err);
      });
  }

  /***************************************
   * Stats Changer
   ***************************************/
  function updateKDStats(kills, deaths, score, elo) {
    if (!firebase.auth().currentUser) {
      console.log("[Zeph Menu] User is not logged in");
      alert("login first!");
      return;
    }

    const updateData = {
      totalKills: kills,
      totalDeaths: deaths,
      totalScore: score,
      elo: elo,
    };

    firebase
      .database()
      .ref(`users/${firebase.auth().currentUser.uid}`)
      .update(updateData)
      .then(() => {
        showUserDetails(
          firebase.auth().currentUser.email,
          firebase.auth().currentUser
        );
        console.log(
          `[Zeph Menu] Stats updated to Kills:${kills}/Deaths:${deaths}/XP:${score}/Elo:${elo}`
        );
      })
      .catch((err) => {
        console.error("[Zeph Menu] Failed to update stats:", err);
      });
  }

  function setKDStats() {
    const kills = prompt("Enter new Total Kills:", "1337");
    if (kills === null) return;
    const parsedKills = Number(kills);

    const deaths = prompt("Enter new Total Deaths:", "420");
    if (deaths === null) return;
    const parsedDeaths = Number(deaths);

    const score = prompt("Enter new Total Score:", "10000000");
    if (score === null) return;
    const parsedScore = Number(score);

    const elo = prompt("Enter new Elo:", "30000");
    if (elo === null) return;
    const parsedElo = Number(elo);

    if (isNaN(parsedKills) || isNaN(parsedDeaths)) {
      alert("Please enter valid numbers for kills and deaths.");
      return;
    }

    updateKDStats(parsedKills, parsedDeaths, parsedScore, parsedElo);
  }


  /***************************************
   * ESP
   ***************************************/

  let gl = null;
  const MIN_VERTICES = 1450;
  const MAX_VERTICES = 1490;

  window.espEnabled = true;

  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "p") {
      window.espEnabled = !window.espEnabled;
      const espCheckbox = document.getElementById("espToggle");
      if (espCheckbox) espCheckbox.checked = window.espEnabled;
      console.log(`[Zeph ESP] Toggled ${window.espEnabled ? "ON" : "OFF"}`);
    }
  });

  const WebGL = WebGL2RenderingContext.prototype;
  HTMLCanvasElement.prototype.getContext = new Proxy(
  HTMLCanvasElement.prototype.getContext,
  {
    apply(target, thisArgs, args) {
      if (args[1]) {
        args[1].preserveDrawingBuffer = true;
      }
      return Reflect.apply(...arguments);
    },
  }
);


  const drawHandler = {
    apply(target, thisArgs, args) {
      const program = thisArgs.getParameter(thisArgs.CURRENT_PROGRAM);
      if (!program.uniforms) {
        program.uniforms = {
          vertexCount: thisArgs.getUniformLocation(program, "vertexCount"),
          espToggle: thisArgs.getUniformLocation(program, "espToggle"),
        };
      }
      const count = args[1];
      if (program.uniforms.vertexCount) {
        thisArgs.uniform1f(program.uniforms.vertexCount, count);
      }
      if (program.uniforms.espToggle) {
        thisArgs.uniform1f(program.uniforms.espToggle, window.espEnabled ? 1.0 : 0.0);
      }
      gl = thisArgs;
      return Reflect.apply(...arguments);
    },
  };

  WebGL.drawElements = new Proxy(WebGL.drawElements, drawHandler);
  WebGL.drawElementsInstanced = new Proxy(
    WebGL.drawElementsInstanced,
    drawHandler
  );

  WebGL.shaderSource = new Proxy(WebGL.shaderSource, {
    apply(target, thisArgs, args) {
      let [shader, src] = args;
      if (src.includes("gl_Position")) {
        src = src.replace(
          /void\s+main\s*\(\s*\)\s*\{/,
          `uniform float vertexCount;\nuniform float espToggle;\nout float vVertexCount;\nvoid main() {\nvVertexCount = vertexCount;\n`
        );
        src = src.replace(
          /(gl_Position\s*=.+;)/,
          `$1\nif (espToggle > 0.5 && vertexCount >= ${MIN_VERTICES}.0 && vertexCount <= ${MAX_VERTICES}.0) {\n    gl_Position.z = 0.01 + gl_Position.z * 0.1;\n}`
        );
      }
      if (src.includes("SV_Target0")) {
        src = src
          .replace(
            /void\s+main\s*\(\s*\)\s*\{/,
            `uniform float espToggle;\nin float vVertexCount;\nvoid main() {`
          )
          .replace(
            /return;/,
            `if(espToggle > 0.5 && vVertexCount >= ${MIN_VERTICES}.0 && vVertexCount <= ${MAX_VERTICES}.0 && SV_Target0.a > 0.99) {\n    SV_Target0 = vec4(0.0, 0.0, 1.0, 1.0);\n}\nreturn;`
          );
      }
      args[1] = src;
      return Reflect.apply(...arguments);
    },
  });


  /***************************************
   * Color Aimbot
   ***************************************/

  const settings = {
    aimbotEnabled: true,
    aimbotSpeed: 1.0,
    aimbotTriggerButton: ['left', 'right']
  };

  let mouseButtons = { left: false, right: false};

  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "u") {
      settings.aimbotEnabled = !settings.aimbotEnabled;
    }
  });

  document.addEventListener("mousedown", (e) => {
      if (e.button === 0) mouseButtons.left = true;
      if (e.button === 2) mouseButtons.right = true;
  });
  document.addEventListener("mouseup", (e) => {
      if (e.button === 0) mouseButtons.left = false;
      if (e.button === 2) mouseButtons.right = false;
  });

  function isTriggerPressed() {
      return settings.aimbotTriggerButton.some(btn => mouseButtons[btn]);
  }



  function isTargetPixel(r, g, b, a) {
    return r < 60 && g < 60 && b > 220 && a > 220;
}

  function updateAimbot() {
    if (!settings.aimbotEnabled || !gl || !gl.canvas || !gl.readPixels || !isTriggerPressed()) return;

    const width = Math.min(150, gl.canvas?.width || 0);
    const height = Math.min(150, gl.canvas?.height || 0);
    if (width < 10 || height < 10) {
      return;
    }

    const centerX = gl.canvas.width / 2;
    const centerY = gl.canvas.height / 2;
    const startX = Math.floor(centerX - width / 2);
    const startY = Math.floor(centerY - height / 2);
    const pixels = new Uint8Array(width * height * 4);

    gl.readPixels(startX, startY, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

    let closestDist = Infinity;
    let bestDX = 0;
    let bestDY = 0;
    let targetCount = 0;

    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
      if (isTargetPixel(r, g, b, a)) {
        targetCount++;
        const index = i / 4;
        const x = index % width;
        const y = Math.floor(index / width);
        const dx = startX + x - centerX;
        const dy = -(startY + y - centerY);
        const dist = Math.hypot(dx, dy);
        if (dist < closestDist) {
          closestDist = dist;
          bestDX = dx;
          bestDY = dy;
        }
      }
    }

    if (closestDist < Infinity) {
      const factor = settings.aimbotSpeed;
      window.dispatchEvent(new MouseEvent("mousemove", {
        movementX: bestDX * factor,
        movementY: bestDY * factor
      }));
    }
  }

  setInterval(updateAimbot, 0);

  /***************************************
   * KP Generator
   ***************************************/

let kpGeneratorInterval = null;
let kpGeneratorActive = false;

function toggleKpGenerator() {
    kpGeneratorActive = !kpGeneratorActive;

    const kpGeneratorBtn = document.getElementById("kpGeneratorBtn");
    if (kpGeneratorBtn) {
        kpGeneratorBtn.textContent = kpGeneratorActive ? "Turn off KP Generator" : "Turn on KP Generator";
        if (kpGeneratorActive) {
            kpGeneratorBtn.style.background = "linear-gradient(135deg, #ff4d4d 0%, #e01b1b 100%)";
        } else {
            kpGeneratorBtn.style.background = "linear-gradient(135deg, #7d5b94 0%, #4a6bab 100%)";
        }
    }

    if (kpGeneratorActive) {
        showKpGeneratorInstructions();

        kpGeneratorInterval = setInterval(() => {
            if (!firebase.auth().currentUser) return;

            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/mission-1claimDate`).remove();
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/mission-1claimed`).remove();
            firebase.database().ref(`users/${firebase.auth().currentUser.uid}/mission-1kills`).set("5000");
            showUserDetails(firebase.auth().currentUser.email, firebase.auth().currentUser);
        }, 5000);
    } else {
        if (kpGeneratorInterval) {
            clearInterval(kpGeneratorInterval);
            kpGeneratorInterval = null;
        }
    }
}


  /***************************************
   * Styles
   ***************************************/

function showKpGeneratorInstructions() {
    const existingDialog = document.getElementById("kpGeneratorInstructions");
    if (existingDialog) existingDialog.remove();

    const instructionsDialog = document.createElement("div");
    instructionsDialog.id = "kpGeneratorInstructions";
    Object.assign(instructionsDialog.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#3a1a52",
        color: "#fff",
        padding: "20px",
        zIndex: "10002",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        borderRadius: "12px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.4)",
        width: "340px",
        maxHeight: "450px",
        overflowY: "auto",
        cursor: "move",
        userSelect: "none",
        border: "2px solid #9b3e9f",
    });

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.background = "none";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.fontSize = "20px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontWeight = "bold";
    closeBtn.addEventListener("click", () => instructionsDialog.remove());
    instructionsDialog.appendChild(closeBtn);

    const dialogTitle = document.createElement("div");
    dialogTitle.textContent = "✨ KP Generator Instructions ✨";
    dialogTitle.style.fontWeight = "bold";
    dialogTitle.style.fontSize = "20px";
    dialogTitle.style.marginBottom = "15px";
    dialogTitle.style.textAlign = "center";
    dialogTitle.style.textShadow = "0 0 5px rgba(255,255,255,0.3)";
    instructionsDialog.appendChild(dialogTitle);

    const instructionsContent = document.createElement("div");
    instructionsContent.innerHTML = `
        <div style="margin-bottom: 15px; background-color: #4a2063; padding: 15px; border-radius: 8px; border-left: 4px solid #b64fc8;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #ffd700;">
                🚀 How to Use:
            </div>
            <ol style="margin-top: 5px; padding-left: 25px; line-height: 1.5;">
                <li style="margin-bottom: 8px;">📋 Go to the missions section and claim the Christmas one</li>
                <li style="margin-bottom: 8px;">⏱️ Close it and wait 5 seconds</li>
                <li style="margin-bottom: 8px;">🔄 Go back</li>
                <li style="margin-bottom: 8px;">🔁 Rinse and Repeat</li>
            </ol>
        </div>
        <div style="margin-top: 15px; background-color: #4a2063; padding: 15px; border-radius: 8px; border-left: 4px solid #ffa500;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #ffd700;">
                ⚠️ Important Notes:
            </div>
            <ul style="margin-top: 5px; padding-left: 25px; line-height: 1.5;">
                <li style="margin-bottom: 8px;">⏳ You may need to wait a minute or two for it to begin adding, give it a few tries. Please be patient.</li>
                <li style="margin-bottom: 8px;">🔄 Sometimes the KP on the top will start going back or looks like it gets stuck, reload the page and it will add again as this is not with the code but with the game.</li>
            </ul>
        </div>
    `;
    instructionsDialog.appendChild(instructionsContent);

    const okBtn = document.createElement("button");
    okBtn.textContent = "Got it!";
    Object.assign(okBtn.style, {
        width: "100%",
        marginTop: "20px",
        padding: "10px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "8px",
        color: "#fff",
        fontWeight: "bold",
        fontSize: "15px",
        transition: "all 0.2s ease",
    });
    okBtn.addEventListener("mouseover", () => {
        okBtn.style.backgroundColor = "#b64fc8";
        okBtn.style.transform = "scale(1.02)";
    });
    okBtn.addEventListener("mouseout", () => {
        okBtn.style.backgroundColor = "#9b3e9f";
        okBtn.style.transform = "scale(1)";
    });
    okBtn.addEventListener("click", () => instructionsDialog.remove());
    instructionsDialog.appendChild(okBtn);

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    instructionsDialog.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        if (e.target.tagName === "BUTTON" || e.target.tagName === "INPUT") {
            return;
        }

        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        instructionsDialog.style.top = instructionsDialog.offsetTop - pos2 + "px";
        instructionsDialog.style.left = instructionsDialog.offsetLeft - pos1 + "px";
        instructionsDialog.style.transform = "none";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    document.body.appendChild(instructionsDialog);
}

function createUI() {
    const menu = document.createElement("div");
    menu.id = "zephMenu";
    Object.assign(menu.style, {
        position: "fixed",
        top: "50px",
        right: "50px",
        width: "250px",
        backgroundColor: "#5a2d72",
        color: "#fff",
        padding: "15px",
        zIndex: "10000",
        fontFamily: "Arial, sans-serif",
        fontSize: "16px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        display: "none",
        transition: "all 0.3s ease-in-out",
    });

    const secondaryWeaponMenu = createWeaponMenu("Secondary Weapon", false);
    const meleeWeaponMenu = createWeaponMenu("Melee Weapon", true);

    const profileModderMenu = document.createElement("div");
    profileModderMenu.id = "zephProfileModderMenu";
    Object.assign(profileModderMenu.style, {
        position: "fixed",
        top: "50px",
        right: "320px",
        width: "200px",
        backgroundColor: "#5a2d72",
        color: "#fff",
        padding: "15px",
        zIndex: "10000",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
        display: "none",
        transition: "all 0.3s ease-in-out",
    });

    const profileHeader = document.createElement("div");
    profileHeader.textContent = "Profile Modder";
    profileHeader.style.textAlign = "center";
    profileHeader.style.fontWeight = "bold";
    profileHeader.style.marginBottom = "10px";
    profileModderMenu.appendChild(profileHeader);

    const setClassKillsBtn = document.createElement("button");
    setClassKillsBtn.textContent = "Set Class Kills";
    Object.assign(setClassKillsBtn.style, {
        width: "100%",
        margin: "5px 0",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "background-color 0.3s",
    });
    setClassKillsBtn.addEventListener("click", setClassKills);
    setClassKillsBtn.addEventListener("mouseover", () => (setClassKillsBtn.style.backgroundColor = "#a74cbf"));
    setClassKillsBtn.addEventListener("mouseout", () => (setClassKillsBtn.style.backgroundColor = "#9b3e9f"));
    profileModderMenu.appendChild(setClassKillsBtn);

    const setKDStatsBtn = document.createElement("button");
    setKDStatsBtn.textContent = "Change Stats";
    Object.assign(setKDStatsBtn.style, {
        width: "100%",
        margin: "5px 0",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "background-color 0.3s",
    });
    setKDStatsBtn.addEventListener("click", setKDStats);
    setKDStatsBtn.addEventListener("mouseover", () => (setKDStatsBtn.style.backgroundColor = "#a74cbf"));
    setKDStatsBtn.addEventListener("mouseout", () => (setKDStatsBtn.style.backgroundColor = "#9b3e9f"));
    profileModderMenu.appendChild(setKDStatsBtn);

    const headerContainer = document.createElement("div");
    headerContainer.style.marginBottom = "15px";
    headerContainer.style.position = "relative";

    const madeByText = document.createElement("div");
    madeByText.textContent = "Made by: Happyjeffery & Rasperiiii";
    madeByText.style.fontSize = "10px";
    madeByText.style.textAlign = "center";
    madeByText.style.marginBottom = "5px";
    madeByText.style.fontWeight = "bold";
    madeByText.style.letterSpacing = "0.5px";

    let hue = 0;
    function updateRGB() {
        hue = (hue + 1) % 360;
        madeByText.style.color = `hsl(${hue}, 100%, 70%)`;
        requestAnimationFrame(updateRGB);
    }
    updateRGB();

    headerContainer.appendChild(madeByText);

    const titleContainer = document.createElement("div");
    titleContainer.style.display = "flex";
    titleContainer.style.alignItems = "center";
    titleContainer.style.justifyContent = "center";
    titleContainer.style.gap = "8px";

    const header = document.createElement("div");
    header.textContent = "Zeph Menu";
    header.style.fontWeight = "bold";
    header.style.fontSize = "20px";

    const discordLogo = document.createElement("img");
    discordLogo.src = "https://i.ibb.co/sJV6y56H/Zeph-Menu-Discordlogo.png";
    discordLogo.alt = "Discord Logo";
    discordLogo.style.width = "22px";
    discordLogo.style.height = "22px";
    discordLogo.style.cursor = "pointer";
    discordLogo.style.transition = "all 0.2s ease";
    discordLogo.style.borderRadius = "4px";
    discordLogo.addEventListener("click", () => window.open("https://discord.gg/3XCAwXdRUh", "_blank"));
    discordLogo.addEventListener("mouseover", () => {
        discordLogo.style.transform = "scale(1.1) rotate(2deg)";
        discordLogo.style.filter = "brightness(1.2) drop-shadow(0 0 2px rgba(255,255,255,0.3))";
    });
    discordLogo.addEventListener("mouseout", () => {
        discordLogo.style.transform = "scale(1) rotate(0deg)";
        discordLogo.style.filter = "none";
    });

    titleContainer.appendChild(header);
    titleContainer.appendChild(discordLogo);
    headerContainer.appendChild(titleContainer);
    menu.appendChild(headerContainer);

    const kpGeneratorBtn = document.createElement("button");
    kpGeneratorBtn.id = "kpGeneratorBtn";
    kpGeneratorBtn.textContent = "Turn on KP Generator";
    kpGeneratorBtn.style.fontWeight = "bold";
    Object.assign(kpGeneratorBtn.style, {
        width: "100%",
        margin: "8px 0",
        padding: "10px",
        cursor: "pointer",
        background: "linear-gradient(135deg, #7d5b94 0%, #4a6bab 100%)",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "all 0.3s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    });
    kpGeneratorBtn.addEventListener("click", toggleKpGenerator);
    kpGeneratorBtn.addEventListener("mouseover", () => {
        kpGeneratorBtn.style.background = "linear-gradient(135deg, #8e6aa5 0%, #5a7bc1 100%)";
        kpGeneratorBtn.style.transform = "scale(1.03)";
        kpGeneratorBtn.style.boxShadow = "0 4px 8px rgba(0,0,0,0.3)";
    });
    kpGeneratorBtn.addEventListener("mouseout", () => {
        kpGeneratorBtn.style.background = "linear-gradient(135deg, #7d5b94 0%, #4a6bab 100%)";
        kpGeneratorBtn.style.transform = "scale(1)";
        kpGeneratorBtn.style.boxShadow = "0 2px 4px rgba(0,0,0,0.2)";
    });
    menu.appendChild(kpGeneratorBtn);

    const profileModderBtn = document.createElement("button");
    profileModderBtn.textContent = "Profile Modder";
    Object.assign(profileModderBtn.style, {
        width: "100%",
        margin: "8px 0",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "background-color 0.3s",
    });
    profileModderBtn.addEventListener("click", () => {
        profileModderMenu.style.display = profileModderMenu.style.display === "none" ? "block" : "none";
        secondaryWeaponMenu.style.display = "none";
        meleeWeaponMenu.style.display = "none";
    });
    profileModderBtn.addEventListener("mouseover", () => (profileModderBtn.style.backgroundColor = "#a74cbf"));
    profileModderBtn.addEventListener("mouseout", () => (profileModderBtn.style.backgroundColor = "#9b3e9f"));
    menu.appendChild(profileModderBtn);

    const secondaryWeaponBtn = document.createElement("button");
    secondaryWeaponBtn.textContent = "Set Secondary Weapon";
    Object.assign(secondaryWeaponBtn.style, {
        width: "100%",
        margin: "8px 0",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#53277E",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "background-color 0.3s",
    });
    secondaryWeaponBtn.addEventListener("click", () => {
        secondaryWeaponMenu.style.display = secondaryWeaponMenu.style.display === "none" ? "block" : "none";
        meleeWeaponMenu.style.display = "none";
        profileModderMenu.style.display = "none";
    });
    secondaryWeaponBtn.addEventListener("mouseover", () => (secondaryWeaponBtn.style.backgroundColor = "#6a359c"));
    secondaryWeaponBtn.addEventListener("mouseout", () => (secondaryWeaponBtn.style.backgroundColor = "#53277E"));
    menu.appendChild(secondaryWeaponBtn);

    const meleeWeaponBtn = document.createElement("button");
    meleeWeaponBtn.textContent = "Set Melee Weapon";
    Object.assign(meleeWeaponBtn.style, {
        width: "100%",
        margin: "8px 0",
        padding: "8px",
        cursor: "pointer",
        backgroundColor: "#53277E",
        border: "none",
        borderRadius: "5px",
        fontSize: "14px",
        color: "#fff",
        transition: "background-color 0.3s",
    });
    meleeWeaponBtn.addEventListener("click", () => {
        meleeWeaponMenu.style.display = meleeWeaponMenu.style.display === "none" ? "block" : "none";
        secondaryWeaponMenu.style.display = "none";
        profileModderMenu.style.display = "none";
    });
    meleeWeaponBtn.addEventListener("mouseover", () => (meleeWeaponBtn.style.backgroundColor = "#6a359c"));
    meleeWeaponBtn.addEventListener("mouseout", () => (meleeWeaponBtn.style.backgroundColor = "#53277E"));
    menu.appendChild(meleeWeaponBtn);

    const speedContainer = document.createElement("div");
    speedContainer.style.margin = "15px 0";
    const speedLabel = document.createElement("label");
    speedLabel.textContent = "Speed Hack Multiplier: ";
    speedContainer.appendChild(speedLabel);
    const speedValue = document.createElement("span");
    speedValue.textContent = "1x";
    speedContainer.appendChild(speedValue);
    const speedSlider = document.createElement("input");
    speedSlider.type = "range";
    speedSlider.min = "1";
    speedSlider.max = "6";
    speedSlider.step = "0.5";
    speedSlider.value = "1";
    speedSlider.style.width = "100%";
    speedSlider.addEventListener("input", function() {
        let multiplier = parseFloat(speedSlider.value);
        speedValue.textContent = multiplier.toFixed(1) + "x";
        updatePerformanceNow(multiplier);
    });
    speedContainer.appendChild(speedSlider);
    menu.appendChild(speedContainer);

    const invisContainer = document.createElement("div");
    const invisCheckbox = document.createElement("input");
    invisCheckbox.type = "checkbox";
    invisCheckbox.id = "invisToggle";
    invisCheckbox.checked = kourInstance.config.Invisible;
    invisCheckbox.addEventListener("change", function() {
        kourInstance.config.Invisible = this.checked;
        console.log("Invisibility set to " + this.checked);
    });
    const invisLabel = document.createElement("label");
    invisLabel.htmlFor = "invisToggle";
    invisLabel.textContent = " Invisible";
    invisContainer.appendChild(invisCheckbox);
    invisContainer.appendChild(invisLabel);
    menu.appendChild(invisContainer);

    const espContainer = document.createElement("div");
    const espCheckbox = document.createElement("input");
    espCheckbox.type = "checkbox";
    espCheckbox.id = "espToggle";
    espCheckbox.checked = window.espEnabled || false;
    espCheckbox.addEventListener("change", function() {
        window.espEnabled = this.checked;
        console.log("[Zeph ESP] Toggled " + (this.checked ? "ON" : "OFF"));
    });
    const espLabel = document.createElement("label");
    espLabel.htmlFor = "espToggle";
    espLabel.textContent = " ESP";
    espContainer.appendChild(espCheckbox);
    espContainer.appendChild(espLabel);
    menu.appendChild(espContainer);

    const aimbotContainer = document.createElement("div");
    const aimbotCheckbox = document.createElement("input");
    aimbotCheckbox.type = "checkbox";
    aimbotCheckbox.id = "aimbotToggle";
    aimbotCheckbox.checked = settings.aimbotEnabled;
    aimbotCheckbox.addEventListener("change", function() {
        settings.aimbotEnabled = this.checked;
        console.log("aimbot set to " + this.checked);
    });
    const aimbotLabel = document.createElement("label");
    aimbotLabel.htmlFor = "aimbotToggle";
    aimbotLabel.textContent = " Aimbot";
    aimbotContainer.appendChild(aimbotCheckbox);
    aimbotContainer.appendChild(aimbotLabel);
    menu.appendChild(aimbotContainer);

    const style = document.createElement("style");
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { opacity: 0; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes flashRed {
            0% { color: #FF3C3C; }
            50% { color: #FFFFFF; }
            100% { color: #FF3C3C; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(menu);
    document.body.appendChild(secondaryWeaponMenu);
    document.body.appendChild(meleeWeaponMenu);
    document.body.appendChild(profileModderMenu);
}


  function createWeaponMenu(title, isMelee) {
    const weaponMenu = document.createElement("div");
    weaponMenu.id = `zeph${isMelee ? "Melee" : "Secondary"}WeaponMenu`;
    Object.assign(weaponMenu.style, {
      position: "fixed",
      top: "50px",
      right: "320px",
      width: "250px",
      maxHeight: "400px",
      overflowY: "auto",
      backgroundColor: "#5a2d72",
      color: "#fff",
      padding: "15px",
      zIndex: "10000",
      fontFamily: "Arial, sans-serif",
      fontSize: "14px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      display: "none",
      transition: "all 0.3s ease-in-out",
    });

    const weaponHeader = document.createElement("div");
    weaponHeader.textContent = title;
    weaponHeader.style.textAlign = "center";
    weaponHeader.style.fontWeight = "bold";
    weaponHeader.style.marginBottom = "10px";
    weaponMenu.appendChild(weaponHeader);

    weapons.forEach((weapon) => {
      const btn = document.createElement("button");
      btn.textContent = `${weapon.name} (${weapon.id})`;
      Object.assign(btn.style, {
        width: "100%",
        margin: "5px 0",
        padding: "5px",
        cursor: "pointer",
        backgroundColor: "#9b3e9f",
        border: "none",
        borderRadius: "5px",
        fontSize: "12px",
        color: "#fff",
        transition: "background-color 0.3s",
      });
      btn.addEventListener("click", () => {
        if (isMelee) {
          setMeleeWeapon(weapon.id);
        } else {
          setSecondaryWeapon(weapon.id);
        }
        weaponMenu.style.display = "none";
      });
      btn.addEventListener(
        "mouseover",
        () => (btn.style.backgroundColor = "#a74cbf")
      );
      btn.addEventListener(
        "mouseout",
        () => (btn.style.backgroundColor = "#9b3e9f")
      );
      weaponMenu.appendChild(btn);
    });

    return weaponMenu;
  }

  /***************************************
   * Keybinds
   ***************************************/

  document.addEventListener("keydown", function (e) {
    if (e.key === "o" && !e.target.matches("input, textarea")) {
      const menu = document.getElementById("zephMenu");
      if (menu) {
        const isClosing = menu.style.display !== "none";
        menu.style.display = isClosing ? "none" : "block";
        if (isClosing) {
          document.getElementById("zephSecondaryWeaponMenu").style.display =
            "none";
          document.getElementById("zephMeleeWeaponMenu").style.display = "none";
          document.getElementById("zephProfileModderMenu").style.display =
            "none";
        }
      }
    }
  });

  window.addEventListener("load", createUI);
})();