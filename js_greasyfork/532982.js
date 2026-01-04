// ==UserScript==
// @name         Discord Message Cleaner (Sélection améliorée)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Supprime vos messages dans un channel Discord avec sélection AVANT/APRÈS un message et effets visuels !
// @author       ErrorNoName_ / Meliodas
// @match        https://discord.com/channels/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532982/Discord%20Message%20Cleaner%20%28S%C3%A9lection%20am%C3%A9lior%C3%A9e%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532982/Discord%20Message%20Cleaner%20%28S%C3%A9lection%20am%C3%A9lior%C3%A9e%29.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let storage = (typeof localStorage !== "undefined") ? localStorage : null;
    let settings = {
        token: storage ? storage.getItem("token") || "" : "",
        userId: "",
        channelId: "",
        deleteInterval: 1000
    };

    // --- CSS pour surlignage et main ---
    let style = document.createElement("style");
    style.id = "dcCleaner-style";
    style.innerHTML = `
        .dcCleaner-hover { background: #3ba55d33 !important; transition: .15s }
        .dcCleaner-selected { background: #5865F299 !important; position: relative !important;}
        .dcCleaner-mainmark { pointer-events:none; position: absolute; left: 6px; top: 6px; font-size: 22px; z-index: 3; }
        .dcCleaner-erasing { opacity: 0.7; transition: opacity .15s; }
    `;
    document.head.appendChild(style);

    function log(msg) {
        const la = document.getElementById("dcCleaner-log");
        if (la) {
            const p = document.createElement("div");
            p.style.fontSize = "12px";
            p.textContent = `[${(new Date()).toLocaleTimeString()}] ${msg}`;
            la.appendChild(p);
            la.scrollTop = la.scrollHeight;
        }
        console.log("[Cleaner]", msg);
    }
    function clearLog() {
        const la = document.getElementById("dcCleaner-log");
        if (la) la.innerHTML = "";
    }

    function getTokenUndiscord() {
        try {
            const iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            const LS = iframe.contentWindow.localStorage;
            const t = JSON.parse(LS.token);
            document.body.removeChild(iframe);
            return t;
        } catch (err) { return ""; }
    }

    async function autoFillUserId() {
        const t = document.getElementById("dcCleaner-token").value.trim();
        if (!t) { log("Veuillez renseigner votre token d'abord."); return; }
        try {
            const res = await fetch("https://discord.com/api/v9/users/@me", { headers: { Authorization: t } });
            if (!res.ok) throw new Error("Erreur d'API.");
            const data = await res.json();
            document.getElementById("dcCleaner-userId").value = data.id;
            log("User ID rempli : " + data.id);
        } catch (e) {
            log("Erreur récupération userId : " + e);
        }
    }

    function getChannelIdFromURL() {
        const m = window.location.href.match(/channels\/[\w@]+\/(\d+)/);
        if (m) return m[1];
        alert('Channel ID non trouvé. Vérifiez l’URL.');
        return "";
    }

    // === Système de sélection amélioré ===
    let selectType = null; // 'before' ou 'after'
    let lastMark = null;
    let activeMsgElem = null;

    function enableMessageSelect(type) {
        selectType = type; // "before" ou "after"
        overlay.style.display = "none";
        // Clean ancienne sélection
        clearAllSelectionVisuals();

        function onMouseOver(e) {
            const msgElem = e.target.closest("[id^='chat-messages-']");
            if (msgElem) msgElem.classList.add("dcCleaner-hover");
        }
        function onMouseOut(e) {
            const msgElem = e.target.closest("[id^='chat-messages-']");
            if (msgElem) msgElem.classList.remove("dcCleaner-hover");
        }
        function onClick(e) {
            const msgElem = e.target.closest("[id^='chat-messages-']");
            if (msgElem) {
                const msgId = msgElem.id.split("-").pop();

                // Pour éviter de marquer plusieurs fois
                clearAllSelectionVisuals();

                msgElem.classList.add("dcCleaner-selected");

                // Ajoute la main gauche
                let mark = document.createElement("span");
                mark.innerHTML = "👆";
                mark.className = "dcCleaner-mainmark";
                msgElem.prepend(mark);
                lastMark = mark;
                activeMsgElem = msgElem;

                if (selectType === "before") {
                    document.getElementById("dcCleaner-startMsgId").value = msgId;
                } else {
                    document.getElementById("dcCleaner-endMsgId").value = msgId;
                }

                // Retire les events
                document.removeEventListener("click", onClick, true);
                document.removeEventListener("mouseover", onMouseOver, true);
                document.removeEventListener("mouseout", onMouseOut, true);

                setTimeout(() => overlay.style.display = "flex", 100); // Rouvre l'UI

                log(`Message ${selectType === "before" ? "AVANT" : "APRÈS"} sélectionné : ${msgId}`);
                e.stopPropagation();
                e.preventDefault();
            }
        }
        document.addEventListener("mouseover", onMouseOver, true);
        document.addEventListener("mouseout", onMouseOut, true);
        document.addEventListener("click", onClick, true);

        // Affichage explication visuelle temporaire (une bulle ?)
        log("Survolez puis cliquez sur un message.");
    }
    function clearAllSelectionVisuals() {
        document.querySelectorAll(".dcCleaner-selected").forEach(node => node.classList.remove("dcCleaner-selected"));
        document.querySelectorAll(".dcCleaner-mainmark").forEach(node => node.remove());
    }

    // := UI =:
    const overlay = document.createElement("div");
    overlay.id = "dcCleaner-overlay";
    overlay.style = "position:fixed;top:0;left:0;width:100vw;height:100vh;display:none;align-items:center;justify-content:center;background:rgba(0,0,0,.9);z-index:11000;";

    const panel = document.createElement("div");
    panel.style = [
        "background:#36393f", "padding:20px", "border-radius:10px",
        "max-width:400px", "min-width:260px", "color:#fff",
        "box-shadow:0 0 17px #000b", "font-family:Segoe UI,sans-serif", "font-size:15px"
    ].join(';');
    overlay.appendChild(panel);

    panel.innerHTML += `<h3 style="margin:0 0 7px 0;">Discord Cleaner <span style="font-size:12px;color:#43b581">(API recherche avancé)</span></h3>
      <div style="font-size:13px;margin-bottom:8px;color:#fff;font-weight:400;line-height:1.2;">
        ⚠️ <b>Risque de sanction Discord.</b> Utilisez à vos risques.<br>
        <span style="color:#aaa">Requiert un token utilisateur & votre UserID Discord.<br>Respectez les limites !</span>
      </div>`;

    function createField(label, id, opts = {}) {
        const d = document.createElement("div");
        d.style.marginBottom = "11px";
        const l = document.createElement("label");
        l.innerText = label + " ";
        l.style.fontSize = "13px";
        l.htmlFor = id;
        d.appendChild(l);
        const inp = document.createElement("input");
        inp.type = opts.type || "text";
        inp.id = id;
        inp.value = opts.def || "";
        inp.autocomplete = "off";
        inp.style = "width:97%;padding:5px 6px;margin-top:2px;border:none;border-radius:4px;font-size:13px;background:#202225;color:#fff;";
        d.appendChild(inp);
        if (opts.btn) {
            const b = document.createElement("button");
            b.innerText = opts.btn.txt;
            b.style = "margin-left:6px;padding:2px 9px;font-size:12px;border:none;border-radius:5px;background:#5865F2;color:#fff;cursor:pointer;";
            b.onclick = opts.btn.action;
            d.appendChild(b);
        }
        return d;
    }

    panel.appendChild(createField("Token:", "dcCleaner-token", {
        def: settings.token,
        btn: { txt: "Auto", action: () => {
                let tk = getTokenUndiscord();
                if (tk) { document.getElementById("dcCleaner-token").value = tk; log("Token récupéré !"); }
                else { log("Impossible de récupérer le token automatiquement."); }
            }
        }
    }));
    panel.appendChild(createField("User ID:", "dcCleaner-userId", {
        btn: { txt: "Me", action: autoFillUserId }
    }));
    panel.appendChild(createField("Channel ID:", "dcCleaner-channelId", {
        btn: { txt: "Auto", action: () => {
                let cid = getChannelIdFromURL();
                document.getElementById("dcCleaner-channelId").value = cid;
                log("Channel ID rempli : " + cid);
            }
        }
    }));
    panel.appendChild(createField("Message ID de départ (supprimer avant/égal):", "dcCleaner-startMsgId", {
        btn: { txt: "📌 Choisir", action: () => { enableMessageSelect("before"); }}
    }));
    panel.appendChild(createField("Message ID de fin (supprimer après/égal):", "dcCleaner-endMsgId", {
        btn: { txt: "📌 Choisir", action: () => { enableMessageSelect("after"); }}
    }));

    let intervalDiv = document.createElement("div");
    intervalDiv.style = "margin-bottom:11px;";
    intervalDiv.innerHTML = `<label style="font-size:13px;">Intervalle (ms): </label>
      <input type="range" id="dcCleaner-interval" min="300" max="5000" value="${settings.deleteInterval}" style="width:55%;vertical-align:middle;margin-right:8px">
      <span id="dcCleaner-interval-value" style="font-size:12px;">${settings.deleteInterval} ms</span>`;
    intervalDiv.querySelector("#dcCleaner-interval").addEventListener("input", function () {
        document.getElementById("dcCleaner-interval-value").innerText = this.value + " ms";
    });
    panel.appendChild(intervalDiv);

    const logDiv = document.createElement("div");
    logDiv.id = "dcCleaner-log";
    logDiv.style = "width:100%;height:110px;overflow-y:auto;background:#23272a;border-radius:4px;padding:5px 7px 4px 7px;font-size:12px;color:#fff;margin-bottom:13px;margin-top:4px;box-sizing:border-box;";
    panel.appendChild(logDiv);

    const btnDiv = document.createElement("div");
    btnDiv.style = "text-align:right;margin-top:9px;";
    const delBtn = document.createElement("button");
    delBtn.innerHTML = "🗑️ Supprimer mes messages";
    delBtn.style = "margin-right:11px;padding:7px 13px;border:none;border-radius:5px;background:linear-gradient(135deg,#43b581,#1abc9c);color:#fff;cursor:pointer;font-size:14px;font-weight:600;";
    const cancelBtn = document.createElement("button");
    cancelBtn.innerText = "Annuler";
    cancelBtn.style = "padding:7px 13px;border:none;border-radius:5px;background:linear-gradient(135deg,#7289da,#5b6eae);color:#fff;font-size:14px;";
    btnDiv.appendChild(delBtn);
    btnDiv.appendChild(cancelBtn);
    panel.appendChild(btnDiv);

    cancelBtn.onclick = () => { overlay.style.display = "none"; };
    document.body.appendChild(overlay);

    if (!document.getElementById("dcCleaner-mainBtn")) {
        const mainBtn = document.createElement("button");
        mainBtn.id = "dcCleaner-mainBtn";
        mainBtn.title = "Ouvrir Discord Cleaner";
        mainBtn.style = [
            "position:fixed", "bottom:20px", "right:20px", "z-index:99999", "padding:7px",
            "font-size:17px", "border:none", "border-radius:50%", "cursor:pointer", "background:transparent"
        ].join(';');
        mainBtn.innerHTML = `<img src="https://victornpb.github.io/undiscord/images/icon128.png" width="26" height="26" alt="Cleaner">`;
        mainBtn.onclick = function () {
            document.getElementById("dcCleaner-token").value = settings.token;
            document.getElementById("dcCleaner-userId").value = settings.userId;
            document.getElementById("dcCleaner-channelId").value = getChannelIdFromURL() || settings.channelId;
            document.getElementById("dcCleaner-interval").value = settings.deleteInterval;
            document.getElementById("dcCleaner-interval-value").innerText = settings.deleteInterval + " ms";
            clearLog();
            overlay.style.display = "flex";
        };
        document.body.appendChild(mainBtn);
    }

    // ===== Début suppression =====
    async function startDeletionProcess() {
        settings.token = document.getElementById("dcCleaner-token").value.trim();
        settings.userId = document.getElementById("dcCleaner-userId").value.trim();
        settings.channelId = document.getElementById("dcCleaner-channelId").value.trim();
        settings.deleteInterval = +document.getElementById("dcCleaner-interval").value;
        const startMsgId = document.getElementById("dcCleaner-startMsgId").value.trim(); // avant ou égal
        const endMsgId   = document.getElementById("dcCleaner-endMsgId").value.trim();   // après ou égal

        if (storage && settings.token) storage.setItem("token", settings.token);
        if (!settings.token || !settings.userId || !settings.channelId) {
            log("Paramètres manquants !");
            return;
        }
        if (!confirm("⚠️ Supprimer tous vos messages (dans ce channel, selon votre sélection) ?")) return;
        log("Démarrage de la suppression...");
        clearAllSelectionVisuals();

        let isDM = window.location.pathname.split('/')[2] === "@me";
        const API_SEARCH_URL = isDM ?
            `https://discord.com/api/v9/channels/${settings.channelId}/messages/search?` :
            `https://discord.com/api/v9/guilds/${window.location.pathname.split('/')[2]}/messages/search?channel_id=${settings.channelId}&`;

        let offset = 0;
        let delCount = 0;
        let totalFound = 0;
        const delay = ms => new Promise(r => setTimeout(r, ms));
        while (true) {
            let searchParams = new URLSearchParams({
                author_id: settings.userId,
                offset: offset,
                sort_by: 'timestamp',
                sort_order: 'desc',
                include_nsfw: 'true'
            });
            let searchUrl = API_SEARCH_URL + searchParams.toString();
            log("Recherche offset=" + offset + "...");
            let resp;
            try {
                resp = await fetch(searchUrl, { headers: { 'Authorization': settings.token } });
            } catch (e) {
                log("Erreur de requête lors de la recherche : " + e);
                break;
            }
            if (!resp.ok) {
                if (resp.status === 429) {
                    let j = await resp.json().catch(() => ({}));
                    let wait = j.retry_after ? Math.ceil(j.retry_after * 1000) : 5000;
                    log("Rate limit. Attente " + wait + " ms.");
                    await delay(wait);
                    continue;
                } else {
                    const txt = await resp.text().catch(() => "");
                    log(`Erreur de recherche (status=${resp.status}) : ${txt}`);
                    break;
                }
            }
            let data;
            try { data = await resp.json(); }
            catch (e) { log("Erreur parsing JSON : " + e); break; }

            if (!data || !data.messages || data.messages.length === 0) {
                log("Aucun (plus) de message à supprimer !");
                break;
            }
            if (data.total_results > totalFound) {
                totalFound = data.total_results;
                log("Messages trouvés (approx.) : " + totalFound);
            }

            // Filtrage selon les bornes
            let discoveredMessages = data.messages.map(thread => thread.find(m => m.hit)).filter(Boolean);
            if (startMsgId) discoveredMessages = discoveredMessages.filter(m => BigInt(m.id) <= BigInt(startMsgId));
            if (endMsgId)   discoveredMessages = discoveredMessages.filter(m => BigInt(m.id) >= BigInt(endMsgId));
            if (discoveredMessages.length === 0) {
                log("Aucun résultat exploitable ici => offset+=25");
                offset += 25;
                await delay(settings.deleteInterval); continue;
            }

            for (let msg of discoveredMessages) {
                try {
                    const delUrl = `https://discord.com/api/v9/channels/${settings.channelId}/messages/${msg.id}`;
                    let res = await fetch(delUrl, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': settings.token,
                            'Content-Type': 'application/json'
                        }
                    });
                    if (res.ok) {
                        delCount++;
                        log(`Supprimé : ${msg.id} (Total = ${delCount})`);
                        // Effet LETTRE PAR LETTRE
                        let msgEl = document.querySelector(`[id$="-${msg.id}"]`);
                        if (msgEl) {
                            let msgContent = msgEl.querySelector('[data-slate-string="true"], [class*="markup"]');
                            if (msgContent) {
                                let txt = msgContent.textContent;
                                let i = 0;
                                msgEl.classList.add("dcCleaner-erasing");
                                let interval = setInterval(()=>{
                                    msgContent.textContent = txt.slice(0, txt.length-i++);
                                    if (i > txt.length) {
                                        clearInterval(interval);
                                        msgEl.style.opacity = '0.15';
                                    }
                                }, 24);
                            }
                        }
                    } else {
                        const txt = await res.text().catch(() => "");
                        log(`Erreur DELETE (status=${res.status}) sur ${msg.id} : ${txt}`);
                    }
                    await delay(settings.deleteInterval);
                } catch (e) {
                    log(`Erreur API : ${e}`);
                }
            }
            offset += 25;
            await delay(settings.deleteInterval);
        }
        log(`Fin. ${delCount} messages supprimés.`);
        alert("Terminé. " + delCount + " messages supprimés.");
    }

    delBtn.onclick = startDeletionProcess;
    log("Discord Cleaner initialisé.");
})();