// ==UserScript==
// @name         Advanced Brush Options
// @namespace    Definable
// @version      0.1.5
// @description  An SubModule for the Definable ModMenu for Drawaria.Online.
// @homepage     https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @author       ≺ᴄᴜʙᴇ³≻
// @match        https://drawaria.online/
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGRSURBVHhe7dkxbsJAEAXQP3ZJwyWQLOUENKGg5xYRR+AMHAHlFvQUpOEEkSxxCRpKPGmwlIyUxesMMWj+65g12vXXsGsAICIioqjEFqzJZKLfXx+Pxx/vsePW0NfbcauwhWgYgC0QEUWSPCPR41wdWu56w58CyXSQmehsU1eNXNYA5iIY2fG/UMUZwK7QcrVfVrUdb+WsF54dcL35gwgW3jcPACIYiWDRyOUw29SVHe/LLYBGLmsRjG3dmwjG1y5z4RYAgLkt3JHbXG4B3KPtf+M5l1sAzyq5Q+Z4ff9Mfm/39vH24rL28B3AAGwhmpufo65PVo+yB3Rdbyt8BzAAW4iGAdhCNAzAFqJJnpE5HuU5IFf4DmAAthDNzc9R12frR9kDuq63Fb4D3AK4/m7/LzzncgsAwM4W7shtLrcACi1XqjjZujdVnAotV7bel1sA+2VVF1pOVbH1bNGWKs6q2BZaTlN/jeVK7pDosasOLXe9bh1ARPSMkjskOuyqdtwa+no7boU/BRiALRARERFF8QWXXJ5ITbASawAAAABJRU5ErkJggg==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521659/Advanced%20Brush%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/521659/Advanced%20Brush%20Options.meta.js
// ==/UserScript==

//#region TypeDefinitions
/**
 * @typedef {Object} PlayerInstance
 * @property {string} name - The name of the player.
 * @property {string} uid - The unique identifier for the player.
 * @property {string} wt - The weight of the player.
 * @property {string} roomID - The room ID the player is in.
 * @property {WebSocket} socket - The WebSocket connection for the player.
 * @property {Map<string, Function[]>} events - The events map for the player.
 * @property {boolean} isConnected - Whether the player is connected.
 * @property {(invitelink:string)=>void} connect - Connects the player to a room.
 * @property {()=>void} disconnect - Disconnects the player.
 * @property {()=>void} reconnect - Reconnects the player.
 * @property {(invitelink:string)=>void} enterRoom - Enters a room.
 * @property {()=>void} nextRoom - Moves the player to the next room.
 * @property {()=>void} leaveRoom - Leaves the current room.
 * @property {(payload:string)=>void} send - Sends a message through the WebSocket.
 * @property {(event:string,handler:Function)=>void} addEventListener - Adds an event listener.
 * @property {(event:string)=>boolean} hasEventListener - Checks if an event listener exists.
 * @property {()=>void} __invokeEvent - Invokes an event.
 */

