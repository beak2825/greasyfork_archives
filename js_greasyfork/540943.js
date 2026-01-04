// ==UserScript==
// @name        Auto leveling - discord.com
// @namespace   https://github.com/Thibb1
// @match       https://*.discord.com/*
// @grant       none
// @version     1.1
// @author      Thibb1
// @description Bare bone tool to auto level up on Discord servers, send messages automatically
// @require     https://cdn.jsdelivr.net/npm/lil-gui@0.19.2/dist/lil-gui.umd.min.js
// @license     GPL
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/540943/Auto%20leveling%20-%20discordcom.user.js
// @updateURL https://update.greasyfork.org/scripts/540943/Auto%20leveling%20-%20discordcom.meta.js
// ==/UserScript==


(function() {
  'use strict';
  function getToken() {
    window.dispatchEvent(new Event('beforeunload'));
    const LS = document.body.appendChild(document.createElement('iframe')).contentWindow.localStorage;
    return JSON.parse(LS.token);
  }

  let __localStorage = localStorage;
  let token = getToken();
  let lastMessageId = null;

  const gui = new lil.GUI();

  const settings = {
    autoSendText: false,
    autoRemoveLast: true,
    randomText: true,
    myString: 'hello',
    autoInterval: 60,
    randomTextLen: 5,
    testSendText: sendText
  };
  gui.add(settings, 'autoSendText');
  gui.add(settings, 'autoRemoveLast');
  gui.add(settings, 'randomText');
  gui.add(settings, 'myString');
  gui.add(settings, 'randomTextLen', 1, 25, 1);

  function autoSend() {
    if (!settings.autoSendText) return;
    sendText();
  }

  async function discordApi(method, route, body) {
    return await fetch(route, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": token,
      },
      ...(body != null && { body: JSON.stringify(body) })
    });
  }

  async function sendText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomString = '';
    for (let i = 0; i < settings.randomTextLen; i++) {
      randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const text = settings.randomText ? randomString : settings.myString;
    const channelStore = JSON.parse(__localStorage.getItem("SelectedChannelStore"));
    const channelId = channelStore.selectedChannelId;
    if (settings.autoRemoveLast && lastMessageId) {
      await discordApi('DELETE', `/api/v9/channels/${channelId}/messages/${lastMessageId}`)
        .then(response => {
          if (!response.ok) {
            console.error('Error deleting message:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error deleting message:', error);
        });
    }
    await discordApi('POST', `/api/v9/channels/${channelId}/messages`, { content: text, tts: false })
      .then(response => {
        if (!response.ok) {
          console.error('Error sending message:', response.statusText);
        } else {
          response.json().then(data => {lastMessageId = data.id; });
        }
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }

  let autoSendInterval;
  function startAutoSend() {
    if (autoSendInterval) {
      clearInterval(autoSendInterval);
    }
    if (settings.autoInterval > 0) {
      autoSendInterval = setInterval(autoSend, settings.autoInterval * 1000);
    }
  }
  gui.add(settings, 'autoInterval', 0, 120, 5).onChange(startAutoSend);
  gui.add(settings, 'testSendText');
  startAutoSend();
})();