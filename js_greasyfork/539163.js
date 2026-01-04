// ==UserScript==
// @name         Website Destroyer
// @namespace    http://tampermonkey.net/
// @version      2025-06-12
// @description  destroy every site
// @author       ray0kay
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539163/Website%20Destroyer.user.js
// @updateURL https://update.greasyfork.org/scripts/539163/Website%20Destroyer.meta.js
// ==/UserScript==

'use strict';

const targets = [
  Object,
  Array,
  Function,
  Math,
  Reflect,
  JSON,
  Object.prototype,
  Array.prototype,
  Function.prototype,
  String.prototype,
  Number.prototype,
  Boolean.prototype,
  Date.prototype,
];

const og = {
  getOwnPropertyNames: Object.getOwnPropertyNames,
  floor: Math.floor,
  random: Math.random,
};

for (const target of targets) {
  if (target == null) continue;
  if (typeof target !== "object" && typeof target !== "function") continue;

  let props;
  try {
    props = og.getOwnPropertyNames(target);
  } catch {
    continue;
  }

  if (!Array.isArray(props)) continue;

  const functionProps = [];
  for (const p of props) {
    let val;
    try {
      val = target[p];
    } catch {
      continue;
    }
    if (typeof val === "function") {
      functionProps.push(p);
    }
  }

  for (const k of functionProps) {
    const candidates = functionProps.filter((p) => p !== k);
    if (candidates.length === 0) continue;
    const rand = candidates[og.floor(og.random() * candidates.length)];

    try {
      target[k] = target[rand];
    } catch {
      continue;
    }
  }
}
