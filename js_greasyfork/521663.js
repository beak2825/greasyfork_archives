// ==UserScript==
// @name         GhostCanvas
// @namespace    Definable
// @version      0.1.6
// @description  An SubModule for the Definable ModMenu for Drawaria.Online.
// @homepage     https://drawaria.online/profile/?uid=63196790-c7da-11ec-8266-c399f90709b7
// @author       ≺ᴄᴜʙᴇ³≻
// @match        https://drawaria.online/
// @match        https://drawaria.online/test
// @match        https://drawaria.online/room/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGRSURBVHhe7dkxbsJAEAXQP3ZJwyWQLOUENKGg5xYRR+AMHAHlFvQUpOEEkSxxCRpKPGmwlIyUxesMMWj+65g12vXXsGsAICIioqjEFqzJZKLfXx+Pxx/vsePW0NfbcauwhWgYgC0QEUWSPCPR41wdWu56w58CyXSQmehsU1eNXNYA5iIY2fG/UMUZwK7QcrVfVrUdb+WsF54dcL35gwgW3jcPACIYiWDRyOUw29SVHe/LLYBGLmsRjG3dmwjG1y5z4RYAgLkt3JHbXG4B3KPtf+M5l1sAzyq5Q+Z4ff9Mfm/39vH24rL28B3AAGwhmpufo65PVo+yB3Rdbyt8BzAAW4iGAdhCNAzAFqJJnpE5HuU5IFf4DmAAthDNzc9R12frR9kDuq63Fb4D3AK4/m7/LzzncgsAwM4W7shtLrcACi1XqjjZujdVnAotV7bel1sA+2VVF1pOVbH1bNGWKs6q2BZaTlN/jeVK7pDosasOLXe9bh1ARPSMkjskOuyqdtwa+no7boU/BRiALRARERFF8QWXXJ5ITbASawAAAABJRU5ErkJggg==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/521663/GhostCanvas.user.js
// @updateURL https://update.greasyfork.org/scripts/521663/GhostCanvas.meta.js
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
   * @typedef {Definable & {listOfPixels:object[],instructions:string[]&{addEventListener:(event:"delete"|"set",handler:(property:string,value:*)=>void)=>}}} GhostCanvas
   */

  /**
   * @param {Definable} definable
   * @param {DefinableCore} $core
   */
  function initialize(definable, $core) {
    /** @type {GhostCanvas} */
    const ghostcanvas = new $core("GhostCanvas", "ghost");
    definable.registerModule(ghostcanvas);
    ghostcanvas.listOfPixels = [];
    ghostcanvas.instructions = $core.helper.makeObservableArray();
    ghostcanvas.instructions.isRunning = false;

    let geometrizeAddon = ghostcanvas.constructor.runtime.find((e) => e.name === "Geometrize") || {};
    const ui = $core.UI;
    const player = $core.Player.noConflict;

    const originalCanvas = ui.querySelect("#canvas");
    const canvas = ui.createElement("canvas", {
      className: "position-fixed",
      style: "pointer-events: none; opacity: 0.6; box-shadow: rebeccapurple 0px 0px 2px 2px inset;",
    });
    const context = getOptimizedRenderingContext(canvas);
    document.body.appendChild(canvas);

    /* Row 1 */ {
      const row = ghostcanvas.createRow();

      {
        const input = ui.createInput("checkbox");
        const label = ui.createLabelFor(input, { title: "Toggle Visibility" });
        label.appendChild(ui.createIcon("low-vision"));
        label.className = label.className.replace("secondary", "success");
        input.addEventListener("input", function () {
          canvas.classList[input.checked ? "remove" : "add"]("d-none");
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Realign" });
        label.appendChild(ui.createIcon("arrows-alt"));
        input.addEventListener("click", function () {
          updatePositionAlt(originalCanvas, canvas);
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("file", { accept: "image/*" });
        const label = ui.createLabelFor(input, { title: "Add Image" });
        label.appendChild(ui.createIcon("plus"));
        label.className = label.className.replace("secondary", "info");
        input.addEventListener("input", function () {
          loadFileAsImage(input.files[0]).then((response) => {
            if (response.data) {
              /** @type {HTMLImageElement} */
              const image = response.data;
              image.classList.add("transformable");
              document.body.appendChild(image);
              input.value = null;
            }
          });
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Remove all images", style: "margin-left: auto;" });
        label.appendChild(ui.createIcon("trash"));
        label.className = label.className.replace("secondary", "warning");
        input.addEventListener("click", function () {
          globalThis["transformable"].target = null;
          const transformableImages = ui.querySelectAll(".transformable");
          Array.from(transformableImages).forEach((element) => element.remove());
        });
        row.appendChild(label);
      }
    }

    /* Row 2 */ {
      const row = ghostcanvas.createRow();

      // {
      //   const input = ui.createInput("button");
      //   const label = ui.createLabelFor(input, { title: "Save Image Position" });
      //   label.appendChild(ui.createIcon("print"));
      //   input.addEventListener("click", function () {
      //     ui.querySelectAll(".transformable").forEach((transformable) => {
      //       const placed = drawTransformedImage(context, transformable);
      //       if (!placed) console.debug("%o is out of bounds", transformable);
      //     });
      //   });
      //   row.appendChild(label);
      // }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Save Pixels" });
        label.appendChild(ui.createIcon("print"));

        input.addEventListener("click", function () {
          ui.querySelectAll(".transformable").forEach((transformable) => {
            const placed = drawTransformedImage(context, transformable);
            if (!placed) console.debug("%o is out of bounds", transformable);
          });
          getDefaultPixels(context, ghostcanvas);
        });

        row.appendChild(label);
      }

      {
        const input = ui.createInput("text", { title: "Pixels Buffer", readOnly: true, value: 0, id: "pixelbufferDisplay" });

        input.classList.add("col", "form-control-sm");

        row.appendChild(input);
      }
    }

    /* Row 3 */ {
      const row = ghostcanvas.createRow();

      {
        const input = ui.createInput("number", { title: "Color Tolerance", id: "comparePixelsColorTolerance", value: 16, min: 4, max: 128 });
        input.classList.add("col", "form-control-sm");
        row.appendChild(input);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Group by Y" });
        const rotatedIcon = ui.createIcon("bars");
        rotatedIcon.style.rotate = "90deg";
        label.appendChild(rotatedIcon);
        input.addEventListener("click", async function () {
          if (ghostcanvas.listOfPixels.length < 1) {
            await getDefaultPixels(context, ghostcanvas);
          }
          const sortedPixels = await sortPixelsByPosition.callAsWorker(ghostcanvas.listOfPixels, true);
          ghostcanvas.listOfPixels = sortedPixels;
          const groupedPixels = await groupPixelsByColor.callAsWorker(sortedPixels, ui.querySelect("#comparePixelsColorTolerance").value, false, areSameColor.toString(), true);
          ghostcanvas.listOfPixels = groupedPixels;
          ui.querySelect("#pixelbufferDisplay").value = groupedPixels.length;
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Group by X" });
        label.appendChild(ui.createIcon("bars"));
        input.addEventListener("click", async function () {
          if (ghostcanvas.listOfPixels.length < 1) {
            await getDefaultPixels(context, ghostcanvas);
          }
          const sortedPixels = await sortPixelsByPosition.callAsWorker(ghostcanvas.listOfPixels, false);
          ghostcanvas.listOfPixels = sortedPixels;
          const groupedPixels = await groupPixelsByColor.callAsWorker(sortedPixels, ui.querySelect("#comparePixelsColorTolerance").value, true, areSameColor.toString(), true);
          ghostcanvas.listOfPixels = groupedPixels;
          ui.querySelect("#pixelbufferDisplay").value = groupedPixels.length;
        });
        row.appendChild(label);
      }
    }

    /* Row 4 */ {
      const row = ghostcanvas.createRow();

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Sort by X (Left to Right)" });
        label.appendChild(ui.createIcon("arrow-right"));
        input.addEventListener("click", async function () {
          if (ghostcanvas.listOfPixels.length < 1) {
            await getDefaultPixels(context, ghostcanvas);
          }
          const sortedPixels = await sortPixelsByPosition.callAsWorker(ghostcanvas.listOfPixels, true);
          ghostcanvas.listOfPixels = sortedPixels;
          ui.querySelect("#pixelbufferDisplay").value = sortedPixels.length;
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Sort by Y (Top to Bottom)" });
        label.appendChild(ui.createIcon("arrow-down"));
        input.addEventListener("click", async function () {
          if (ghostcanvas.listOfPixels.length < 1) {
            await getDefaultPixels(context, ghostcanvas);
          }
          const sortedPixels = await sortPixelsByPosition.callAsWorker(ghostcanvas.listOfPixels, false);
          ghostcanvas.listOfPixels = sortedPixels;
          ui.querySelect("#pixelbufferDisplay").value = sortedPixels.length;
        });
        row.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { title: "Sort by Color" });
        label.appendChild(ui.createIcon("sort-alpha-down"));
        input.addEventListener("click", async function () {
          if (ghostcanvas.listOfPixels.length < 1) {
            await getDefaultPixels(context, ghostcanvas);
          }
          const sortedPixels = await sortPixelsByColor.callAsWorker(ghostcanvas.listOfPixels);
          ghostcanvas.listOfPixels = sortedPixels;
          ui.querySelect("#pixelbufferDisplay").value = sortedPixels.length;
        });
        row.appendChild(label);
      }
    }

    /* Row 5 */ {
      ghostcanvas.__contaier.appendChild(ui.querySelect("#chatbox_messages").previousElementSibling.cloneNode(false));
      const row = ghostcanvas.createRow();

      const parseInstructionsInput = ui.createInput("button");
      const parseInstructionsLabel = ui.createLabelFor(parseInstructionsInput, { title: "Generate Instructions", textContent: "Load" });
      row.appendChild(parseInstructionsLabel);
      parseInstructionsInput.addEventListener("click", function () {
        ghostcanvas.instructions.push(...ghostcanvas.listOfPixels.map((o) => ghostcanvas.Player.parseMessage.drawcmd.line(o.x, o.y, o.x + o.width, o.y + o.height, `rgb(${o.r},${o.g},${o.b})`, 2)));
        savedInstructionsCountInput.value = ghostcanvas.instructions.length;
      });

      const importInstructionsFromGeometrizeAddonInput = ui.createInput("button", { disabled: "disabled" });
      const importInstructionsFromGeometrizeAddonLabel = ui.createLabelFor(importInstructionsFromGeometrizeAddonInput, { title: "Import Instructions from Geometrize", textContent: "Import" });
      importInstructionsFromGeometrizeAddonLabel.classList.add("disabled");
      row.appendChild(importInstructionsFromGeometrizeAddonLabel);
      setTimeout(() => {
        geometrizeAddon = ghostcanvas.constructor.runtime.find((e) => e.name === "Geometrize");
        if (geometrizeAddon && globalThis["geometrize"]) {
          importInstructionsFromGeometrizeAddonLabel.classList.remove("disabled");
          importInstructionsFromGeometrizeAddonInput.removeAttribute("disabled");
        }
      }, 1000);
      importInstructionsFromGeometrizeAddonInput.addEventListener("click", function () {
        ghostcanvas.instructions.length = 0;
        ghostcanvas.instructions.push(...geometrizeAddon.export());
        savedInstructionsCountInput.value = ghostcanvas.instructions.length;
      });

      const savedInstructionsCountInput = ui.createInput("text", { readOnly: true, title: "Total length of Instructions generated", value: 0, id: "savedInstructionsCountInput" });
      savedInstructionsCountInput.classList.add("col", "form-control-sm");
      row.appendChild(savedInstructionsCountInput);
      ghostcanvas.instructions.addEventListener("delete", (prop, val) => {
        savedInstructionsCountInput.value = ghostcanvas.instructions.length;
      });
    }

    /* Row 6 & 7 */ {
      const row6 = ghostcanvas.createRow();
      const row7 = ghostcanvas.createRow();

      const bulkSizeInput = ui.createInput("number", { title: "Bulk Execution Size", min: 1, value: 100 });
      bulkSizeInput.classList.add("col", "form-control-sm");
      row6.appendChild(bulkSizeInput);

      const intervalInput = ui.createInput("number", { title: "Wait interval between Executions (Milliseconds)", min: 1, value: 1000 });
      intervalInput.classList.add("col", "form-control-sm");
      row6.appendChild(intervalInput);

      {
        const input = ui.createInput("checkbox", { id: "gcIsRunning" });
        const label = ui.createLabelFor(input, { textContent: "Start" });
        label.classList.add("col");
        label.className = label.className.replace("secondary", "success");
        input.addEventListener("input", function () {
          ghostcanvas.instructions.isRunning = input.checked;
          execute(ghostcanvas.instructions, player.send, Number(intervalInput.value), Number(bulkSizeInput.value)).finally(() => {
            input.checked = false;
            label.classList.remove("active");
            ui.querySelect("#savedInstructionsCountInput").value = ghostcanvas.instructions.length;
          });
        });
        row7.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { textContent: "Stop" });
        label.classList.add("col");
        label.className = label.className.replace("secondary", "warning");
        input.addEventListener("click", function () {
          ui.querySelect("#gcIsRunning").checked = false;
          ui.querySelect("#gcIsRunning").parentElement.classList.remove("active");
          ghostcanvas.instructions.isRunning = false;
        });
        row7.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { textContent: "Step" });
        label.classList.add("col");
        input.addEventListener("click", function () {
          player.send(ghostcanvas.instructions.shift());
        });
        row7.appendChild(label);
      }

      {
        const input = ui.createInput("button");
        const label = ui.createLabelFor(input, { textContent: "Reset" });
        label.classList.add("col");
        label.className = label.className.replace("secondary", "danger");
        input.addEventListener("click", function () {
          ghostcanvas.instructions.length = 0;
          ui.querySelect("#gcIsRunning").checked = false;
          ui.querySelect("#gcIsRunning").parentElement.classList.remove("active");
          ui.querySelect("#savedInstructionsCountInput").value = 0;
        });
        row7.appendChild(label);
      }
    }

    updatePositionAlt(originalCanvas, canvas);
    canvas.classList.add("d-none");
    ui.querySelect("#definableStyles").textContent += "\n.transformable { position: fixed; top: 0px; left: 0px; }";
  }

  async function getDefaultPixels(context, ghostcanvas) {
    const [imageData, width] = getImageDataForProcessing(context);
    const allPixels = await convertImageDataToPixels.callAsWorker(imageData, width);
    const nonTransparentPixels = await filterForNonTransparentPixels.callAsWorker(allPixels, 128);

    ghostcanvas.listOfPixels = nonTransparentPixels;
    document.querySelector("#pixelbufferDisplay").value = nonTransparentPixels.length;
    return true;
  }

  /**
   * @param {HTMLCanvasElement} canvas
   * @returns {CanvasRenderingContext2D}
   */
  function getOptimizedRenderingContext(canvas) {
    if (canvas.optimizedRenderingContext) return canvas.optimizedRenderingContext;
    const context = canvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    canvas.optimizedRenderingContext = context;
    return context;
  }

  /**
   * @param {File} file
   * @returns {Promise<PromiseResponse>}
   */
  function loadFileAsImage(file) {
    return new Promise((resolve, reject) => {
      if (!(FileReader && file)) {
        reject({ data: undefined, error: "Native FileReader not present." });
      } else {
        const reader = new FileReader();
        reader.onload = function () {
          const image = new Image();
          image.src = reader.result;
          image.onload = function () {
            resolve({ data: image, error: undefined });
          };
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @returns {[Uint8ClampedArray, number]}
   */
  function getImageDataForProcessing(context) {
    return [context.getImageData(0, 0, context.canvas.width, context.canvas.height).data, context.canvas.width];
  }

  /**
   * Get Pixels
   * @param {Uint8ClampedArray} imageData
   * @param {number} width
   * @returns {Array<Pixel>}
   */
  function convertImageDataToPixels(imageData, width) {
    const pixelCount = imageData.length / 4;
    const pixels = new Array(pixelCount);
    const widthFactor = 1 / width;

    for (let i = 0; i < pixelCount; i++) {
      const index = i * 4;
      const x = i % width;
      const y = (i * widthFactor) | 0;
      const [r, g, b, a] = imageData.slice(index, index + 4);
      pixels[i] = { x, y, r, g, b, a };
    }

    return pixels;
  }

  /**
   * Filter for NonTransparent Pixels
   * @param {Array<Pixel>} pixels
   * @param {number} [threshold=64]
   * @returns {Array<Pixel>}
   */
  function filterForNonTransparentPixels(pixels, threshold = 64) {
    return pixels.filter(({ a: alpha }) => alpha > threshold);
  }

  /**
   * Check if the two provided Pixels are close to similar in the rgb spectrum.
   * @param {Pixel} pixel1 - The first color object with r, g, b, and a properties.
   * @param {Pixel} pixel2 - The second color object with r, g, b, and a properties.
   * @param {number} tolerance - The maximum allowed difference for each color component.
   * @param {boolean} [ignoreAphaValue=true] - Should Alphavalues be ignored.
   * @returns {boolean} - True if the colors are considered the same, false otherwise.
   */
  function areSameColor(pixel1, pixel2, tolerance, ignoreAphaValue = true) {
    const dr = Math.abs(pixel1.r - pixel2.r);
    const dg = Math.abs(pixel1.g - pixel2.g);
    const db = Math.abs(pixel1.b - pixel2.b);
    const da_ok = !ignoreAphaValue ? Math.abs(pixel1.a - pixel2.a) <= tolerance : true;

    return dr <= tolerance && dg <= tolerance && db <= tolerance && da_ok;
  }

  /**
   * Combine Pixels to Areas by proximity and color.
   * @param {Array<Pixel>} data - Array of Pixel objects.
   * @param {number} [tolerance=32] - The maximum allowed difference for each color component.
   * @param {boolean} [groupByY=true] - If true, group by y then x; if false, group by y then x.
   * @param {string} comparisonFunctionAsString - The Function to be used for Color Comparison as a string.
   * @param {boolean} [ignoreAphaValue=true] - Should Alphavalues be ignored.
   * @returns {Array<Area>} - Array of Area objects.
   */
  function groupPixelsByColor(data, tolerance = 32, groupByY = true, comparisonFunctionAsString = undefined, ignoreAphaValue = true) {
    if (data.length === 0) return [];

    const comparisonFunction =
      comparisonFunctionAsString && typeof comparisonFunctionAsString === "string"
        ? new Function("return (" + comparisonFunctionAsString + ")(...arguments)")
        : areSameColor ?? new Function("return false;");

    const nameOfValueToIncrease = groupByY ? "width" : "height";
    const nameOfValueToBeSimilar = groupByY ? "y" : "x";
    const nameOfValueToNOTBeSimilar = !groupByY ? "y" : "x";

    data.sort();

    const lines = new Array(data.length);
    let newLineIndex = 0;
    let currentLine = {
      x: data[0].x,
      y: data[0].y,
      width: 0,
      height: 0,
      r: data[0].r,
      g: data[0].g,
      b: data[0].b,
      a: data[0].a,
    };

    for (let i = 1; i < data.length; i++) {
      const pixel = data[i];
      const lastPixel = data[i ? i - 1 : 0];
      if (
        pixel[nameOfValueToBeSimilar] === currentLine[nameOfValueToBeSimilar] &&
        comparisonFunction(currentLine, pixel, tolerance, ignoreAphaValue) &&
        Math.abs(lastPixel[nameOfValueToNOTBeSimilar] - pixel[nameOfValueToNOTBeSimilar]) < 2
      ) {
        currentLine[nameOfValueToIncrease]++;
      } else {
        lines[newLineIndex++] = currentLine;
        currentLine = {
          x: pixel.x,
          y: pixel.y,
          width: 1,
          height: 1,
          r: pixel.r,
          g: pixel.g,
          b: pixel.b,
          a: pixel.a,
        };
      }
    }

    // Push the last line
    lines[newLineIndex] = currentLine;

    return lines.slice(0, newLineIndex + 1);
  }

  /**
   * Sort Pixellike Object by their Position.
   * @param {Array<Pixel>} pixels - Array of Pixel objects.
   * @param {boolean} [sortByX=true] - If true, sort by x then y; if false, sort by y then x.
   * @returns {Array<Pixel>} - Sorted array of Pixel objects.
   */
  function sortPixelsByPosition(pixels, sortByX = true) {
    const sortFunction = sortByX
      ? function (a, b) {
          return a.x - b.x || a.y - b.y;
        }
      : function (a, b) {
          return a.y - b.y || a.x - b.x;
        };
    return pixels.sort(sortFunction);
  }

  /**
   * Sort Pixellike Object by their Color.
   * @param {Array<Pixel>} pixels - Array of Pixel objects.
   * @returns {Array<Pixel>}
   */
  function sortPixelsByColor(pixels) {
    return pixels.sort(function (a, b) {
      return a.r - b.r || a.g - b.g || a.b - b.b;
    });
  }

  /**
   * Get the Color of the Pixel formatted as rgb.
   * @param {Pixel|Area} pixel
   */
  function getPixelColorAsRGB(pixel) {
    return `rgb(${pixel.r},${pixel.g},${pixel.b})`;
  }
  /**
   * Check if two HTMLElements are overlapping over each other.
   * @param {HTMLElement} element1
   * @param {HTMLElement} element2
   */
  function areOverlapping(element1, element2) {
    const bbox1 = element1.getBoundingClientRect();
    const bbox2 = element2.getBoundingClientRect();
    return bbox1.bottom > bbox2.top || bbox1.right > bbox2.left || bbox1.top < bbox2.bottom || bbox1.left < bbox2.right;
  }

  /**
   * Get the position of the image relative to the canvas.
   * @param {HTMLCanvasElement} canvas
   * @param {HTMLImageElement} image
   * @returns
   */
  function getImagePositionRelativeToCanvas(canvas, image) {
    const rect = canvas.getBoundingClientRect();
    const style = window.getComputedStyle(image);
    const x = parseFloat(style.left);
    const y = parseFloat(style.top);
    return [x - rect.left, y - rect.top];
  }

  /**
   * Draw the image on the canvas with its transformations.
   * @param {CanvasRenderingContext2D} context
   * @param {HTMLImageElement} image
   */
  function drawTransformedImage(context, image) {
    if (!areOverlapping(context.canvas, image)) return false;

    // Get the computed style of the image
    const style = window.getComputedStyle(image);
    const transform = style.transform;
    const width = parseFloat(style.width);
    const height = parseFloat(style.height);

    // Save the current context state
    context.save();

    // Calculate the position of the image on the canvas
    const [x, y] = getImagePositionRelativeToCanvas(context.canvas, image);

    // Calculate the scaling factor
    const scaleX = context.canvas.width / context.canvas.clientWidth;
    const scaleY = context.canvas.height / context.canvas.clientHeight;

    // Apply the CSS transform to the canvas context
    context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
    const matrix = new DOMMatrix(transform);

    // Translate to the center of the image
    context.translate((x + width / 2) * scaleX, (y + height / 2) * scaleY);
    // Apply the rotation
    context.transform(matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f);
    // Translate back
    context.translate((-width / 2) * scaleX, (-height / 2) * scaleY);

    // Draw the image on the canvas
    context.drawImage(image, 0, 0, width * scaleX, height * scaleY);

    // Restore the context to its original state
    context.restore();
    return true;
  }

  /**
   * @param {HTMLElement} parent
   * @param {HTMLElement} child
   */
  function updatePosition(parent, child) {
    const rect = parent.getBoundingClientRect();
    child.style.top = rect.top.toFixed(0) + "px";
    child.style.left = rect.left.toFixed(0) + "px";
    child.style.width = rect.width.toFixed(0) + "px";
    child.style.height = rect.height.toFixed(0) + "px";
    child.width = 1000;
    child.height = 1000;
  }

  function updatePositionAlt(parent, child) {
    const rect = parent.getBoundingClientRect();
    child.style.top = rect.top.toFixed(0) + "px";
    child.style.left = rect.left.toFixed(0) + "px";
    child.width = rect.width.toFixed(0);
    child.height = rect.height.toFixed(0);
  }

  /**
   * @param {string[]} instructions
   * @param {Function} callback
   * @param {number} [interval=1000]
   * @param {number} [bulkSize=100]
   */
  function execute(instructions, callback, interval = 1000, bulkSize = 100) {
    return new Promise((resolve, reject) => {
      if (!instructions || !callback) {
        reject();
        return;
      }
      if (!instructions.isRunning || !instructions.length) {
        resolve();
        return;
      }
      const intervalID = setInterval(() => {
        instructions.splice(0, bulkSize).forEach((s) => {
          callback(s);
        });
        if (!instructions.length || !instructions.isRunning) {
          clearInterval(intervalID);
          instructions.isRunning = false;
          resolve();
          return;
        }
      }, interval);
    });
  }

  window.addEventListener("definable:init", function (event) {
    /** @type {Definable} */
    const main = event.detail.main;
    /** @type {DefinableCore} */
    const core = event.detail.core;
    initialize(main, core);
  });
})();
