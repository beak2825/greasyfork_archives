// ==UserScript==
// @name        ButtEOS
// @namespace   Violentmonkey Scripts
// @grant       none
// @match       *://milovana.com/webteases/showtease.php
// @match       *://milovana.com/eos/editor/*
// @match       *://eosscript.com/*
// @license     BSD
// @version     1.1
// @author      cfs6t08p
// @description 2/21/2022, 9:26:31 PM
// @downloadURL https://update.greasyfork.org/scripts/440634/ButtEOS.user.js
// @updateURL https://update.greasyfork.org/scripts/440634/ButtEOS.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

function mod(a, b) {
  return ((a % b) + b) % b;
}

function actionIndex(pattern, time) {
  for(let a = 0; a < pattern.numActions; a++) {
    if(pattern.actions[a].at > time) {
      return a;
    }
  }
}

function positionAt(pattern, time, index) {
  if(pattern.actions[index].at > time) {
    let a1 = pattern.actions[mod((index - 1), pattern.numActions)];
    let a2 = pattern.actions[index];

    let a1Wrap = mod(a1.at, pattern.patternLength);

    let dp = a2.pos - a1.pos;
    let dt = a2.at - a1Wrap;

    let alpha = (time - a1Wrap) / dt;

    return 99 - (a1.pos + alpha * dp);
  }
}

function vibe(level) {
  window.parent.postMessage({buttEOS: true, vib: {level: level}}, "https://milovana.com/webteases/*");
}

function linear(position, duration) {
  window.parent.postMessage({buttEOS: true, linear: {position: position, duration: duration }}, "https://milovana.com/webteases/*");
}

