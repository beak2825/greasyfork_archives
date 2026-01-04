// ==UserScript==
// @name         Mikl0ws Au2-2-2-2-2-2 
// @namespace    https://www.skyskraber.dk/chat
// @version      2.5.0
// @description  no sharing
// @author       mikl0w
// @match        https://www.skyskraber.dk/chat/*
// @match        https://www.skyskraber.dk/chat
// @license      MIT
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/540048/Mikl0ws%20Au2-2-2-2-2-2.user.js
// @updateURL https://update.greasyfork.org/scripts/540048/Mikl0ws%20Au2-2-2-2-2-2.meta.js
// ==/UserScript==

//SCRIPT MED CONFIG, POPUP, INTERVAL, AUTORESPONDER og BINDERS

(function() {
  if (!window._ws_instances) {
    window._ws_instances = [];
    const OrigWebSocket = window.WebSocket;
    class WrappedWebSocket extends OrigWebSocket {
      constructor(...args) {
        super(...args);
        window._ws_instances.push(this);
        // Kald auto-binder for alle nye sockets
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
        <label for="msg-interval" style="white-space:nowrap;">Interval for beskeder:</label>
        <input type="number" min="1" id="msg-interval" value="20" style="width: 60px; border-radius: 4px; border: 1px solid #888; padding: 2px 6px;" />
        <span>minutter</span>
      </div>
      <label style="display:flex;align-items:center;gap:8px;">
        <input type="checkbox" id="cb-timegrab" />
        Timegrab
      </label>
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

  // --- Autobesked ---
  let messageInterval = null;
  const intervalInput = popup.querySelector("#msg-interval");

  function getIntervalMs() {
    return Math.max(1, Number(intervalInput.value)) * 60 * 1000;
  }

  function sendChatMessage() {
    const ws = window._ws_instances && window._ws_instances[0];
    if (ws && ws.readyState === 1) {
      const messages = [".", ","];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      ws.send(JSON.stringify({ type: "chat", data: { message: msg } }));
    }
  }

  function startMessageScript() {
    if (messageInterval) clearInterval(messageInterval);
    messageInterval = setInterval(sendChatMessage, getIntervalMs());
    console.log(`[Mikl0ws Au2] Besked-script AKTIVERET (sender besked hver ${intervalInput.value} minut)`);
  }
  function stopMessageScript() {
    if (messageInterval) clearInterval(messageInterval);
    messageInterval = null;
    console.log("[Mikl0ws Au2] Besked-script DEAKTIVERET");
  }

  // --- Timegrab ---
  let hourListener = null;
  function autoHourApproveListener(event) {
    try {
      const data = JSON.parse(event.data);
      if (data && data.player && data.player.newHour === true) {
        this.send(JSON.stringify({ type: "hour" }));
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
  let autoresponderRules = [
    { trigger: "mik", response: "han er sød" }
  ];
  let autoresponderListener = null;
  let myId = null;

  function escapeHtml(txt) {
    return txt.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g, "&quot;");
  }

  // Find egen bruger-id fra chatbesked
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
              evt.data.isYou // 
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
                // Ignorer egne beskeder
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
        rebindAutoresponder();
      };
    });
    // Redigerbare felter
    tbody.querySelectorAll(".ar-edit-trigger").forEach(inp => {
      inp.onchange = () => {
        autoresponderRules[+inp.dataset.idx].trigger = inp.value;
        rebindAutoresponder();
      };
    });
    tbody.querySelectorAll(".ar-edit-response").forEach(inp => {
      inp.onchange = () => {
        autoresponderRules[+inp.dataset.idx].response = inp.value;
        rebindAutoresponder();
      };
    });
  }

  // --- Checkbox events og interval felt ---
  const sendMessageCheckbox = popup.querySelector("#cb-send-message");
  const msgIntervalRow = popup.querySelector("#msg-interval-row");
  const autoresponderCheckbox = popup.querySelector("#cb-autoresponder");
  const autoresponderConfig = popup.querySelector("#autoresponder-config");

  sendMessageCheckbox.addEventListener("change", e => {
    msgIntervalRow.style.display = e.target.checked ? "flex" : "none";
    if (e.target.checked) startMessageScript();
    else stopMessageScript();
  });

  popup.querySelector("#cb-timegrab").addEventListener("change", e => {
    if (e.target.checked) startHourScript();
    else stopHourScript();
  });

  autoresponderCheckbox.addEventListener("change", e => {
    autoresponderConfig.style.display = e.target.checked ? "block" : "none";
    if (e.target.checked) startAutoresponder();
    else stopAutoresponder();
  });

  intervalInput.addEventListener("input", e => {
    if (!/^\d+$/.test(e.target.value) || Number(e.target.value) < 1) {
      e.target.value = 1;
    }
    if (messageInterval) {
      startMessageScript();
    }
  });

  // Autoresponder tilføj-knap
  popup.querySelector("#ar-btn-add").onclick = () => {
    const trig = popup.querySelector("#ar-new-trigger").value.trim();
    const resp = popup.querySelector("#ar-new-response").value.trim();
    if(trig && resp) {
      autoresponderRules.push({ trigger: trig, response: resp });
      popup.querySelector("#ar-new-trigger").value = "";
      popup.querySelector("#ar-new-response").value = "";
      updateAutoresponderTable();
      rebindAutoresponder();
    }
  };

  // Skjul intervalfelt og autoresponder config fra start
  msgIntervalRow.style.display = "none";
  autoresponderConfig.style.display = "none";
  updateAutoresponderTable();

  // --- AUTO-BINDERS ---
  window._ws_on_new_socket = function(ws) {
    // Timegrab
    if (window._customConfigUI && window._customConfigUI.timegrabChecked) {
      if (hourListener) {
        ws.removeEventListener("message", hourListener);
        ws.addEventListener("message", hourListener);
      }
    }
    // Autoresponder
    if (window._customConfigUI && window._customConfigUI.autoresponderChecked) {
      if (autoresponderListener) {
        ws.removeEventListener("message", autoresponderListener);
        ws.addEventListener("message", autoresponderListener);
      }
    }
  };

  window._customConfigUI = {
    toggleBtn,
    popup,
    get sendMessageChecked() {
      return sendMessageCheckbox.checked;
    },
    get timegrabChecked() {
      return popup.querySelector("#cb-timegrab").checked;
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