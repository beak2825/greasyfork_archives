// ==UserScript==
// @name         Cryzen.io For Low-End PC's
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  cryzen.io best performance for low-end pc's
// @match        https://cryzen.io/*
// @grant        none
// @author        Whoami
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514527/Cryzenio%20For%20Low-End%20PC%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/514527/Cryzenio%20For%20Low-End%20PC%27s.meta.js
// ==/UserScript==

(function() {
    const createGraphicsMenu = () => {
        const eyeIcon = document.createElement("div");
        eyeIcon.style.position = "fixed";
        eyeIcon.style.top = "10px";
        eyeIcon.style.right = "10px";
        eyeIcon.style.width = "30px";
        eyeIcon.style.height = "30px";
        eyeIcon.style.background = "url('eye-icon.png') no-repeat center/cover";
        eyeIcon.style.cursor = "pointer";
        eyeIcon.style.zIndex = "9999";
        document.body.appendChild(eyeIcon);

        const graphicsMenu = document.createElement("div");
        graphicsMenu.style.position = "fixed";
        graphicsMenu.style.top = "50px";
        graphicsMenu.style.right = "10px";
        graphicsMenu.style.width = "120px";
        graphicsMenu.style.backgroundColor = "#333";
        graphicsMenu.style.color = "#fff";
        graphicsMenu.style.padding = "10px";
        graphicsMenu.style.display = "none";
        graphicsMenu.style.flexDirection = "column";
        graphicsMenu.style.zIndex = "10000";
        ["Super-Low", "Very Low", "Low", "Medium"].forEach((quality) => {
            const button = document.createElement("button");
            button.innerText = quality;
            button.style.backgroundColor = "#555";
            button.style.border = "none";
            button.style.color = "#fff";
            button.style.margin = "5px 0";
            button.style.cursor = "pointer";
            button.onclick = () => setGraphicsQuality(quality);
            graphicsMenu.appendChild(button);
        });
        document.body.appendChild(graphicsMenu);
        eyeIcon.onclick = () => {
            graphicsMenu.style.display = graphicsMenu.style.display === "none" ? "block" : "none";
        };
    };

    const setGraphicsQuality = (quality) => {
        if (quality === "Super-Low") {
            minimizeGraphics();
        } else if (quality === "Very Low") {
            minimalGraphics();
        } else if (quality === "Low") {
            lowGraphics();
        } else if (quality === "Medium") {
            mediumGraphics();
        }
    };

    const minimizeGraphics = () => {
        removeSkybox();
        removeWeapons();
        simplifyPlayers();
        document.body.style.overflow = "hidden";
    };

    const minimalGraphics = () => {
        removeSkybox();
        simplifyPlayers();
        reduceDetail();
    };

    const lowGraphics = () => {
        reduceDetail();
    };

    const mediumGraphics = () => {
        applyMediumSettings();
    };

    const removeSkybox = () => {
        const skybox = document.querySelector(".skybox");
        if (skybox) skybox.style.display = "none";
    };

    const removeWeapons = () => {
        const weapons = document.querySelectorAll(".weapon-model");
        weapons.forEach(weapon => weapon.remove());
    };

    const simplifyPlayers = () => {
        const players = document.querySelectorAll(".player-model");
        players.forEach(player => {
            player.style.width = "20px";
            player.style.height = "20px";
            player.style.backgroundColor = "red";
            player.style.border = "1px solid black";
            const line = document.createElement("div");
            line.style.position = "absolute";
            line.style.width = "1px";
            line.style.height = `${calculateDistance(player, getPlayerPosition())}px`;
            line.style.backgroundColor = "red";
            line.style.transform = `rotate(${calculateAngle(player, getPlayerPosition())}deg)`;
            document.body.appendChild(line);
        });
    };

    const reduceDetail = () => {
        const mapElements = document.querySelectorAll(".map-element");
        mapElements.forEach(element => {
            element.style.backgroundColor = "gray";
            element.style.opacity = "0.5";
            element.style.border = "none";
        });
    };

    const applyMediumSettings = () => {
        const mapElements = document.querySelectorAll(".map-element");
        mapElements.forEach(element => {
            element.style.opacity = "0.8";
        });
    };

    const calculateDistance = (pos1, pos2) => {
        return Math.sqrt(Math.pow(pos2.x - pos1.x, 2) + Math.pow(pos2.y - pos1.y, 2));
    };

    const calculateAngle = (pos1, pos2) => {
        return Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * (180 / Math.PI);
    };

    const getPlayerPosition = () => {
        return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    };

    const gameLoop = () => {
        loadChunksNearby();
        minimizeGraphics();
        requestAnimationFrame(gameLoop);
    };

    const loadChunksNearby = () => {
        const renderDistance = 200;
        const chunks = document.querySelectorAll(".map-chunk");
        chunks.forEach(chunk => {
            const chunkPos = getChunkPosition(chunk);
            const distance = calculateDistance(getPlayerPosition(), chunkPos);
            chunk.style.visibility = distance < renderDistance ? "visible" : "hidden";
        });
    };

    const getChunkPosition = (chunk) => {
        return { x: chunk.offsetLeft, y: chunk.offsetTop };
    };

    createGraphicsMenu();
    requestAnimationFrame(gameLoop);
})();