if(document.getElementById("eosContainer")) {
  let eos = document.getElementById("eosContainer");
  let bod = document.body;

  let div = document.createElement("div");

  div.style = "position: absolute; left: 20px; top: 40px; width: 160px; z-index: 100000";

  bod.append(div);

  let bar = document.createElement("div");
  let fill = document.createElement("div");
  let arrow = document.createElement("div");
  let line = document.createElement("div");
  let text = document.createElement("div");

  bar.style = "position: absolute; left: 20px; height: 80%; bottom: 10%; width: 50px; border-top-left-radius: 25px; border-top-right-radius: 25px; background-color: #ffffff20; visibility: hidden;";
  fill.style = "position: absolute; left: 7px; width: 36px; bottom: 0px; background-color: #bb55bbcc;";
  arrow.style = "position: absolute; left: 7px; width: 36px; height: 18px; border-top-left-radius: 18px; border-top-right-radius: 18px; background-color: #bb55bbcc;";
  line.style = "position: absolute; width: 100%; height: 4px; bottom: 15%; background-color: #ffff00cc;";
  text.style = "position: absolute; width: 100%; height: 10%; bottom: 0px; color: white; padding-top: 5px;";

  bar.append(fill);
  bar.append(arrow);
  bar.append(line);

  div.append(bar);
  div.append(text);

  let currentPattern = {};
  let lastPatternName;
  let lastBPM;
  let bpmPattern;
  let patternStart;
  let prevActionIndex;

  let newPatterns = 0;

  let vibeLevel;

  let patterns = {};

  setInterval(() => {
    let xpath = ".//p[contains(text(),'Load pattern:')]";
    let result = document.evaluate(xpath, eos, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if(result.snapshotLength == 0) {
      newPatterns = 0;
    }

    for(let i = 0; i < result.snapshotLength; i++) {
      let node = result.snapshotItem(i);
      let name = node.textContent.slice(13).trim();

      let data = node.parentNode.childNodes;

      if(data.length >= 3) {
        let text = data[1].textContent;
        let funscript = "";

        for(let l = 2; l < data.length; l++) {
          funscript = funscript + data[l].textContent;
        }

        if(patterns[name] === undefined) {
          patterns[name] = {};

          try {
            let pattern = JSON.parse(funscript);

            pattern.valid = true;
            pattern.text = text;
            pattern.numActions = pattern.actions.length;
            pattern.patternLength = pattern.actions[pattern.numActions - 1].at;

            let time = 0;

            for(let a = 0; a < pattern.numActions; a++) {
              let at = pattern.actions[a].at;

              pattern.actions[a].dur = at - time;

              time = at;
            }

            patterns[name] = pattern;

            newPatterns++;

            console.log(pattern);
          } catch(error) {
            console.error("Failed to load pattern \"" + name + "\"");
            console.error(error);
          }
        }
      }
    }

    if(newPatterns > 0) {
      text.innerText = "Loaded " + newPatterns + " pattern(s)";
    }
  }, 100);

  setInterval(() => {
    let now = Date.now();
    let h = (eos.clientHeight - 40) * 0.7;

    div.style.height = h + "px";

    let vibePath = ".//div[contains(text(),'Vibrator:')]";
    let vibeNotification = document.evaluate(vibePath, eos, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    let newVibe = vibeLevel;

    if(vibeNotification) {
      newVibe = parseInt(vibeNotification.textContent.slice(9));
    } else {
      newVibe = 0;
    }

    if((newVibe != vibeLevel) && !(Number.isNaN(newVibe) && Number.isNaN(vibeLevel))) {
      vibeLevel = newVibe;

      if(Number.isNaN(vibeLevel) || vibeLevel > 100 || vibeLevel < 0) {
        console.error("Invalid vibrator level: \"" + vibeLevel + "\"");

        vibe(0);
      } else {
        vibe(vibeLevel);
      }
    }

    let pattern;

    let patternPath = ".//div[contains(text(),'Pattern:')]";
    let patternNotification = document.evaluate(patternPath, eos, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(patternNotification) {
      let name = patternNotification.textContent.slice(8).trim();
      pattern = patterns[name];

      if(lastPatternName != name) {
        lastPatternName = name;

        if(!pattern) {
          console.error("Pattern \"" + name + "\" not found");
        }
      }
    }

    let bpmPath = ".//div[contains(text(),'BPM:')]";
    let bpmNotification = document.evaluate(bpmPath, eos, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if(bpmNotification) {
      let bpm = parseInt(bpmNotification.textContent.slice(4));

      if((bpm != lastBPM) && !(Number.isNaN(bpm) && Number.isNaN(lastBPM))) {
        lastBPM = bpm;

        if(Number.isNaN(bpm) || bpm <= 0 || bpm > 600) {
          console.error("Invalid BPM: \"" + bpm + "\"");

          bpmPattern = undefined;
        } else {
          let period = (60 * 1000) / bpm;

          pattern = {valid: true, numActions: 2, patternLength: period, text: "", actions: [{at: period / 2, pos: 0, dur: period / 2},{at: period, pos: 100, dur: period / 2}]};

          bpmPattern = pattern;
        }
      } else {
        pattern = bpmPattern;
      }
    }

    if(pattern != currentPattern) {
      currentPattern = pattern;
      patternStart = now;
      prevActionIndex = -1;

      if(pattern) {
        text.innerText = pattern.text;

        bar.style.visibility = "visible";
      } else {
        text.innerText = "";

        bar.style.visibility = "hidden";
      }

      newPatterns = 0;
    }

    if(currentPattern !== undefined && currentPattern.valid) {
      let patternTime = mod(now - patternStart, currentPattern.patternLength);
      let index = actionIndex(currentPattern, patternTime);

      if(index != prevActionIndex) {
        linear(currentPattern.actions[index].pos, currentPattern.actions[index].dur);

        prevActionIndex = index;
      }

      let fillHeight = ((bar.clientHeight - 25) * positionAt(currentPattern, patternTime, index)) / 100;

      fill.style.height = fillHeight + "px";
      arrow.style.bottom = fillHeight + "px";
    }
  }, 10);
}

if(document.querySelector(".eosTopBody")) {
  window.addEventListener("message", (event) => {
    if(event.data.buttEOS) {
      if(window.buttplug_devices) {
        if(event.data.vib) {
          window.buttplug_devices.forEach((device) => {
            if(device.messageAttributes(Buttplug.ButtplugDeviceMessageType.VibrateCmd)) {
              device.vibrate(event.data.vib.level / 100);
            }
          });
        }

        if(event.data.linear) {
          window.buttplug_devices.forEach((device) => {
            if(device.messageAttributes(Buttplug.ButtplugDeviceMessageType.LinearCmd)) {
              device.linear(event.data.linear.position / 100, event.data.linear.duration);
            }
          });
        }
      }

      event.stopImmediatePropagation();
    }
  });

  let bpscript= document.createElement("script");
  bpscript.src = "https://cdn.jsdelivr.net/npm/buttplug@1.0.17/dist/web/buttplug.min.js";
  document.body.append(bpscript);

  window.addEventListener("load", function (e) {
    let style = document.createElement("style");
    style.innerHTML = `
       #buttplug-top-container h3, li {
         font-family:Arial;
         font-size:15px;
       }
       #buttplug-top-container ul {
         list-style-type: none;
         column-count: 2;
       }
       .buttplug-button {
         box-shadow:inset 0px 1px 3px 0px #91b8b3;
         background:linear-gradient(to bottom, #768d87 5%, #6c7c7c 100%);
         background-color:#768d87;
         border-radius:5px;
         border:1px solid #566963;
         display:inline-block;
         cursor:pointer;
         color:#ffffff;
         font-family:Arial;
         font-size:15px;
         font-weight:bold;
         padding:11px 23px;
         text-decoration:none;
         text-shadow:0px -1px 0px #2b665e;
         margin: 5px;
       }
       .buttplug-button:hover {
         background:linear-gradient(to bottom, #6c7c7c 5%, #768d87 100%);
         background-color:#6c7c7c;
       }
       .buttplug-button:active {
         position:relative;
         top:1px;
       }

       #buttplug-top-container {
         position: fixed;
         top: 0;
         right: 0;
         width: 100%;
         height: 100%;
         overflow: hidden;
         background: rgba(0, 0, 0, 0.7);
         display: none;
       }

       #buttplug-dialog {
         width: 50%;
         min-height: 200px;
         position: absolute;
         top: 10%;
         left: 0;
         left: 0;
         right: 0;
         margin: auto;
         background: #888888cc;
         border-radius: 5px;
         padding: 20px;
       }

       .close {
         background: #000;
         cursor: pointer;
         width: 20px;
         height: 20px;
         border-radius: 2px;
         text-align: center;
         color: white;
       }

       #close-bottom-right {
         position: absolute;
         bottom: 0;
         right: 0;
       }

       body {
         width: 100%;
         height: 100%;
       }

       .open {
         width: 50px;
         height: 50px;
         background-image: url("data:image/svg+xml,%3Csvg id='Layer_1' data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 290.56 293.08'%3E%3Cdefs%3E%3Cstyle%3E.cls-1,.cls-3%7Bfill:none;%7D.cls-1%7Bstroke:%23fff;stroke-miterlimit:10;%7D.cls-2%7Bfill:%23fff;%7D%3C/style%3E%3C/defs%3E%3Ctitle%3Ebuttplug-logo-1%3C/title%3E%3Crect x='0.5' y='0.5' width='289.56' height='292.08' rx='32' ry='32'/%3E%3Crect class='cls-1' x='0.5' y='0.5' width='289.56' height='292.08' rx='32' ry='32'/%3E%3Crect class='cls-2' x='10.63' y='10.72' width='269.29' height='271.63' rx='25' ry='25'/%3E%3Crect class='cls-1' x='10.63' y='10.72' width='269.29' height='271.63' rx='25' ry='25'/%3E%3Crect x='17.37' y='17.51' width='255.83' height='258.05' rx='20' ry='20'/%3E%3Crect class='cls-1' x='17.37' y='17.51' width='255.83' height='258.05' rx='20' ry='20'/%3E%3Cline class='cls-3' x1='156.1' y1='152.66' x2='142.44' y2='162.32'/%3E%3Cpath class='cls-2' d='M325.32,383.36a3.07,3.07,0,0,1-1.71-5.64,107.76,107.76,0,0,1,14.2-9.47l2.32-1.36c2.57-1.54,5.24-3,7.83-4.36a95,95,0,0,0,13.73-8.38c1.9-1.49,2.33-6.94,2.59-10.2v-.12c.86-10.76,1-22.09-7.83-32-9.93-11.24-8.63-25.63-6.06-38.22,3-14.72,5.94-29.72,8.78-44.22,3.34-17.09,6.8-34.76,10.41-52.11,1.82-8.76,6.31-14.55,12.3-15.88a20.85,20.85,0,0,1,6.58,0c6,1.33,10.48,7.12,12.3,15.88,3.61,17.35,7.07,35,10.41,52.12,2.83,14.5,5.77,29.49,8.78,44.21,2.58,12.59,3.87,27-6.06,38.22-8.79,10-8.69,21.29-7.83,32v.12c.26,3.26.69,8.71,2.6,10.2a95.08,95.08,0,0,0,13.73,8.38c2.58,1.39,5.26,2.82,7.83,4.36l2.32,1.36a108,108,0,0,1,14.2,9.47,3.07,3.07,0,0,1-1.81,5.64H325.32Zm2.69-4H442.34a109.85,109.85,0,0,0-11.81-7.65l-2.37-1.39c-2.48-1.49-5.11-2.9-7.66-4.26a98.21,98.21,0,0,1-14.31-8.76c-3.28-2.57-3.75-8.37-4.12-13v-.12c-.93-11.61-1-23.88,8.83-35,8.74-9.9,7.63-22.56,5.14-34.77-3-14.73-5.95-29.74-8.79-44.25-3.34-17.08-6.79-34.75-10.4-52.07-1.49-7.15-4.86-11.81-9.25-12.79a9.39,9.39,0,0,0-2.27-.17H385a9.32,9.32,0,0,0-2.27.17c-4.39,1-7.76,5.64-9.25,12.79-3.61,17.32-7.06,35-10.4,52.06-2.84,14.51-5.77,29.52-8.79,44.25-2.5,12.21-3.61,24.87,5.14,34.77,9.83,11.13,9.75,23.4,8.82,35v.12c-.37,4.66-.83,10.46-4.12,13a98.14,98.14,0,0,1-14.31,8.76c-2.54,1.36-5.17,2.77-7.66,4.26l-2.37,1.39A109.88,109.88,0,0,0,328,379.35Z' transform='translate(-239.9 -125.68)'/%3E%3C/svg%3E%0A");
         display: none;
         z-index:999;
       }

       #open-bottom-right {
         position: fixed;
         bottom: 0;
         right: 0;
         display: block;
       }
  `;

    document.body.append(style);

    let open_element = document.createElement('div');
    open_element.id = `open-bottom-right`;
    open_element.className = "open";
    document.body.append(open_element);

    let container_div = document.createElement('div');
    container_div.innerHTML = `
    <div id="buttplug-dialog">
          <div id="close-bottom-right" class="close">V</div>
          <div id="buttplug-container" style="margin: 10px; display: flex;">
            <div id="buttplug-connector" style="display: block;">
              <a href="#" class="buttplug-button" id="buttplug-connect-browser">Connect in Browser</a>
              <br/>
              <a href="#" class="buttplug-button" id="buttplug-connect-intiface">Connect to Intiface Desktop</a>
              <br/>
            </div>
            <div id="buttplug-enumeration" style="display: none;">
              <a href="#" class="buttplug-button" id="buttplug-scanning">Start Scanning</a>
              <a href="#" class="buttplug-button" id="buttplug-disconnect">Disconnect</a>
              <br/>
              <h3>Devices</h3>
              <ul id="buttplug-device-list">
                <li>
                </li>
              </ul>
            </div>
          </div>
        </div>`;
    container_div.id = "buttplug-top-container";
    document.body.append(container_div);

    // We need the buttplug_devices to be global, so that tampermonkey user
    // scripts can work with it. Hang it off window.
    window.buttplug_devices = [];

    setTimeout(() =>
               (async function () {
                 // Set up Buttplug
                 await Buttplug.buttplugInit();

                 const buttplug_client = new Buttplug.ButtplugClient("ButtEOS Client");
                 const dialog_div = document.getElementById("buttplug-dialog");
                 const connector_div = document.getElementById("buttplug-connector");
                 const enumeration_div = document.getElementById("buttplug-enumeration");
                 const scanning_button = document.getElementById("buttplug-scanning");
                 const connect_browser_button = document.getElementById("buttplug-connect-browser");
                 const connect_intiface_button = document.getElementById("buttplug-connect-intiface");
                 const disconnect_button = document.getElementById("buttplug-disconnect");
                 const device_list = document.getElementById("buttplug-device-list");
                 buttplug_client.addListener('deviceadded', async (device) => {
                   const element_id = `buttplug-device-${device.Index}`;
                   const input = document.createElement("li");
                   input.id = element_id;
                   const checkbox = document.createElement("input");
                   const checkbox_id = `${element_id}-checkbox`;
                   checkbox.type = "checkbox";
                   checkbox.id = checkbox_id;
                   input.addEventListener("click", async (event) => {
                     const index = window.buttplug_devices.indexOf(device);

                     if (index > -1) {
                       await device.stop();
                       window.buttplug_devices.splice(index, 1);
                       checkbox.checked = false;
                     } else {
                       window.buttplug_devices.push(device);
                       checkbox.checked = true;
                     }
                   });
                   let label = document.createElement("label");
                   label.for = `${element_id}-checkbox`;
                   label.innerHTML = device.Name;
                   input.appendChild(checkbox);
                   input.appendChild(label);
                   device_list.appendChild(input);
                 });

                 buttplug_client.addListener('deviceremoved', async (device) => {
                   const element_id = `buttplug-device-${device.Index}`;
                   var element = document.getElementById(element_id);
                   element.parentNode.removeChild(element);
                 });

                 connect_browser_button.addEventListener("click", async (event) => {
                   const connector = new Buttplug.ButtplugEmbeddedConnectorOptions();
                   await buttplug_client.connect(connector);
                   connector_div.style.display = "none";
                   enumeration_div.style.display = "block";
                 }, false);

                 connect_intiface_button.addEventListener("click", async (event) => {
                   const connector = new Buttplug.ButtplugWebsocketConnectorOptions("ws://localhost:12345/");
                   await buttplug_client.connect(connector);
                   connector_div.style.display = "none";
                   enumeration_div.style.display = "block";
                 }, false);

                 disconnect_button.addEventListener("click", async (event) => {
                   await buttplug_client.disconnect();
                   enumeration_div.style.display = "none";
                   connector_div.style.display = "block";
                 }, false);

                 scanning_button.addEventListener('click', async () => {
                   await buttplug_client.startScanning();
                 });

                 let container = document.querySelector("#buttplug-top-container");

                 let close = document.getElementById(`close-bottom-right`);
                 let open = document.getElementById(`open-bottom-right`);
                 close.addEventListener("click", () => {
                   container.style.display = "none";
                   open.style.display = "block";
                 }, false);

                 container_div.addEventListener("click", () => {
                   container.style.display = "none";
                   open.style.display = "block";
                 }, false);

                 dialog_div.addEventListener("click", (ev) => {
                   ev.stopPropagation();
                 }, false);

                 open.addEventListener("click", () => {
                   open.style.display = "none";
                   container.style.display = "block";
                 }, false);
               })(), 0);

  }, false);
}
