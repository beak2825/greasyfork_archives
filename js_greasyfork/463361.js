// ==UserScript==
// @name        Your Show
// @name:zh-CN  演示助手
// @description Display the mouse position and pressed keys.
// @description:zh-CN 显示鼠标位置和按下的按键。
// @namespace   https://greasyfork.org/users/197529
// @version     0.1.9
// @author      kkocdko
// @license     Unlicense
// @match       *://*/*
// @downloadURL https://update.greasyfork.org/scripts/463361/Your%20Show.user.js
// @updateURL https://update.greasyfork.org/scripts/463361/Your%20Show.meta.js
// ==/UserScript==
"use strict";

const host = document.body.appendChild(document.createElement("your-show"));
document.addEventListener("fullscreenchange", () => {
  (document.fullscreenElement || document.body).appendChild(host);
});
const root = host.attachShadow({ mode: "open" });
const css = ([s]) => `<style>${s}</style>`;
root.innerHTML = css`
  :host {
    position: fixed;
    z-index: 2147483647;
  }
  your-mouse {
    display: block;
    position: fixed;
    z-index: 2147483647;
    width: 30px;
    height: 30px;
    left: 0;
    top: 0;
    background: #3f51b5a9;
    border-radius: 50%;
    /* transition: transform 0.2s 0.06s; */
    user-select: none;
    pointer-events: none;
    border-top-left-radius: 0;
  }
  div {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 2147483647;
    font-size: 20px;
    text-shadow: 1px 1px #fff, 1px -1px #fff, -1px 1px #fff, -1px -1px #fff;
    user-select: none;
    pointer-events: none;
    font-family: monospace;
  }
  span {
    line-height: 2;
    padding: 0 0.5em;
    margin: 4px;
    display: inline-block;
    box-shadow: 0 1px 5px 1px #888;
    border-radius: 8px;
    background: #fff;
    color: #000;
  }
`;
{
  const mouseEl = root.appendChild(document.createElement("your-mouse"));
  const mouseStyle = mouseEl.style;
  addEventListener("pointermove", (e) => {
    mouseStyle.transform = "translate(" + e.clientX + "px," + e.clientY + "px)";
  });
}
{
  // <div><span>Ctrl</span> + <span>M</span></div>
  // <div><span>Shift</span> + <span>U</span></div>
  // keyboard layout
  const serial = new Map(); // (code, stamp)
  const div = root.appendChild(document.createElement("div"));
  const names = {};
  for (const c of [...Array(13).keys()]) names[`F${c}`] = `F${c}`;
  for (const c of [...Array(10).keys()]) names[`Digit${c}`] = c;
  for (const c of [...Array(26).keys()].map((v) => String.fromCharCode(v + 65)))
    names[`Key${c}`] = c;
  names.ControlLeft = names.ControlRight = "Ctrl";
  names.ShiftLeft = names.ShiftRight = "Shift";
  names.AltLeft = names.AltRight = "Alt";
  names.BracketRight = "]";
  names.BracketLeft = "[";
  names.Semicolon = ";";
  names.Slash = "/";
  names.Backslash = "\\";
  names.Backquote = "`";
  names.Minus = "-";
  names.Equal = "=";
  names.Quote = "'";
  names.Comma = ",";
  names.Period = ".";
  // https://symbl.cc/cn/unicode/blocks/miscellaneous-symbols-and-arrows/
  // names.ArrowUp = "↑";
  // names.ArrowDown = "↓";
  // names.ArrowLeft = "←";
  // names.ArrowRight = "→";
  const refresh = () => {
    const pressed = [
      ...new Set(
        [...serial.keys()].map((v) => {
          if (!names[v]) {
            names[v] = v;
            console.log(`showkeydown: unknown key [ ${v} ]`);
          }
          return names[v];
        })
      ).values(),
    ];
    div.innerHTML = pressed.length
      ? pressed.map((name) => `<span>${name}</span>`).join(" ")
      : "";
  };
  addEventListener("keydown", ({ code }) => {
    serial.set(code, Date.now());
    refresh();
  });
  addEventListener("keyup", ({ code }) => {
    serial.delete(code);
    refresh();
  });
}
