// ==UserScript==
// @name Glxy Client
// @author Chpsterz
// @description Survev.io multipurpose client
// @version 0.0.6
// @match *://survev.io/*
// @match http://66.179.254.36/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/1411859
// @downloadURL https://update.greasyfork.org/scripts/520954/Glxy%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/520954/Glxy%20Client.meta.js
// ==/UserScript==

class GameMod {
    constructor() {
      this.lastFrameTime = performance.now();
      this.frameCount = 0;
      this.fps = 0;
      this.kills = 0;
      this.isFpsUncapped = this.getFpsUncappedFromLocalStorage();
      this.isFpsVisible = true;
      this.isPingVisible = true;
      this.isKillsVisible = true;
      this.isMenuVisible = true;
  
      this.pingCounter = null;
      this.initPingCounter();
  
      this.setAnimationFrameCallback();
  
      this.initFpsCounter();
      this.initKillsCounter();
      this.initMenu();
      this.loadBackgroundFromLocalStorage();
      this.loadLocalStorage();
      this.startUpdateLoop();
      this.setupWeaponBorderHandler();
      this.setupKeyListeners();
    }
  
    setAnimationFrameCallback() {
      this.animationFrameCallback = this.isFpsUncapped
        ? (callback) => setTimeout(callback, 1)
        : window.requestAnimationFrame.bind(window);
    }
  
    initFpsCounter() {
      this.fpsCounter = document.createElement("div");
      this.fpsCounter.id = "fpsCounter";
      Object.assign(this.fpsCounter.style, {
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: "5px 10px",
        marginTop: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: "10000",
        pointerEvents: "none",
      });
  
      const uiTopLeft = document.getElementById("ui-top-left");
      if (uiTopLeft) {
        uiTopLeft.appendChild(this.fpsCounter);
      }
  
      this.updateFpsVisibility();
    }
  
    initPingCounter() {
      this.pingCounter = document.createElement("div");
      this.pingCounter.id = "pingCounter";
      Object.assign(this.pingCounter.style, {
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: "5px 10px",
        marginTop: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: "10000",
        pointerEvents: "none",
      });
  
      const uiTopLeft = document.getElementById("ui-top-left");
      if (uiTopLeft) {
        uiTopLeft.appendChild(this.pingCounter);
      }
      this.updatePingVisibility();
    }
  
    initKillsCounter() {
      this.killsCounter = document.createElement("div");
      this.killsCounter.id = "killsCounter";
      Object.assign(this.killsCounter.style, {
        color: "white",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        padding: "5px 10px",
        marginTop: "10px",
        borderRadius: "5px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px",
        zIndex: "10000",
        pointerEvents: "none",
      });
  
      const uiTopLeft = document.getElementById("ui-top-left");
      if (uiTopLeft) {
        uiTopLeft.appendChild(this.killsCounter);
      }
      this.updateKillsVisibility();
    }
  
    updateFpsVisibility() {
      if (this.fpsCounter) {
        this.fpsCounter.style.display = this.isFpsVisible ? "block" : "none";
        this.fpsCounter.style.backgroundColor = this.isFpsVisible
          ? "rgba(0, 0, 0, 0.2)"
          : "transparent";
      }
    }
  
    updatePingVisibility() {
      if (this.pingCounter) {
        this.pingCounter.style.display = this.isPingVisible ? "block" : "none";
      }
    }
  
    updateKillsVisibility() {
      if (this.killsCounter) {
        this.killsCounter.style.display = this.isKillsVisible ? "block" : "none";
        this.killsCounter.style.backgroundColor = this.isKillsVisible
          ? "rgba(0, 0, 0, 0.2)"
          : "transparent";
      }
    }
  
    toggleFpsDisplay() {
      this.isFpsVisible = !this.isFpsVisible;
      this.updateFpsVisibility();
    }
  
    togglePingDisplay() {
      this.isPingVisible = !this.isPingVisible;
      this.updatePingVisibility();
    }
  
    toggleKillsDisplay() {
      this.isKillsVisible = !this.isKillsVisible;
      this.updateKillsVisibility();
    }
  