/**
 * @typedef {Object} DrawariaOnlineMessageTypes
 * @property {(message: string) => string} chatmsg - Sends a chat message.
 * @property {() => string} passturn - Passes the turn.
 * @property {(playerid: number|string) => string} pgdrawvote - Votes for a player to draw.
 * @property {() => string} pgswtichroom - Switches the room.
 * @property {() => string} playerafk - Marks the player as AFK.
 * @property {() => string} playerrated - Rates the player.
 * @property {(gestureid: number|string) => string} sendgesture - Sends a gesture.
 * @property {() => string} sendvote - Sends a vote.
 * @property {(playerid: number|string) => string} sendvotekick - Votes to kick a player.
 * @property {(wordid: number|string) => string} wordselected - Selects a word.
 * @property {Object} clientcmd - Client commands.
 * @property {(itemid: number|string, isactive: boolean) => string} clientcmd.activateitem - Activates an item.
 * @property {(itemid: number|string) => string} clientcmd.buyitem - Buys an item.
 * @property {(itemid: number|string, target: "zindex"|"shared", value: any) => string} clientcmd.canvasobj_changeattr - Changes an attribute of a canvas object.
 * @property {() => string} clientcmd.canvasobj_getobjects - Gets canvas objects.
 * @property {(itemid: number|string) => string} clientcmd.canvasobj_remove - Removes a canvas object.
 * @property {(itemid: number|string, positionX: number|string, positionY: number|string, speed: number|string) => string} clientcmd.canvasobj_setposition - Sets the position of a canvas object.
 * @property {(itemid: number|string, rotation: number|string) => string} clientcmd.canvasobj_setrotation - Sets the rotation of a canvas object.
 * @property {(value: any) => string} clientcmd.customvoting_setvote - Sets a custom vote.
 * @property {(value: any) => string} clientcmd.getfpid - Gets the FPID.
 * @property {() => string} clientcmd.getinventory - Gets the inventory.
 * @property {() => string} clientcmd.getspawnsstate - Gets the spawn state.
 * @property {(positionX: number|string, positionY: number|string) => string} clientcmd.moveavatar - Moves the avatar.
 * @property {() => string} clientcmd.setavatarprop - Sets the avatar properties.
 * @property {(flagid: number|string, isactive: boolean) => string} clientcmd.setstatusflag - Sets a status flag.
 * @property {(playerid: number|string, tokenid: number|string) => string} clientcmd.settoken - Sets a token.
 * @property {(playerid: number|string, value: any) => string} clientcmd.snapchatmessage - Sends a Snapchat message.
 * @property {() => string} clientcmd.spawnavatar - Spawns an avatar.
 * @property {() => string} clientcmd.startrollbackvoting - Starts rollback voting.
 * @property {() => string} clientcmd.trackforwardvoting - Tracks forward voting.
 * @property {(trackid: number|string) => string} clientcmd.votetrack - Votes for a track.
 * @property {(roomID: string, name?: string, uid?: string, wt?: string) => string} startplay - Starts the play.
 * @property {Object} clientnotify - Client notifications.
 * @property {(playerid: number|string) => string} clientnotify.requestcanvas - Requests a canvas.
 * @property {(playerid: number|string, base64: string) => string} clientnotify.respondcanvas - Responds with a canvas.
 * @property {(playerid: number|string, imageid: number|string) => string} clientnotify.galleryupload - Uploads to the gallery.
 * @property {(playerid: number|string, type: any) => string} clientnotify.warning - Sends a warning.
 * @property {(playerid: number|string, targetname: string, mute?: boolean) => string} clientnotify.mute - Mutes a player.
 * @property {(playerid: number|string, targetname: string, hide?: boolean) => string} clientnotify.hide - Hides a player.
 * @property {(playerid: number|string, reason: string, targetname: string) => string} clientnotify.report - Reports a player.
 * @property {Object} drawcmd - Drawing commands.
 * @property {(x1: number|string, y1: number|string, x2: number|string, y2: number|string, color: number|string, size?: number|string, ispixel?: boolean, playerid?: number|string) => string} drawcmd.line - Draws a line.
 * @property {(x1: number|string, y1: number|string, x2: number|string, y2: number|string, color: number|string, size: number|string, ispixel?: boolean, playerid?: number|string) => string} drawcmd.erase - Erases a part of the drawing.
 * @property {(x: number|string, y: number|string, color: number|string, tolerance: number|string, r: number|string, g: number|string, b: number|string, a: number|string) => string} drawcmd.flood - Flood fills an area.
 * @property {(playerid: number|string) => string} drawcmd.undo - Undoes the last action.
 * @property {() => string} drawcmd.clear - Clears the drawing.
 */

/**
 * @typedef {Object} PlayerClass
 * @property {PlayerInstance[]} instances
 * @property {PlayerInstance} noConflict
 * @property {(inviteLink:string)=>URL} getSocketServerURL
 * @property {(inviteLink:string)=>string} getRoomID
 * @property {DrawariaOnlineMessageTypes} parseMessage
 */

/**
 * @typedef {Object} UI
 * @property {(selectors: string, parentElement?: ParentNode) => Element|null} querySelect - Returns the first element that is a descendant of node that matches selectors.
 * @property {(selectors: string, parentElement?: ParentNode) => NodeListOf<Element>} querySelectAll - Returns all element descendants of node that match selectors.
 * @property {(tagName: string, properties?: object) => Element} createElement - Creates an element and assigns properties to it.
 * @property {(element: Element, attributes: object) => void} setAttributes - Assigns attributes to an element.
 * @property {(element: Element, styles: object) => void} setStyles - Assigns styles to an element.
 * @property {(name?: string) => HTMLDivElement} createContainer - Creates a container element.
 * @property {() => HTMLDivElement} createRow - Creates a row element.
 * @property {(name: string) => HTMLElement} createIcon - Creates an icon element.
 * @property {(type: string, properties?: object) => HTMLInputElement} createInput - Creates an input element.
 * @property {(input: HTMLInputElement, properties?: object) => HTMLLabelElement} createLabelFor - Creates a label for an input element.
 * @property {(className?: string) => HTMLElement & { show: Function, hide: Function }} createSpinner - Creates a spinner element.
 * @property {(input: HTMLInputElement, addon: HTMLLabelElement|HTMLInputElement|HTMLButtonElement|HTMLElement) => HTMLDivElement} createGroup - Creates an input group element.
 * @property {(inputs: Array<HTMLLabelElement|HTMLInputElement|HTMLButtonElement|HTMLElement>) => HTMLDivElement} createInputGroup - Creates an input group element.
 */

/**
 * @typedef {Object} Other
 * @property {(message: string, styles?: string, application?: string) => void} log - Logs a message with styles.
 * @property {(size?: number) => string} uid - Generates a random UID.
 * @property {(byteArray: number[]) => string} toHexString - Converts a byte array to a hex string.
 * @property {(key: string, value: string) => void} setCookie - Sets a cookie.
 * @property {() => Array<*>&{addEventListener:(event:"delete"|"set",handler:(property:string,value:*)=>void)=>}} makeObservableArray - Creates an observable array.
 * @property {(message: string) => (Array<any> | object)} tryParseJSON - Tries to parse a JSON string.
 */

