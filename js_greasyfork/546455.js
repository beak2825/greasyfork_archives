// ==UserScript==
// @name         SkySongs Slide-out Dashboard
// @namespace    https://skyskraber.dk
// @version      3.3
// @description  Slide-out skuffe til SkySongs med kontrolpanel. Hele indholdet vises kun når skuffen er åben. Lukket = kun håndtag synligt.
// @author       Kevin
// @license      GNU General Public License v3.0
// @match        https://www.skyskraber.dk/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/546455/SkySongs%20Slide-out%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/546455/SkySongs%20Slide-out%20Dashboard.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // INIT SONGS FRA localStorage
    // =========================
    window.songs = JSON.parse(localStorage.getItem("skySongs") || "{}");

    function saveSongs() {
        localStorage.setItem("skySongs", JSON.stringify(window.songs));
    }

    function addSong(title, rawLyrics) {
        const cleaned = rawLyrics.replace(/\[.*?\]/g, '');
        const lines = cleaned.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        window.songs[title.toLowerCase()] = lines;
        saveSongs();
        console.log(`🎵 Sang tilføjet: "${title}" (${lines.length} linjer)`);
    }

    window.addNewSongPrompt = function() {
        const title = prompt("Indtast sangtitel:");
        if (!title) return alert("Ingen titel indtastet!");
        const lyrics = prompt("Indsæt sangteksten:");
        if (!lyrics) return alert("Ingen lyrics indsat!");
        addSong(title, lyrics);
        alert(`Sangen "${title}" er nu klar til brug med !syng ${title}`);
    };

    window.deleteSongFromList = function() {
        const titles = Object.keys(window.songs);
        if (titles.length === 0) return alert("Ingen sange gemt!");
        const selection = prompt("Gemte sange:\n" + titles.map((t, i) => `${i+1}. ${t}`).join("\n") + "\n\nIndtast nummeret på sangen der skal slettes:");
        const index = parseInt(selection) - 1;
        if (isNaN(index) || index < 0 || index >= titles.length) return alert("Ugyldigt valg!");
        const title = titles[index];
        if (confirm(`Er du sikker på, at du vil slette "${title}"?`)) {
            delete window.songs[title];
            saveSongs();
            alert(`✅ Sangen "${title}" er slettet!`);
        }
    };

    function splitMessageWithHyphen(line, maxLength = 100) {
        const result = [];
        let words = line.split(/(\s+)/);
        let current = "";

        for (let word of words) {
            if ((current + word).length > maxLength) {
                if (word.trim().length > maxLength) {
                    let remainingWord = word;
                    while (remainingWord.length > 0) {
                        let spaceLeft = maxLength - current.length - 1;
                        if (spaceLeft <= 0) {
                            result.push(current + "-");
                            current = "";
                            spaceLeft = maxLength - 1;
                        }
                        let part = remainingWord.slice(0, spaceLeft);
                        remainingWord = remainingWord.slice(spaceLeft);
                        current += part;
                        if (remainingWord.length > 0) {
                            result.push(current + "-");
                            current = "";
                        }
                    }
                } else {
                    if (current.trim().length > 0) result.push(current.trim());
                    current = word;
                }
            } else {
                current += word;
            }
        }

        if (current.trim().length > 0) result.push(current.trim());
        return result;
    }

    function getDelayForChunk(chunk) {
        const baseDelay = 600;
        const extraPerChar = 15;
        let delay = baseDelay + (chunk.length * extraPerChar);
        if (chunk.includes("-")) delay += 300;
        delay += parseInt(localStorage.getItem("skySongsLinePause") || 3000);
        return delay;
    }

    window.sangSkyState = { playing: false, paused: false, stopped: false };

    // =========================
    // SLIDE-OUT DASHBOARD
    // =========================
    const drawer = document.createElement("div");
    drawer.style.position = "fixed";
    drawer.style.left = "-460px"; // starter skjult
    drawer.style.top = "603px";   // Y-position
    drawer.style.width = "450px";
    drawer.style.background = "#111";
    drawer.style.color = "#fff";
    drawer.style.padding = "10px";
    drawer.style.borderRadius = "0 8px 8px 0";
    drawer.style.zIndex = "9999";
    drawer.style.fontFamily = "Arial, sans-serif";
    drawer.style.transition = "left 0.3s ease";

    const drawerHandle = document.createElement("div");
    drawerHandle.innerText = "🎶";
    drawerHandle.style.position = "absolute";
    drawerHandle.style.right = "-30px";
    drawerHandle.style.top = "0";
    drawerHandle.style.width = "30px";
    drawerHandle.style.height = "40px";
    drawerHandle.style.background = "#3b82f6";
    drawerHandle.style.color = "#fff";
    drawerHandle.style.display = "flex";
    drawerHandle.style.alignItems = "center";
    drawerHandle.style.justifyContent = "center";
    drawerHandle.style.cursor = "pointer";
    drawerHandle.style.borderRadius = "0 6px 6px 0";
    drawerHandle.style.fontSize = "18px";

    let drawerOpen = localStorage.getItem("skySongsDrawerOpen") === "true";
    drawer.style.left = drawerOpen ? "0px" : "-460px";

    const contentWrap = document.createElement("div");
    contentWrap.style.display = drawerOpen ? "flex" : "none";
    contentWrap.style.flexDirection = "column";
    contentWrap.style.alignItems = "center";
    contentWrap.style.gap = "8px";

    drawerHandle.addEventListener("click", () => {
        drawerOpen = !drawerOpen;
        localStorage.setItem("skySongsDrawerOpen", drawerOpen);
        drawer.style.left = drawerOpen ? "0px" : "-460px";
        contentWrap.style.display = drawerOpen ? "flex" : "none";
    });

    drawer.appendChild(drawerHandle);

    // =========================
    // DASHBOARD INDHOLD
    // =========================
    const title = document.createElement("h3");
    title.innerText = "SkySong af brugeren Kevin";
    title.style.margin = "0";
    title.style.padding = "4px";
    title.style.fontSize = "16px";
    title.style.fontWeight = "bold";
    title.style.textAlign = "center";
    contentWrap.appendChild(title);

    const buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";
    buttonContainer.style.gap = "6px";

    function createBtn(label, color, onClick) {
        const btn = document.createElement("button");
        btn.innerHTML = label;
        btn.style.padding = "6px 12px";
        btn.style.background = color;
        btn.style.color = "#fff";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "14px";
        btn.addEventListener("click", onClick);
        return btn;
    }

    buttonContainer.appendChild(createBtn("📃", "#3b82f6", () => window.showSongList()));
    buttonContainer.appendChild(createBtn("➕", "#22c55e", () => window.addNewSongPrompt()));
    buttonContainer.appendChild(createBtn("🗑", "#ef4444", () => window.deleteSongFromList()));
    buttonContainer.appendChild(createBtn("⏸", "#facc15", () => window.sangSkyState.paused = true));
    buttonContainer.appendChild(createBtn("▶", "#16a34a", () => window.sangSkyState.paused = false));
    buttonContainer.appendChild(createBtn("⏹", "#dc2626", () => window.sangSkyState.stopped = true));

    contentWrap.appendChild(buttonContainer);

    const sliderWrap = document.createElement("div");
    sliderWrap.style.display = "flex";
    sliderWrap.style.alignItems = "center";
    sliderWrap.style.gap = "6px";
    sliderWrap.style.fontSize = "12px";

    const slider = document.createElement("input");
    slider.type = "range";
    slider.min = "500";
    slider.max = "5000";
    slider.step = "100";
    slider.value = localStorage.getItem("skySongsLinePause") || 3000;
    slider.style.width = "200px";

    const sliderVal = document.createElement("span");
    sliderVal.textContent = slider.value + " ms";

    slider.addEventListener("input", () => {
        sliderVal.textContent = slider.value + " ms";
        localStorage.setItem("skySongsLinePause", slider.value);
    });

    sliderWrap.appendChild(document.createTextNode("Pause:"));
    sliderWrap.appendChild(slider);
    sliderWrap.appendChild(sliderVal);

    contentWrap.appendChild(sliderWrap);

    const progressOuter = document.createElement("div");
    progressOuter.style.width = "100%";
    progressOuter.style.height = "12px";
    progressOuter.style.background = "#333";
    progressOuter.style.borderRadius = "6px";
    progressOuter.style.overflow = "hidden";

    const progressBar = document.createElement("div");
    progressBar.style.width = "0%";
    progressBar.style.height = "100%";
    progressBar.style.background = "#3b82f6";
    progressBar.style.textAlign = "center";
    progressBar.style.fontSize = "10px";
    progressBar.style.lineHeight = "12px";
    progressBar.style.color = "#fff";
    progressBar.style.transition = "width 0.2s";

    progressOuter.appendChild(progressBar);
    contentWrap.appendChild(progressOuter);

    drawer.appendChild(contentWrap);
    document.body.appendChild(drawer);

    // =========================
    // VIS SANGE
    // =========================
    window.showSongList = function() {
        const titles = Object.keys(window.songs);
        if (titles.length === 0) return alert("Ingen sange gemt!");
        alert("🎵 Gemte sange:\n\n" + titles.map((t, i) => `${i+1}. ${t}`).join("\n"));
    };

    // =========================
    // AFSPILNING
    // =========================
    async function playSong(ws, lyrics) {
        window.sangSkyState.stopped = false;
        window.sangSkyState.paused = false;
        window.sangSkyState.playing = true;

        const allChunks = lyrics.flatMap(line => splitMessageWithHyphen(line, 100));
        const totalChunks = allChunks.length;
        let chunkIndex = 0;

        for (let chunk of allChunks) {
            if (window.sangSkyState.stopped) {
                window.sangSkyState.playing = false;
                progressBar.style.width = "0%";
                progressBar.innerText = "";
                return;
            }

            while (window.sangSkyState.paused) {
                await new Promise(r => setTimeout(r, 200));
            }

            ws.send(JSON.stringify({ type: "chat", data: { message: chunk } }));

            chunkIndex++;
            const progressPercent = Math.round((chunkIndex / totalChunks) * 100);
            progressBar.style.width = progressPercent + "%";
            progressBar.innerText = progressPercent + "%";

            await new Promise(r => setTimeout(r, getDelayForChunk(chunk)));
        }

        window.sangSkyState.playing = false;
        progressBar.style.width = "0%";
        progressBar.innerText = "";
    }

    // =========================
    // WEBSOCKET OVERRIDE
    // =========================
    let WebSocketOrig = window.WebSocket;
    window.WebSocket = new Proxy(WebSocketOrig, {
        construct(target, args) {
            const ws = new target(...args);
            const originalSend = ws.send;

            ws.send = function(data) {
                try {
                    const parsed = JSON.parse(data);
                    if (parsed.type === "chat" && parsed.data?.message) {
                        const msg = parsed.data.message.trim();
                        if (msg.startsWith("!syng ")) {
                            const songTitle = msg.replace("!syng ", "").trim().toLowerCase();
                            if (window.songs && window.songs[songTitle]) {
                                playSong(ws, window.songs[songTitle]);
                            } else {
                                ws.send(JSON.stringify({ type: "chat", data: { message: `❌ Ingen sang fundet med titlen "${songTitle}"` } }));
                            }
                            return;
                        }
                    }
                } catch (e) { console.error("WS send error:", e); }
                return originalSend.call(this, data);
            };

            return ws;
        }
    });

})();