    getKills() {
      const killElement = document.querySelector(
        ".ui-player-kills.js-ui-player-kills",
      );
      if (killElement) {
        const kills = parseInt(killElement.textContent, 10);
        return isNaN(kills) ? 0 : kills;
      }
      return 0;
    }
  
    getRegionFromLocalStorage() {
      let config = localStorage.getItem("surviv_config");
      if (config) {
        let configObject = JSON.parse(config);
        return configObject.region;
      }
      return null;
    }
  
    startPingTest() {
      const currentUrl = window.location.href;
      const isSpecialUrl = /\/#\w+/.test(currentUrl);
  
      const teamSelectElement = document.getElementById("team-server-select");
      const mainSelectElement = document.getElementById("server-select-main");
  
      const region =
        isSpecialUrl && teamSelectElement
          ? teamSelectElement.value
          : mainSelectElement
            ? mainSelectElement.value
            : null;
  
      if (region && region !== this.currentServer) {
        this.currentServer = region;
        this.resetPing();
  
        const servers = [
          { region: "NA", url: "usr.mathsiscoolfun.com:8001" },
          { region: "EU", url: "eur.mathsiscoolfun.com:8001" },
          { region: "Asia", url: "asr.mathsiscoolfun.com:8001" },
          { region: "SA", url: "sa.mathsiscoolfun.com:8001" },
        ];
  
        const selectedServer = servers.find(
          (server) => region.toUpperCase() === server.region.toUpperCase(),
        );
  
        if (selectedServer) {
          this.pingTest = new PingTest(selectedServer);
          this.pingTest.startPingTest();
        } else {
          this.resetPing();
        }
      }
    }
  
    resetPing() {
      if (this.pingTest && this.pingTest.test.ws) {
        this.pingTest.test.ws.close();
        this.pingTest.test.ws = null;
      }
      this.pingTest = null;
    }
  
    getFpsUncappedFromLocalStorage() {
      const savedConfig = localStorage.getItem("userSettings");
      if (savedConfig) {
        const configObject = JSON.parse(savedConfig);
        return configObject.isFpsUncapped || false;
      }
      return false;
    }
  
    saveFpsUncappedToLocalStorage() {
      let config = JSON.parse(localStorage.getItem("userSettings")) || {};
      config.isFpsUncapped = this.isFpsUncapped;
      localStorage.setItem("userSettings", JSON.stringify(config));
    }
  
    saveBackgroundToLocalStorage(url) {
      localStorage.setItem("lastBackgroundUrl", url);
    }
  
    saveBackgroundToLocalStorage(image) {
      if (typeof image === "string") {
        localStorage.setItem("lastBackgroundType", "url");
        localStorage.setItem("lastBackgroundValue", image);
      } else {
        localStorage.setItem("lastBackgroundType", "local");
        const reader = new FileReader();
        reader.onload = () => {
          localStorage.setItem("lastBackgroundValue", reader.result);
        };
        reader.readAsDataURL(image);
      }
    }
  
    loadBackgroundFromLocalStorage() {
      const backgroundType = localStorage.getItem("lastBackgroundType");
      const backgroundValue = localStorage.getItem("lastBackgroundValue");
  
      const backgroundElement = document.getElementById("background");
      if (backgroundElement && backgroundType && backgroundValue) {
        if (backgroundType === "url") {
          backgroundElement.style.backgroundImage = `url(${backgroundValue})`;
        } else if (backgroundType === "local") {
          backgroundElement.style.backgroundImage = `url(${backgroundValue})`;
        }
      }
    }
  
    toggleFpsUncap() {
      this.isFpsUncapped = !this.isFpsUncapped;
      this.setAnimationFrameCallback();
      this.saveFpsUncappedToLocalStorage();
    }
  