/**
 * @class
 * @typedef {Object} DefinableCore
 * @property {PlayerClass} Player
 * @property {UI} UI
 * @property {Other} helper
 */

/**
 * @typedef {Object} Definable
 * @property {PlayerClass} Player
 * @property {UI} UI
 * @property {()=>HTMLElement} createRow
 * @property {(submodule:Core)=>void} registerModule
 */

/**
 * @typedef {Object} Position
 * @prop {number} x
 * @prop {number} y
 */

/**
 * @typedef {Object} Color
 * @prop {number} r
 * @prop {number} g
 * @prop {number} b
 * @prop {number} a
 */

/**
 * @typedef {Object} Volume
 * @prop {number} width
 * @prop {number} height
 */

/**
 * @typedef {Position & Color} Pixel
 */

/**
 * @typedef {Pixel & Volume} Area
 */

/**
 * @typedef {Object} PromiseResponse
 * @prop {*} data
 * @prop {Error|string|undefined} error
 */
//#endregion TypeDefinitions

(function () {
  "use strict";

  /**
   * @param {Definable} definable
   * @param {DefinableCore} $core
   */
  function initialize(definable, $core) {
    /** @type {Definable} */
    const advancedbrush = new $core("Advanced Brush", "paint-brush");
    definable.registerModule(advancedbrush);
    const ui = $core.UI;

    /* Custom Max Size */ {
      const originalBrushSizeInput = ui.querySelect("#drawwidthrange");

      originalBrushSizeInput.min = -2000;
      originalBrushSizeInput.max = 48;

      ui.querySelectAll(".drawcontrols-button").forEach((element) => {
        element.classList.remove("drawcontrols-disabled");
      });
    }

    /* Toggle Brush Size Slider Input */ {
      const row = advancedbrush.createRow();

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Switch to Brush Slider" });
        label.appendChild(ui.createIcon("adjust"));
        label.classList.add("col");
        input.addEventListener("click", function () {
          document.querySelectorAll(".drawcontrols-disabled").forEach((e) => e.classList.remove("drawcontrols-disabled"));
          document.querySelector(".drawcontrols-button:has(#drawwidthrange)").style.display = "initial";
          document.querySelector("#drawwidthrange+span").click();
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("checkbox");
        const label = ui.createLabelFor(input, { title: "Enable Advanced Brush Options" });
        label.appendChild(ui.createIcon("unlock"));
        label.classList.add("col");
        new MutationObserver((mutations) => {
          if (input.checked)
            if (mutations[0].target.style != "display:none") {
              ui.querySelectAll("div", mutations[0].target).forEach((element) => {
                element.removeAttribute("style");
              });
            }
        }).observe(ui.querySelect(".drawcontrols-popuplist"), {
          attributes: true,
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("checkbox");
        const label = ui.createLabelFor(input, { title: "Enable rapid Color Change" });
        label.appendChild(ui.createIcon("adjust"));
        label.classList.add("col");
        input.addEventListener("input", function () {
          const colorflowSpeedInput = document.querySelector('input[data-localprop="colorflow"]');
          const colorflowTypeSelect = document.querySelector('select[data-localprop="colorautochange"]');
          if (input.checked) {
            colorflowTypeSelect.value = "2";
            colorflowSpeedInput.max = 10;
            colorflowSpeedInput.value = 10;
          } else {
            colorflowTypeSelect.value = "0";
            colorflowSpeedInput.max = 1;
            colorflowSpeedInput.value = 0;
          }
          document.querySelector(".drawcontrols-settingscontainer:has([data-localprop='colorautochange'])").dispatchEvent(new CustomEvent("change"));
        });
        row.appendChild(label);
      }
    }

    // /* Custom Brush Preview */ {
    //   var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    //   var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    //   svg.setAttribute("aria-hidden", "true");
    //   svg.setAttribute("viewbox", "0 0 100 100");
    //   svg.setAttribute("width", "100px");
    //   svg.setAttribute("height", "100px");

    //   circle.setAttribute("cx", "50");
    //   circle.setAttribute("cy", "50");
    //   circle.setAttribute("r", "50");
    //   circle.setAttribute("fill", "#000000");

    //   svg.appendChild(circle);
    //   document.body.appendChild(svg);

    //   /** @type {HTMLCanvasElement} */
    //   const originalCanvas = ui.querySelect("canvas#canvas");

    //   originalCanvas.addEventListener("mouseenter", function (event) {
    //     console.log("mouseenter %o", event);
    //   });
    //   originalCanvas.addEventListener("mouseleave", function (event) {
    //     console.log("mouseleave %o", event);
    //   });
    //   originalCanvas.addEventListener("mousemove", function (event) {
    //     console.log("mousemove %o", event);
    //   });
    // }
  }

  window.addEventListener("definable:init", function (event) {
    const { main, core } = event.detail;
    if (!main || !core) return console.error("main: %o & core: %o", main, core);
    initialize(main, core);
  });
})();
