// ==UserScript==
// @name         MeshCore BLE Listener via Bluetooth Events
// @namespace    https://meshcore.michaelholroyd.uk/
// @version      2.0
// @description  Intercepts raw MeshCore messages from Web Bluetooth without modifying Flutter/Dart. Safe and effective.
// @match        https://meshcore.michaelholroyd.uk/*
// @grant        GM_xmlhttpRequest
// @connect      discord.com
// @downloadURL https://update.greasyfork.org/scripts/544021/MeshCore%20BLE%20Listener%20via%20Bluetooth%20Events.user.js
// @updateURL https://update.greasyfork.org/scripts/544021/MeshCore%20BLE%20Listener%20via%20Bluetooth%20Events.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1399808238429667378/iEWV45vkcKE4qKN4_SXWhQp3aESUwVCAwJr6rb2A2p2IphqHBQwz8YZZzuM6gM4tVJjV";

  const log = (...args) => console.log("[MeshCore BLE]", ...args);

  const watchBLE = () => {
    const keys = Object.keys(window);

    for (const key of keys) {
      const obj = window[key];
      if (obj && typeof obj === 'object' && obj?.rxCharacteristic && obj?.rxCharacteristic?.addEventListener) {
        const rx = obj.rxCharacteristic;

        log("🎯 Found BLE characteristic:", key);

        rx.addEventListener("characteristicvaluechanged", (event) => {
          try {
            const buffer = event.target.value.buffer;
            const bytes = new Uint8Array(buffer);

            const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ');
            const base64 = btoa(String.fromCharCode(...bytes));

            log("🧬 New BLE message:");
            log("→ Hex:    ", hex);
            log("→ Base64: ", base64);

            // Send to Discord
            GM_xmlhttpRequest({
              method: "POST",
              url: DISCORD_WEBHOOK_URL,
              headers: { "Content-Type": "application/json" },
              data: JSON.stringify({
                username: "MeshCore BLE Bot",
                embeds: [
                  {
                    title: "📡 Mesh Message via BLE",
                    color: 0x00cccc,
                    timestamp: new Date().toISOString(),
                    fields: [
                      { name: "Hex", value: "```\n" + hex + "\n```" },
                      { name: "Base64", value: "```\n" + base64 + "\n```" }
                    ],
                    footer: {
                      text: "Captured via Web Bluetooth",
                      icon_url: "https://meshcore.michaelholroyd.uk/favicon.ico"
                    }
                  }
                ]
              }),
              onload: res => log("✅ Sent to Discord:", res.status),
              onerror: err => console.error("❌ Discord error:", err)
            });

          } catch (err) {
            console.warn("⚠️ BLE parse error:", err);
          }
        });

        log("✅ BLE event listener attached");
        return true;
      }
    }

    return false;
  };

  const poll = setInterval(() => {
    if (watchBLE()) clearInterval(poll);
  }, 1500);
})();