    updateHealthBars() {
      const healthBars = document.querySelectorAll("#ui-health-container");
      healthBars.forEach((container) => {
        const bar = container.querySelector("#ui-health-actual");
        if (bar) {
          const width = Math.round(parseFloat(bar.style.width));
          let percentageText = container.querySelector(".health-text");
  
          if (!percentageText) {
            percentageText = document.createElement("span");
            percentageText.classList.add("health-text");
            Object.assign(percentageText.style, {
              width: "100%",
              textAlign: "center",
              marginTop: "5px",
              color: "#333",
              fontSize: "20px",
              fontWeight: "bold",
              position: "absolute",
              zIndex: "10",
            });
            container.appendChild(percentageText);
          }
  
          percentageText.textContent = `${width}%`;
        }
      });
    }
  
    updateBoostBars() {
      const boostCounter = document.querySelector("#ui-boost-counter");
      if (boostCounter) {
        const boostBars = boostCounter.querySelectorAll(
          ".ui-boost-base .ui-bar-inner",
        );
  
        let totalBoost = 0;
        const weights = [25, 25, 40, 10];
  
        boostBars.forEach((bar, index) => {
          const width = parseFloat(bar.style.width);
          if (!isNaN(width)) {
            totalBoost += width * (weights[index] / 100);
          }
        });
  
        const averageBoost = Math.round(totalBoost);
        let boostDisplay = boostCounter.querySelector(".boost-display");
  
        if (!boostDisplay) {
          boostDisplay = document.createElement("div");
          boostDisplay.classList.add("boost-display");
          Object.assign(boostDisplay.style, {
            position: "absolute",
            bottom: "75px",
            right: "335px",
            color: "#FF901A",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            padding: "5px 10px",
            borderRadius: "5px",
            fontFamily: "Arial, sans-serif",
            fontSize: "14px",
            zIndex: "10",
            textAlign: "center",
          });
  
          boostCounter.appendChild(boostDisplay);
        }
  
        boostDisplay.textContent = `AD: ${averageBoost}%`;
      }
    }
  
    setupWeaponBorderHandler() {
      const weaponContainers = Array.from(
        document.getElementsByClassName("ui-weapon-switch"),
      );
      weaponContainers.forEach((container) => {
        if (container.id === "ui-weapon-id-4") {
          container.style.border = "3px solid #2f4032";
        } else {
          container.style.border = "3px solid #FFFFFF";
        }
      });
  
      const weaponNames = Array.from(
        document.getElementsByClassName("ui-weapon-name"),
      );
      weaponNames.forEach((weaponNameElement) => {
        const weaponContainer = weaponNameElement.closest(".ui-weapon-switch");
        const observer = new MutationObserver(() => {
          const weaponName = weaponNameElement.textContent.trim();
          let border = "#FFFFFF";
  
          switch (weaponName.toUpperCase()) {
            case "CZ-3A1":
            case "G18C":
            case "M9":
            case "M93R":
            case "MAC-10":
            case "MP5":
            case "P30L":
            case "DUAL P30L":
            case "UMP9":
            case "VECTOR":
            case "VSS":
            case "FLAMETHROWER":
              border = "#FFAE00";
              break;
  
            case "AK-47":
            case "OT-38":
            case "OTS-38":
            case "M39 EMR":
            case "DP-28":
            case "MOSIN-NAGANT":
            case "SCAR-H":
            case "SV-98":
            case "M1 GARAND":
            case "PKP PECHENEG":
            case "AN-94":
            case "BAR M1918":
            case "BLR 81":
            case "SVD-63":
            case "M134":
            case "WATER GUN":
              border = "#007FFF";
              break;
  
            case "FAMAS":
            case "M416":
            case "M249":
            case "QBB-97":
            case "MK 12 SPR":
            case "M4A1-S":
            case "SCOUT ELITE":
            case "L86A2":
              border = "#0f690d";
              break;
  
            case "M870":
            case "MP220":
            case "SAIGA-12":
            case "SPAS-12":
            case "USAS-12":
            case "SUPER 90":
            case "LASR GUN":
            case "M1100":
              border = "#FF0000";
              break;
  
            case "DEAGLE 50":
            case "RAINBOW BLASTER":
              border = "#000000";
              break;
  
            case "AWM-S":
            case "MK 20 SSR":
              border = "#808000";
              break;
  
            case "FLARE GUN":
              border = "#FF4500";
              break;
  
            case "MODEL 94":
            case "PEACEMAKER":
            case "VECTOR (.45 ACP)":
            case "M1911":
            case "M1A1":
              border = "#800080";
              break;
  
            case "M79":
              border = "#008080";
              break;
  
            case "POTATO CANNON":
            case "SPUD GUN":
              border = "#A52A2A";
              break;
  
            case "HEART CANNON":
              border = "#FFC0CB";
              break;
  
            default:
              border = "#FFFFFF";
              break;
          }
  
          if (weaponContainer.id !== "ui-weapon-id-4") {
            weaponContainer.style.border = `3px solid ${border}`;
          }
        });
  
        observer.observe(weaponNameElement, {
          childList: true,
          characterData: true,
          subtree: true,
        });
      });
    }
  
