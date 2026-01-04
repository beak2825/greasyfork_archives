// ==UserScript==
// @name         Pterodactyl Panel Keyboard Navigation
// @namespace    https://discopika.tk
// @version      1.0.0
// @description  Navigate Pterodactyl panels with ease
// @author       mallusrgreat
// @match        https://*/server/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pterodactyl.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532903/Pterodactyl%20Panel%20Keyboard%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/532903/Pterodactyl%20Panel%20Keyboard%20Navigation.meta.js
// ==/UserScript==

(async function () {
  "use strict";
  const buttons = {};
  document.querySelectorAll("[class^='style-module']").forEach((element) => {
    buttons[element.textContent] = element;
  });
  const serverId = document.URL.match(
    /^https?:\/\/[a-z.]+\/server\/([a-z0-9]{8})/
  )[1];
  if (!serverId) return;
  const url = new URL(document.URL);
  const wsData = await fetch(
    `${url.protocol}//${url.hostname}/api/client/servers/${serverId}/websocket`,
    {
      referrer: `${url.protocol}//${url.hostname}/server/${serverId}`,
    }
  ).then((x) => x.json());
  const ws = new WebSocket(wsData.data.socket);
  ws.addEventListener("open", () => {
    console.log("PteroKeybinds | Connected to panel websocket");
    ws.send(
      JSON.stringify({
        event: "auth",
        args: [wsData.data.token],
      })
    );
  });
  ws.addEventListener("message", async (e) => {
    const data = JSON.parse(e.data);
    switch (data.event) {
      case "token expiring": {
        const wsData = await fetch(
          `${url.protocol}//${url.hostname}/api/client/servers/${serverId}/websocket`,
          {
            referrer: `${url.protocol}//${url.hostname}/server/${serverId}`,
          }
        ).then((x) => x.json());
        ws.send(
          JSON.stringify({
            event: "auth",
            args: [wsData.data.token],
          })
        );
      }
    }
  });
  document.addEventListener("keyup", (e) => {
    switch (e.code) {
      case "Numpad6":
      case "ArrowRight":
      case "KeyE": {
        const nav = document.querySelector("[class^='SubNavigation']");
        const active = nav.querySelector(".active");
        active.nextSibling?.click();
        return;
      }
      case "Numpad4":
      case "ArrowLeft":
      case "KeyQ": {
        const nav = document.querySelector("[class^='SubNavigation']");
        const active = nav.querySelector(".active");
        active.previousSibling?.click();
        return;
      }
      case "KeyA": {
        ws.send(
          JSON.stringify({
            event: "set state",
            args: ["start"],
          })
        );
        return;
      }
      case "KeyS": {
        ws.send(
          JSON.stringify({
            event: "set state",
            args: ["restart"],
          })
        );
        return;
      }
      case "KeyD": {
        ws.send(
          JSON.stringify({
            event: "set state",
            args: ["stop"],
          })
        );
        return;
      }
      case "KeyF": {
        ws.send(
          JSON.stringify({
            event: "set state",
            args: ["kill"],
          })
        );
        return;
      }
      case "KeyC": {
        const url = new URL(document.URL);
        if (
          url.pathname.endsWith(`${serverId}`) ||
          url.pathname.endsWith(`${serverId}/`)
        )
          return;
        window.location = `${url.protocol}//${url.hostname}/server/${serverId}`;
        return;
      }
    }
  });
})();
