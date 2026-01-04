// ==UserScript==
// @name         Multidrop
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ahhh
// @author       ———
// @match        https://agma.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/483094/Multidrop.user.js
// @updateURL https://update.greasyfork.org/scripts/483094/Multidrop.meta.js
// ==/UserScript==
const keybind = {
        virus: undefined,
        mothercell: undefined,
        portal: undefined,
        block: undefined,
        freeze: undefined,
        antiFreeze: undefined,
        antrecfrz: '1',
        antiRec: undefined,
        shield: undefined,
        pcombogreen: undefined,
        combogreen: undefined,
        combomother: undefined,
        pcombomother: undefined,
        twgrow: undefined,
        antifrzshield: '3'
      };
      let x;
      let y;
      let send;
      window.addEventListener("DOMContentLoaded", () => {
        const mtbox = $("<input>", {
          type: "checkbox",
          id: "mothercellCheckbox"
        });
        const mtboxlabel = $("<label>", {
          for: "mothercellCheckbox",
          text: "Mothercell"
        });
        const rolesting= $("<div>", {
          class: "role-setting"
        }).append(mtbox, mtboxlabel);
        const vribox = $("<input>", {
          type: "checkbox",
          id: "virusCheckbox"
        });
        const virusboxlabel = $("<label>", {
          for: "virusCheckbox",
          text: "Virus"
        });
        const appendboxes = $("<div>", {
          class: "role-setting"
        }).append(vribox, virusboxlabel);
        $(".settings-green").append(rolesting, appendboxes);
        const mtclbox = document.getElementById("mothercellCheckbox");
        const virbox = document.getElementById("virusCheckbox");
        mtclbox.addEventListener("change", () => {
          if (mtclbox.checked) {
            keybind.combomother = 51;
            keybind.pcombomother = 50;
            keybind.combogreen = undefined;
            keybind.pcombogreen = undefined;
            virbox.checked = false;
          } else {
            keybind.combomother = undefined;
            keybind.pcombomother = undefined;
          }
        });
        virbox.addEventListener("change", () => {
          if (virbox.checked) {
            keybind.combogreen = 51;
            keybind.pcombogreen = 50;
            keybind.combomother = undefined;
            keybind.pcombomother = undefined;
            mtclbox.checked = false;
          } else {
            keybind.combogreen = undefined;
            keybind.pcombogreen = undefined;
          }
        });
      });
      window.dropPw = (id, x, y) => {
        let packet = new DataView(new ArrayBuffer(10));
        packet.setUint8(0, 72);
        packet.setInt32(1, x, true);
        packet.setInt32(5, y, true);
        packet.setUint8(9, id, true);
        send(packet);
      };
      WebSocket.prototype.send = new Proxy(WebSocket.prototype.send, {
        apply(target, thisArg, argArray) {
          send = (...args) => target.call(thisArg, ...args);
          let pkt = argArray[0];
          pkt = pkt instanceof ArrayBuffer ? new DataView(pkt) : pkt instanceof DataView ? pkt : new DataView(pkt.buffer);
          switch (pkt.getUint8(0, true)) {
            case 0:
              switch (pkt.byteLength) {
                case 9:
                  [x, y] = [pkt.getInt32(1, true), pkt.getInt32(5, true)];
                  break;
              }
              break;
          }
          target.apply(thisArg, argArray);
        }
      });
      window.addEventListener("keydown", e => {
        if (!$("input, textarea").is(":focus")) {
          switch (e.key) {
            case keybind.twgrow:
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              window.dropPw(3, x, y);
              break;
            case keybind.virus:
              window.dropPw(4, x, y);
              break;
            case keybind.mothercell:
              window.dropPw(5, x, y);
              break;
            case keybind.portal:
              window.dropPw(6, x, y);
              break;
            case keybind.block:
              window.dropPw(9, x, y);
              break;
            case keybind.freeze:
              window.dropPw(8, x, y);
              break;
            case keybind.antiFreeze:
              window.dropPw(11, x, y);
              break;
            case keybind.antrecfrz:
              window.dropPw(12, x, y);
              window.dropPw(8, x, y);
              break;
            case keybind.antiRec:
              window.dropPw(12, x, y);
              break;
            case keybind.shield:
              window.dropPw(14, x, y);
              break;
            case keybind.pcombogreen:
              window.dropPw(6, x, y);
              window.dropPw(12, x, y);
              window.dropPw(8, x, y);
              setTimeout(() => window.dropPw(4, x, y), 400);
              break;
            case keybind.combogreen:
              window.dropPw(12, x, y);
              window.dropPw(8, x, y);
              setTimeout(() => window.dropPw(4, x, y), 400);
              break;
            case keybind.combomother:
              window.dropPw(12, x, y);
              window.dropPw(8, x, y);
              window.dropPw(5, x, y);
              break;
            case keybind.pcombomother:
              window.dropPw(6, x, y);
              window.dropPw(12, x, y);
              window.dropPw(8, x, y);
              window.dropPw(5, x, y);
              break;
            case keybind.antifrzshield:
              window.dropPw(14, x, y);
              window.dropPw(11, x, y);
              break;
            default:
              return;
          }
        }
      });