    updateUiElements() {
      const currentUrl = window.location.href;
  
      const isSpecialUrl = /\/#\w+/.test(currentUrl);
  
      const playerOptions = document.getElementById("player-options");
      const teamMenuContents = document.getElementById("team-menu-contents");
      const startMenuContainer = document.querySelector(
        "#start-menu .play-button-container",
      );
  
      if (!playerOptions) return;
  
      if (
        isSpecialUrl &&
        teamMenuContents &&
        playerOptions.parentNode !== teamMenuContents
      ) {
        teamMenuContents.appendChild(playerOptions);
      } else if (
        !isSpecialUrl &&
        startMenuContainer &&
        playerOptions.parentNode !== startMenuContainer
      ) {
        const firstChild = startMenuContainer.firstChild;
        startMenuContainer.insertBefore(playerOptions, firstChild);
      }
      const teamMenu = document.getElementById("team-menu");
      if (teamMenu) {
        teamMenu.style.height = "355px";
      }
      const menuBlocks = document.querySelectorAll(".menu-block");
      menuBlocks.forEach((block) => {
        block.style.maxHeight = "355px";
      });
      //scalable?
    }
  
    updateMenuButtonText() {
      const hideButton = document.getElementById("hideMenuButton");
      hideButton.textContent = this.isMenuVisible
        ? "Hide Menu [P]"
        : "Show Menu [P]";
    }
  
