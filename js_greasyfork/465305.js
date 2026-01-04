// ==UserScript==
// @name            MarkdownCopy
// @name:zh         MarkdownCopy 复制Markdown格式标题和地址快速分享
// @name:en         Alt+C Copy Title and Link as Markdown Style
// @description     Press Alt+C to copy title and url as markdown style link `> ${SELECTION} [${TITLE}]( ${URL} )`
// @description:zh  按 Alt+C 复制 Markdown 格式的链接 `> ${SELECTION} [${TITLE}]( ${URL} )`
// @namespace       https://userscript.snomiao.com/
// @version         0.8.4
// @author          snomiao@gmail.com
// @match           *://*/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/465305/MarkdownCopy.user.js
// @updateURL https://update.greasyfork.org/scripts/465305/MarkdownCopy.meta.js
// ==/UserScript==

/* eslint-disable */

// hotkey-mapper
var { keys } = Object;
function mapObject(fn, obj) {
  if (arguments.length === 1) {
    return (_obj) => mapObject(fn, _obj);
  }
  let index = 0;
  const objKeys = keys(obj);
  const len = objKeys.length;
  const willReturn = {};
  while (index < len) {
    const key = objKeys[index];
    willReturn[key] = fn(obj[key], key, obj);
    index++;
  }
  return willReturn;
}
var mapObjIndexed = mapObject;
function hotkeyMapper(mapping, options) {
  const handler = (event) => {
    const key = event.key.toLowerCase();
    const code = event.code.toLowerCase();
    const simp = code.replace(/^(?:Key|Digit|Numpad)/, "");
    const map = new Proxy(event, {
      get: (target, p) =>
        Boolean(
          {
            [`${key}Key`]: true,
            [`${code}Key`]: true,
            [`${simp}Key`]: true,
          }[p] ?? target[p]
        ),
    });
    const mods = "meta+alt+shift+ctrl";
    mapObjIndexed((fn, hotkey) => {
      const conds = `${mods}+${hotkey.toLowerCase()}`
        .replace(/win|command|search/, "meta")
        .replace(/control/, "ctrl")
        .split("+")
        .map((k, i) => [k, i >= 4 === map[`${k}Key`]]);
      if (!Object.entries(Object.fromEntries(conds)).every(([, ok]) => ok))
        return;
      event.stopPropagation(), event.preventDefault();
      return fn(event);
    }, mapping);
  };
  window.addEventListener(options?.on ?? "keydown", handler, options);
  return function unload() {
    window.removeEventListener(options?.on ?? "keydown", handler, options);
  };
}

// clipboardy/browser
var clipboard = {};
clipboard.write = async (text) => {
  await navigator.clipboard.writeText(text);
};
clipboard.read = async () => navigator.clipboard.readText();
clipboard.readSync = () => {
  throw new Error("`.readSync()` is not supported in browsers!");
};
clipboard.writeSync = () => {
  throw new Error("`.writeSync()` is not supported in browsers!");
};
var browser_default = clipboard;

// MarkdownCopy
{
  main();
}
function main() {
  globalThis.cmqa ||= {};
  globalThis.cmqa.unload?.();
  globalThis.cmqa.unload = hotkeyMapper({
    "alt+c": async () => {
      const selected = window?.getSelection()?.toString().trim() || "";
      const quoted = selected && selected.replace(/.*/, (s) => `> ${s}`);
      const href = location.href;
      const content = `${quoted}	[${longestTitleGet()}]( ${href} )`.trim();
      await browser_default.write(content);
      alert(`copied: 
${content}`);
    },
  });
}
function longestTitleGet() {
  const LongestTitle = [
    document.title,
    document.querySelector("h1")?.innerText || "",
  ]
    .map((str) => str.replace(/\r?\n.*/g, ""))
    .sort((a, b) => a.length - b.length)
    .pop();
  return LongestTitle;
}
