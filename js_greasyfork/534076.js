// ==UserScript==
// @name         Forward Assault (Unlock Weapons/Skins - Run Once and turn it off)
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Unlocks all weapons and skins
// @author       pug
// @match        https://forward-assault.game-files.crazygames.com/*
// @icon         https://www.google.com/s2/favicons?domain=crazygames.com
// @grant        none
// @license      Proprietary © 2025 pug - All rights reserved.
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534076/Forward%20Assault%20%28Unlock%20WeaponsSkins%20-%20Run%20Once%20and%20turn%20it%20off%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534076/Forward%20Assault%20%28Unlock%20WeaponsSkins%20-%20Run%20Once%20and%20turn%20it%20off%29.meta.js
// ==/UserScript==

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const response = await originalFetch(...args);
  if (!args[0].includes("getaccountinfoWebgl.php")) return response;

  const cloned = response.clone();
  const text = await cloned.text();

  const xmlStart = text.indexOf("<?xml");
  const xmlEnd = text.lastIndexOf(">") + 1;
  if (xmlStart === -1 || xmlEnd === -1) return response;

  const xmlContent = text.substring(xmlStart, xmlEnd);
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "application/xml");
  if (xmlDoc.getElementsByTagName("parsererror").length > 0) return response;

  const updateTag = (tag, value) => {
    let el = xmlDoc.getElementsByTagName(tag)[0];
    if (!el) {
      el = xmlDoc.createElement(tag);
      xmlDoc.documentElement.querySelector("mainAccountInfo")?.appendChild(el);
    }
    el.textContent = value;
  };

  // Unlock all gloves
  updateTag("glovesCamos", Array.from({ length: 63 }, (_, i) => i + 1).join(","));

  // Unlock all character skins
  updateTag("characterCamos", Array.from({ length: 100 }, (_, i) => i + 1).join(","));

  // Unlock all weapons with skins
  const weaponInfo = xmlDoc.getElementsByTagName("weaponInfo")[0];
  if (weaponInfo) weaponInfo.replaceWith(generateFullWeaponInfo(xmlDoc));

  const serializer = new XMLSerializer();
  const modifiedXml = serializer.serializeToString(xmlDoc);
  const finalText = text.substring(0, xmlStart) + modifiedXml + text.substring(xmlEnd);

  return new Response(finalText, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
};

function generateFullWeaponInfo(xmlDoc) {
  const weaponInfo = xmlDoc.createElement("weaponInfo");

  for (let i = 1; i <= 40; i++) {
    const weapon = xmlDoc.createElement("WeaponInfo");

    const type = xmlDoc.createElement("type");
    type.textContent = i;
    weapon.appendChild(type);

    const unlocked = xmlDoc.createElement("unlocked");
    unlocked.textContent = "1";
    weapon.appendChild(unlocked);

    const customizations = xmlDoc.createElement("customizations");
    const skins = [];
    for (let j = 1000; j < 1100; j++) {
      skins.push(`Camo*U-${j}*E-1_`);
    }
    customizations.textContent = skins.join(",");
    weapon.appendChild(customizations);

    weaponInfo.appendChild(weapon);
  }

  return weaponInfo;
}