    setupKeyListeners() {
      document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "p") {
          this.toggleMenuVisibility();
        }
      });
    }
    //menu
    initMenu() {
      const menu = document.createElement("div");
      menu.id = "menu";
      Object.assign(menu.style, {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: "15px",
        marginLeft: "15px",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.6)",
        zIndex: "10001",
        width: "250px",
        fontFamily: "Arial, sans-serif",
        color: "#fff",
        maxHeight: "400px",
        overflowY: "auto",
      });
  
      const title = document.createElement("h2");
      title.textContent = "Glxy Client";
      title.style.margin = "0 0 10px";
      title.style.textAlign = "center";
      title.style.fontSize = "18px";
      title.style.color = "#FFAE00";
      menu.appendChild(title);
  
      const updateLocalStorage = () => {
        localStorage.setItem(
          "userSettings",
          JSON.stringify({
            isFpsVisible: this.isFpsVisible,
            isPingVisible: this.isPingVisible,
            isFpsUncapped: this.isFpsUncapped,
            isKillsVisible: this.isKillsVisible,
          }),
        );
      };
  
      this.loadLocalStorage();
  
      const fpsToggle = document.createElement("button");
      fpsToggle.textContent = `Show FPS ${this.isFpsVisible ? "✅" : "❌"}`;
      Object.assign(fpsToggle.style, {
        backgroundColor: this.isFpsVisible ? "#4CAF50" : "#FF0000",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      fpsToggle.onclick = () => {
        this.isFpsVisible = !this.isFpsVisible;
        this.updateFpsVisibility();
        fpsToggle.textContent = `Show FPS ${this.isFpsVisible ? "✅" : "❌"}`;
        fpsToggle.style.backgroundColor = this.isFpsVisible
          ? "#4CAF50"
          : "#FF0000";
        updateLocalStorage();
      };
      menu.appendChild(fpsToggle);
  
      const pingToggle = document.createElement("button");
      pingToggle.textContent = `Show Ping ${this.isPingVisible ? "✅" : "❌"}`;
      Object.assign(pingToggle.style, {
        backgroundColor: this.isPingVisible ? "#4CAF50" : "#FF0000",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      pingToggle.onclick = () => {
        this.isPingVisible = !this.isPingVisible;
        this.updatePingVisibility();
        pingToggle.textContent = `Show Ping ${this.isPingVisible ? "✅" : "❌"}`;
        pingToggle.style.backgroundColor = this.isPingVisible
          ? "#4CAF50"
          : "#FF0000";
        updateLocalStorage();
      };
      menu.appendChild(pingToggle);
  
      const killsToggle = document.createElement("button");
      killsToggle.textContent = `Show Kills ${this.isKillsVisible ? "✅" : "❌"}`;
      Object.assign(killsToggle.style, {
        backgroundColor: this.isKillsVisible ? "#4CAF50" : "#FF0000",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      killsToggle.onclick = () => {
        this.isKillsVisible = !this.isKillsVisible;
        this.updateKillsVisibility();
        killsToggle.textContent = `Show Kills ${this.isKillsVisible ? "✅" : "❌"}`;
        killsToggle.style.backgroundColor = this.isKillsVisible
          ? "#4CAF50"
          : "#FF0000";
        updateLocalStorage();
      };
      menu.appendChild(killsToggle);
  
      const uncapFpsToggle = document.createElement("button");
      uncapFpsToggle.textContent = `Uncap FPS ${this.isFpsUncapped ? "✅" : "❌"}`;
      Object.assign(uncapFpsToggle.style, {
        backgroundColor: this.isFpsUncapped ? "#4CAF50" : "#FF0000",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      uncapFpsToggle.onclick = () => {
        this.toggleFpsUncap();
        uncapFpsToggle.textContent = `Uncap FPS ${this.isFpsUncapped ? "✅" : "❌"}`;
        uncapFpsToggle.style.backgroundColor = this.isFpsUncapped
          ? "#4CAF50"
          : "#FF0000";
        updateLocalStorage();
      };
      menu.appendChild(uncapFpsToggle);
  
      const hideShowToggle = document.createElement("button");
      hideShowToggle.textContent = `👀 Hide/Show Menu [P]`;
      Object.assign(hideShowToggle.style, {
        backgroundColor: "#6F42C1",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      hideShowToggle.onclick = () => this.toggleMenuVisibility();
      menu.appendChild(hideShowToggle);
  
      const backgroundToggle = document.createElement("button");
      backgroundToggle.textContent = `🎨 Change Background`;
      Object.assign(backgroundToggle.style, {
        backgroundColor: "#007BFF",
        border: "none",
        color: "#fff",
        padding: "10px",
        borderRadius: "5px",
        width: "100%",
        marginBottom: "10px",
        fontSize: "14px",
        cursor: "pointer",
      });
      backgroundToggle.onclick = () => {
        const backgroundElement = document.getElementById("background");
        if (!backgroundElement) {
          alert("Element with id 'background' not found.");
          return;
        }
        const choice = prompt(
          "Enter '1' to provide a URL or '2' to upload a local image:",
        );
  
        if (choice === "1") {
          const newBackgroundUrl = prompt(
            "Enter the URL of the new background image:",
          );
          if (newBackgroundUrl) {
            backgroundElement.style.backgroundImage = `url(${newBackgroundUrl})`;
            this.saveBackgroundToLocalStorage(newBackgroundUrl);
            alert("Background updated successfully!");
          }
        } else if (choice === "2") {
          const fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = "image/*";
          fileInput.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                backgroundElement.style.backgroundImage = `url(${reader.result})`;
                this.saveBackgroundToLocalStorage(file);
                alert("Background updated successfully!");
              };
              reader.readAsDataURL(file);
            }
          };
          fileInput.click();
        }
      };
  
      menu.appendChild(backgroundToggle);
  
      window.onload = () => {
        const savedBackground = localStorage.getItem("backgroundImage");
        if (savedBackground) {
          const backgroundElement = document.getElementById("background");
          if (backgroundElement) {
            backgroundElement.style.backgroundImage = `url(${savedBackground})`;
          }
        }
      };
  
      const startRowTop = document.getElementById("start-row-top");
      if (startRowTop) {
        startRowTop.appendChild(menu);
      }
  
      this.menu = menu;
    }
  
    loadLocalStorage() {
      const savedSettings = JSON.parse(localStorage.getItem("userSettings"));
      if (savedSettings) {
        this.isFpsVisible = savedSettings.isFpsVisible ?? this.isFpsVisible;
        this.isPingVisible = savedSettings.isPingVisible ?? this.isPingVisible;
        this.isFpsUncapped = savedSettings.isFpsUncapped ?? this.isFpsUncapped;
        this.isKillsVisible = savedSettings.isKillsVisible ?? this.isKillsVisible;
      }
  
      this.updateKillsVisibility();
      this.updateFpsVisibility();
      this.updatePingVisibility();
    }
  
    toggleMenuVisibility() {
      const isVisible = this.menu.style.display !== "none";
      this.menu.style.display = isVisible ? "none" : "block";
    }
  
    startUpdateLoop() {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
  
      this.frameCount++;
  
      if (delta >= 1000) {
        this.fps = Math.round((this.frameCount * 1000) / delta);
        this.frameCount = 0;
        this.lastFrameTime = now;
  
        this.kills = this.getKills();
  
        if (this.isFpsVisible && this.fpsCounter) {
          this.fpsCounter.textContent = `FPS: ${this.fps}`;
        }
  
        if (this.isKillsVisible && this.killsCounter) {
          this.killsCounter.textContent = `Kills: ${this.kills}`;
        }
  
        if (this.isPingVisible && this.pingCounter && this.pingTest) {
          const result = this.pingTest.getPingResult();
          this.pingCounter.textContent = `PING: ${result.ping} ms`;
        }
      }
  
      this.startPingTest();
      this.animationFrameCallback(() => this.startUpdateLoop());
      this.updateUiElements();
      this.updateBoostBars();
      this.updateHealthBars();
    }
  }
  
  class PingTest {
    constructor(selectedServer) {
      this.ptcDataBuf = new ArrayBuffer(1);
      this.test = {
        region: selectedServer.region,
        url: `wss://${selectedServer.url}/ptc`,
        ping: 9999,
        ws: null,
        sendTime: 0,
        retryCount: 0,
      };
    }
  
    startPingTest() {
      if (!this.test.ws) {
        const ws = new WebSocket(this.test.url);
        ws.binaryType = "arraybuffer";
  
        ws.onopen = () => {
          this.sendPing();
          this.test.retryCount = 0;
        };
  
        ws.onmessage = () => {
          const elapsed = (Date.now() - this.test.sendTime) / 1e3;
          this.test.ping = Math.round(elapsed * 1000);
          this.test.retryCount = 0;
          setTimeout(() => this.sendPing(), 200);
        };
  
        ws.onerror = () => {
          this.test.ping = "Error";
          this.test.retryCount++;
          if (this.test.retryCount < 5) {
            setTimeout(() => this.startPingTest(), 2000);
          } else {
            this.test.ws.close();
            this.test.ws = null;
          }
        };
  
        ws.onclose = () => {
          this.test.ws = null;
        };
  
        this.test.ws = ws;
      }
    }
  
    sendPing() {
      if (this.test.ws.readyState === WebSocket.OPEN) {
        this.test.sendTime = Date.now();
        this.test.ws.send(this.ptcDataBuf);
      }
    }
  
    getPingResult() {
      return {
        region: this.test.region,
        ping: this.test.ping,
      };
    }
  }
  
  const gameMod = new GameMod();