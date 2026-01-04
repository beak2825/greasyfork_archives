// ==UserScript==
// @name        Quin69 Old Reddit Emojis
// @namespace   Violentmonkey Scripts
// @match       https://www.reddit.com/r/quin69/comments/*
// @grant       none
// @version     1.0
// @author      In3luki
// @license     MIT
// @description 10/14/2023, 3:29:06 PM
// @downloadURL https://update.greasyfork.org/scripts/507826/Quin69%20Old%20Reddit%20Emojis.user.js
// @updateURL https://update.greasyfork.org/scripts/507826/Quin69%20Old%20Reddit%20Emojis.meta.js
// ==/UserScript==

const baseUrl = "https://reddit-econ-prod-assets-permanent.s3.amazonaws.com/asset-manager/t5_37jpd";
const style = "display: inline-block; vertical-align: middle; line-height: 100%; margin: 0 2px;";

const emojiMap = new Map([
  [":32155:", "9fqVYFkagp.png"],
  [":32217:", "shSF0qcnLR.png"],
  [":32218:", "Hkd9WD7kpd.png"],
  [":32219:", "6ezYqkNFjj.png"],
  [":32220:", "qnLL47TzYO.png"],
  [":32221:", "P3e77EZQeb.png"],
  [":32222:", "ztubqdTL34.png"],
  [":32223:", "RgvEbiXoCH.png"],
  [":32224:", "EOzfWg0kG1.png"],
  [":32226:", "HmUT1kkLeR.png"],
  [":32227:", "XDBZDL0dAf.png"],
  [":32228:", "ctiA34M8Rl.png"],
  [":32229:", "Y0tracWQ0V.png"],
  [":32230:", "qbeoDaRyeU.png"],
  [":32231:", "fH2PJpg2pm.png"],
  [":32232:", "LMIQjUUa8E.png"],
  [":32417:", "Di607bubs2.png"],
  [":32659:", "PP6E1vRQbO.png"],
  [":32722:", "5gTBXxY32A.png"],
  [":32724:", "a0psT5Zzfx.png"],
  [":33010:", "7lCm7rXn9w.png"],
  [":33011:", "erB094Y1wZ.png"],
  [":33012:", "sAbNOnqjaG.png"],
  [":33013:", "HhFvZZsoam.png"],
  [":33033:", "MTSo1vmUHY.png"],
  [":33094:", "wyKwVaw5JZ.png"],
  [":53559:", "deH6t8iawK.png"],
  [":53560:", "ljEczKiGLs.png"],
]);

const createImg = (id, big) => {
  if (!emojiMap.has(id)) return id;
  const size = big ? "60" : "25";
  return `<img src="${baseUrl}/${emojiMap.get(id)}" style="${style}" width="${size}" height="${size}">`;
};

for (const form of document.querySelectorAll("form.usertext")) {
  for (const textElement of form.querySelectorAll("p")) {
    const matches = textElement.innerHTML.matchAll(/:\d+:/gm);
    let processed = textElement.innerHTML;
    for (const match of matches) {
      const id = match.at(0);
      // Bigger image if the id is the only text content
      if (processed === id) {
        processed = processed.replace(id, createImg(id, true));
        break;
      }
      processed = processed.replace(id, createImg(id));
    }
    if (processed !== textElement.innerHTML) {
      textElement.innerHTML = processed;
    }
  }
}
