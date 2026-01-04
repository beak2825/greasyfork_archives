// ==UserScript==
// @name         mik au2 PREMIUM
// @namespace    https://www.skyskraber.dk/chat
// @version      2.7.1
// @description  BFL for evigt baby
// @author       mikl0w
// @match        https://www.skyskraber.dk/chat/*
// @match        https://www.skyskraber.dk/chat
// @match        http://www.skyskraber.dk/chat/*
// @match        http://www.skyskraber.dk/chat
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/538329/mik%20au2%20PREMIUM.user.js
// @updateURL https://update.greasyfork.org/scripts/538329/mik%20au2%20PREMIUM.meta.js
// ==/UserScript==

(function() {
  if (!window._ws_instances) {
    window._ws_instances = [];
    const OrigWebSocket = window.WebSocket;
    class WrappedWebSocket extends OrigWebSocket {
      constructor(...args) {
        super(...args);
        window._ws_instances.push(this);
        if (typeof window._ws_on_new_socket === "function") {
          window._ws_on_new_socket(this);
        }
      }
    }
    window.WebSocket = WrappedWebSocket;
  }
})();

(function() {
  if (window._customConfigUI) return;

  // --- UI ---
  const toggleBtn = document.createElement("button");
  toggleBtn.id = "custom-config-toggle";
  toggleBtn.textContent = "⚡️";
  toggleBtn.style = `
    position: fixed; bottom: 10px; left: 10px; z-index: 99999;
    width: 48px; height: 48px; font-size: 24px; border-radius: 50%;
    border: none; background: #333; color: #fff; box-shadow: 0 2px 8px #0008;
    cursor: pointer; transition: background 0.2s;
  `;
  toggleBtn.onmouseenter = () => toggleBtn.style.background = "#555";
  toggleBtn.onmouseleave = () => toggleBtn.style.background = "#333";
  document.body.appendChild(toggleBtn);

  const popup = document.createElement("div");
  popup.id = "custom-config-popup";
  popup.style = `
    position: fixed; bottom: 10px; right: 30px; z-index: 99999;
    background: #23272a; color: #fff; border-radius: 10px; min-width: 300px;
    max-width: 98vw; padding: 24px 20px 20px 20px; box-shadow: 0 4px 24px #0009;
    display: none; flex-direction: column; gap: 16px;
    font-family: sans-serif; font-size: 16px;
    max-height: 90vh;
    overflow: auto;
  `;

  popup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <span style="font-weight:bold;font-size:18px;">Mikl0ws Au2</span>
      <button id="custom-config-close" style="
        background:none;border:none;color:#fff;font-size:22px;cursor:pointer;
        line-height:1; margin-left: 12px;">×</button>
    </div>
    <div style="margin-top:10px;display:flex;flex-direction:column;gap:8px;">
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="cb-send-message" />
        Send besked automatisk
      </label>
      <div id="msg-interval-row" style="display:none;align-items:center;gap:8px;">
        <label style="white-space:nowrap;">Interval for beskeder:</label>
        <input type="number" min="1" id="msg-interval-min" value="17" style="width: 45px; border-radius: 4px; border: 1px solid #888; padding: 2px 6px;" />
        <span>-</span>
        <input type="number" min="1" id="msg-interval-max" value="23" style="width: 45px; border-radius: 4px; border: 1px solid #888; padding: 2px 6px;" />
        <span>minutter</span>
      </div>
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="cb-timegrab" />
        Timegrab
      </label>
      <label id="auto-reconnect-row" style="display:flex;align-items:center;gap:8px;margin-top:6px;">
        <input type="checkbox" id="cb-auto-reconnect" />
        Auto reconnect
      </label>
      <div id="auto-reconnect-delay-row" style="display:none;align-items:center;gap:8px;margin-left:32px;">
        <span>Delay:</span>
        <input type="number" id="auto-reconnect-delay" min="1" value="3" style="width:60px;border-radius:4px;border:1px solid #888;padding:2px 6px;">
        <span style="font-size:13px;">sek</span>
      </div>
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="cb-autoresponder" />
        Autoresponder
      </label>
      <div id="autoresponder-config" style="display:none;">
        <div style="margin:5px 0 8px 0;color:#ccc;font-size:13px;">
          Tilføj regler: Hvis en chatbesked matcher <b>Trigger</b>, svarer botten med <b>Svar</b>.<br>
          <b>{username}</b> bliver erstattet med afsenderens navn.
        </div>
        <table id="ar-table" style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:1px solid #444;">
              <th style="text-align:left;width:40%;">Trigger</th>
              <th style="text-align:left;width:50%;">Svar</th>
              <th style="width:10%;"></th>
            </tr>
          </thead>
          <tbody id="ar-tbody"></tbody>
        </table>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <input id="ar-new-trigger" placeholder="Trigger" style="flex:1 1 40%;border-radius:4px;border:1px solid #888;padding:2px 6px;font-size:15px;">
          <input id="ar-new-response" placeholder="Svar" style="flex:1 1 50%;border-radius:4px;border:1px solid #888;padding:2px 6px;font-size:15px;">
          <button id="ar-btn-add" style="padding:3px 12px;border-radius:5px;border:none;background:#4caf50;color:#fff;font-weight:bold;cursor:pointer;">+</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  toggleBtn.onclick = () => {
    popup.style.display = popup.style.display === "none" ? "flex" : "none";
  };
  popup.querySelector("#custom-config-close").onclick = () => {
    popup.style.display = "none";
  };

  // --- Autobesked med RANDOM INTERVAL ---
  const intervalMinInput = popup.querySelector("#msg-interval-min");
  const intervalMaxInput = popup.querySelector("#msg-interval-max");

  function getIntervalInputValue(inp) {
    let val = parseInt(inp.value, 10);
    if (isNaN(val) || inp.value === "" || val < 1) {
      inp.value = "1";
      return 1;
    }
    return val;
  }

  function getRandomIntervalMs() {
    let min = getIntervalInputValue(intervalMinInput);
    let max = getIntervalInputValue(intervalMaxInput);
    if (min > max) [min, max] = [max, min];
    const randomMin = Math.floor(Math.random() * (max - min + 1)) + min;
    return randomMin * 60 * 1000;
  }

  let messageTimeout = null;

  function sendChatMessage() {
    const ws = window._ws_instances && window._ws_instances[0];
    if (ws && ws.readyState === 1) {
      const messages = [".", ","]; // Udvid evt. med flere beskeder hvis ønsket
      const msg = messages[Math.floor(Math.random() * messages.length)];
      ws.send(JSON.stringify({ type: "chat", data: { message: msg } }));
      console.log("[Au2 DEBUG] Besked sendt:", msg);
    } else {
      console.log("[Au2 DEBUG] Besked IKKE sendt - ws ikke klar", ws ? ws.readyState : "Ingen ws");
    }
  }

  function sendChatMessageWithRandomInterval() {
    sendChatMessage();
    messageTimeout = setTimeout(sendChatMessageWithRandomInterval, getRandomIntervalMs());
  }

  // Forbedret: vent på ws.readyState før start
  function startMessageScript() {
    console.log("[Au2 DEBUG] Kører startMessageScript");
    if (messageTimeout) clearTimeout(messageTimeout);

    let firstAttempt = true;
    function tryStart() {
      const ws = window._ws_instances && window._ws_instances[0];
      if (ws && ws.readyState === 1) {
        messageTimeout = setTimeout(sendChatMessageWithRandomInterval, getRandomIntervalMs());
        console.log(`[Mikl0ws Au2] Besked-script AKTIVERET (random hver ${intervalMinInput.value}-${intervalMaxInput.value} min)`);
      } else if (ws) {
        if (firstAttempt) {
          console.log("[Au2 DEBUG] Venter på ws.open...");
          firstAttempt = false;
        }
        ws.addEventListener("open", () => {
          if (messageTimeout) clearTimeout(messageTimeout);
          messageTimeout = setTimeout(sendChatMessageWithRandomInterval, getRandomIntervalMs());
          console.log(`[Mikl0ws Au2] Besked-script AKTIVERET EFTER WS OPEN (random hver ${intervalMinInput.value}-${intervalMaxInput.value} min)`);
        }, { once: true });
      } else {
        if (firstAttempt) {
          console.log("[Au2 DEBUG] Ingen ws endnu, prøver igen om 1s...");
          firstAttempt = false;
        }
        setTimeout(tryStart, 1000);
      }
    }
    tryStart();
  }
  function stopMessageScript() {
    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = null;
    console.log("[Mikl0ws Au2] Besked-script DEAKTIVERET");
  }

  // --- Timegrab ---
  let hourListener = null;
  function autoHourApproveListener(event) {
    try {
      const data = JSON.parse(event.data);
      if (data && data.player && data.player.newHour === true) {
        const ws = window._ws_instances && window._ws_instances[0];
        if (ws && ws.readyState === 1) {
          ws.send(JSON.stringify({ type: "hour" }));
          console.log("[Au2] Godkendte time automatisk!");
        } else {
          setTimeout(() => autoHourApproveListener(event), 1000);
        }
      }
    } catch (e) {}
  }
  function startHourScript() {
    if (hourListener) return;
    hourListener = autoHourApproveListener;
    (window._ws_instances || []).forEach(ws => {
      ws.removeEventListener("message", hourListener);
      ws.addEventListener("message", hourListener);
    });
    console.log("[Mikl0ws Au2] Timegrab-script AKTIVERET");
  }
  function stopHourScript() {
    if (!hourListener) return;
    (window._ws_instances || []).forEach(ws => {
      ws.removeEventListener("message", hourListener);
    });
    hourListener = null;
    console.log("[Mikl0ws Au2] Timegrab-script DEAKTIVERET");
  }

  // --- Autoresponder ---
  function saveAutoresponderRules() {
    localStorage.setItem("au2_autoresponder_rules", JSON.stringify(autoresponderRules));
  }
  const rulesFromStorage = localStorage.getItem("au2_autoresponder_rules");
  let autoresponderRules = rulesFromStorage
    ? JSON.parse(rulesFromStorage)
    : [{ trigger: "mik", response: "han er sød" }];
  let autoresponderListener = null;
  let myId = null;

  function escapeHtml(txt) {
    return txt.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g, "&quot;");
  }

  function extractMyIdOnce(data) {
    if (myId) return;
    if (data && data.clients && Array.isArray(data.clients.updates)) {
      data.clients.updates.forEach(update => {
        if (Array.isArray(update.events)) {
          update.events.forEach(evt => {
            if (
              evt.type === "chat" &&
              evt.data &&
              typeof evt.data.userId === "number" &&
              evt.data.isYou
            ) {
              myId = evt.data.userId;
            }
          });
        }
      });
    }
  }

  function autoresponderHandler(event) {
    try {
      const data = JSON.parse(event.data);
      extractMyIdOnce(data);
      if (data && data.clients && Array.isArray(data.clients.updates)) {
        data.clients.updates.forEach(update => {
          if (Array.isArray(update.events)) {
            update.events.forEach(evt => {
              if (
                evt.type === "chat" &&
                evt.data &&
                typeof evt.data.message === "string" &&
                typeof evt.data.userId === "number"
              ) {
                if (myId && evt.data.userId === myId) return;
                const msg = evt.data.message.trim().toLowerCase();
                let reply = null;
                for(const rule of autoresponderRules) {
                  const trig = (rule.trigger || "").trim().toLowerCase();
                  if(trig && trig === msg) {
                    reply = (rule.response || "").replace(/\{username\}/g, evt.data.username || "ukendt");
                    break;
                  }
                }
                if (reply) {
                  const ws = window._ws_instances && window._ws_instances[0];
                  if (ws && ws.readyState === 1) {
                    ws.send(JSON.stringify({
                      type: "chat",
                      data: {
                        message: reply
                      }
                    }));
                    console.log(`[Mikl0ws Au2] Autoresponder: svarede på '${msg}'`);
                  }
                }
              }
            });
          }
        });
      }
    } catch(e){}
  }

  function startAutoresponder() {
    if (autoresponderListener) return;
    autoresponderListener = autoresponderHandler;
    (window._ws_instances || []).forEach(ws => {
      ws.removeEventListener("message", autoresponderListener);
      ws.addEventListener("message", autoresponderListener);
    });
    console.log("[Mikl0ws Au2] Autoresponder AKTIVERET");
  }
  function stopAutoresponder() {
    if (!autoresponderListener) return;
    (window._ws_instances || []).forEach(ws => {
      ws.removeEventListener("message", autoresponderListener);
    });
    autoresponderListener = null;
    console.log("[Mikl0ws Au2] Autoresponder DEAKTIVERET");
  }

  function rebindAutoresponder() {
    if (autoresponderListener && autoresponderCheckbox.checked) {
      stopAutoresponder();
      startAutoresponder();
    }
  }

  function updateAutoresponderTable() {
    const tbody = popup.querySelector("#ar-tbody");
    tbody.innerHTML = "";
    autoresponderRules.forEach((rule, idx) => {
      const tr = document.createElement("tr");
      tr.style.borderBottom = "1px solid #333";
      tr.innerHTML = `
        <td><input style="width:99%;background:#222;color:#fff;border:1px solid #555;border-radius:3px;padding:2px 4px;" value="${escapeHtml(rule.trigger)}" data-idx="${idx}" class="ar-edit-trigger"></td>
        <td><input style="width:99%;background:#222;color:#fff;border:1px solid #555;border-radius:3px;padding:2px 4px;" value="${escapeHtml(rule.response)}" data-idx="${idx}" class="ar-edit-response"></td>
        <td><button data-idx="${idx}" class="ar-btn-remove" style="padding:2px 8px;background:#d32f2f;color:#fff;border-radius:3px;border:none;cursor:pointer;">✖</button></td>
      `;
      tbody.appendChild(tr);
    });
    // Fjern
    tbody.querySelectorAll(".ar-btn-remove").forEach(btn => {
      btn.onclick = e => {
        const idx = +btn.dataset.idx;
        autoresponderRules.splice(idx, 1);
        updateAutoresponderTable();
        saveAutoresponderRules();
        rebindAutoresponder();
      };
    });
    // Redigerbare felter
    tbody.querySelectorAll(".ar-edit-trigger").forEach(inp => {
      inp.onchange = () => {
        autoresponderRules[+inp.dataset.idx].trigger = inp.value;
        saveAutoresponderRules();
        rebindAutoresponder();
      };
    });
    tbody.querySelectorAll(".ar-edit-response").forEach(inp => {
      inp.onchange = () => {
        autoresponderRules[+inp.dataset.idx].response = inp.value;
        saveAutoresponderRules();
        rebindAutoresponder();
      };
    });
  }

  // --- Auto reconnect UI + logic ---
  const autoReconnectCheckbox = popup.querySelector("#cb-auto-reconnect");
  const autoReconnectDelayInput = popup.querySelector("#auto-reconnect-delay");
  const autoReconnectDelayRow = popup.querySelector("#auto-reconnect-delay-row");
  if (!localStorage.getItem("au2_auto_reconnect_delay")) {
    localStorage.setItem("au2_auto_reconnect_delay", "3");
    autoReconnectDelayInput.value = 3;
  }
  if (localStorage.getItem("au2_auto_reconnect") === "true") {
    autoReconnectCheckbox.checked = true;
  }
  const savedDelay = localStorage.getItem("au2_auto_reconnect_delay");
  if (savedDelay !== null) autoReconnectDelayInput.value = savedDelay;

  function updateAutoReconnectUI() {
    autoReconnectDelayRow.style.display = autoReconnectCheckbox.checked ? "flex" : "none";
  }
  autoReconnectCheckbox.addEventListener("change", e => {
    localStorage.setItem("au2_auto_reconnect", e.target.checked);
    updateAutoReconnectUI();
  });
  autoReconnectDelayInput.addEventListener("change", e => {
    localStorage.setItem("au2_auto_reconnect_delay", e.target.value);
  });
  updateAutoReconnectUI();

  // --- Checkbox events og interval felt ---
  const sendMessageCheckbox = popup.querySelector("#cb-send-message");
  const msgIntervalRow = popup.querySelector("#msg-interval-row");
  const timegrabCheckbox = popup.querySelector("#cb-timegrab");
  const autoresponderCheckbox = popup.querySelector("#cb-autoresponder");
  const autoresponderConfig = popup.querySelector("#autoresponder-config");

  function restoreSettings() {
    if (localStorage.getItem("au2_send_besked") === "true") {
      sendMessageCheckbox.checked = true;
      msgIntervalRow.style.display = "flex";
      startMessageScript();
    }
    if (localStorage.getItem("au2_timegrab") === "true") {
      timegrabCheckbox.checked = true;
      startHourScript();
    }
    if (localStorage.getItem("au2_autoresponder") === "true") {
      autoresponderCheckbox.checked = true;
      autoresponderConfig.style.display = "block";
      startAutoresponder();
    }
    const min = localStorage.getItem("au2_interval_min");
    const max = localStorage.getItem("au2_interval_max");
    if (min !== null) intervalMinInput.value = min;
    if (max !== null) intervalMaxInput.value = max;
    // Auto-reconnect
    if (localStorage.getItem("au2_auto_reconnect") === "true") {
      autoReconnectCheckbox.checked = true;
      updateAutoReconnectUI();
    }
    const delay = localStorage.getItem("au2_auto_reconnect_delay");
    if (delay !== null) autoReconnectDelayInput.value = delay;
  }

  sendMessageCheckbox.addEventListener("change", e => {
    localStorage.setItem("au2_send_besked", e.target.checked);
    msgIntervalRow.style.display = e.target.checked ? "flex" : "none";
    if (e.target.checked) startMessageScript();
    else stopMessageScript();
  });

  timegrabCheckbox.addEventListener("change", e => {
    localStorage.setItem("au2_timegrab", e.target.checked);
    if (e.target.checked) startHourScript();
    else stopHourScript();
  });

  autoresponderCheckbox.addEventListener("change", e => {
    localStorage.setItem("au2_autoresponder", e.target.checked);
    autoresponderConfig.style.display = e.target.checked ? "block" : "none";
    if (e.target.checked) startAutoresponder();
    else stopAutoresponder();
  });

  [intervalMinInput, intervalMaxInput].forEach(inp => {
    inp.addEventListener("blur", e => {
      if (inp.value === "") inp.value = "1";
      localStorage.setItem("au2_interval_min", intervalMinInput.value);
      localStorage.setItem("au2_interval_max", intervalMaxInput.value);
    });
    inp.addEventListener("input", e => {
      if (messageTimeout) {
        startMessageScript();
      }
    });
  });

  popup.querySelector("#ar-btn-add").onclick = () => {
    const trig = popup.querySelector("#ar-new-trigger").value.trim();
    const resp = popup.querySelector("#ar-new-response").value.trim();
    if(trig && resp) {
      autoresponderRules.push({ trigger: trig, response: resp });
      popup.querySelector("#ar-new-trigger").value = "";
      popup.querySelector("#ar-new-response").value = "";
      updateAutoresponderTable();
      saveAutoresponderRules();
      rebindAutoresponder();
    }
  };

  msgIntervalRow.style.display = "none";
  autoresponderConfig.style.display = "none";
  updateAutoresponderTable();

  restoreSettings();

  // --- AUTO-REFRESH ON DISCONNECT ---
  function setupAutoRefreshOnDisconnect(ws) {
    ws.addEventListener("close", function() {
      const shouldReconnect = localStorage.getItem("au2_auto_reconnect") === "true";
      let delaySec = parseFloat(localStorage.getItem("au2_auto_reconnect_delay") || "3");
      delaySec = isNaN(delaySec) ? 3 : delaySec;
      if (shouldReconnect) {
        console.log(`[Au2] Forbindelse mistet – genindlæser siden om ${delaySec} sek.`);
        setTimeout(function() {
          location.reload();
        }, delaySec * 1000);
      } else {
        console.log("[Au2] Forbindelse mistet – auto-reconnect er slået fra.");
      }
    });
  }

  (window._ws_instances || []).forEach(setupAutoRefreshOnDisconnect);

  window._ws_on_new_socket = function(ws) {
    if (window._customConfigUI && window._customConfigUI.timegrabChecked) {
      if (hourListener) {
        ws.removeEventListener("message", hourListener);
        ws.addEventListener("message", hourListener);
      }
    }
    if (window._customConfigUI && window._customConfigUI.autoresponderChecked) {
      if (autoresponderListener) {
        ws.removeEventListener("message", autoresponderListener);
        ws.addEventListener("message", autoresponderListener);
      }
    }
    setupAutoRefreshOnDisconnect(ws);
  };

  window._customConfigUI = {
    toggleBtn,
    popup,
    get sendMessageChecked() {
      return sendMessageCheckbox.checked;
    },
    get timegrabChecked() {
      return timegrabCheckbox.checked;
    },
    get autoresponderChecked() {
      return autoresponderCheckbox.checked;
    },
    startMessageScript,
    stopMessageScript,
    startHourScript,
    stopHourScript,
    startAutoresponder,
    stopAutoresponder
  };

})();