// ==UserScript==
// @name         the funny fonts
// @namespace    https://greasyfork.org/
// @version      0.1
// @description  fonts
// @author       bheesy
// @icon         https://mpphust.ga/assets/icon%20(48).png
// @include      *://multiplayerpiano.com/*
// @include      *://mppclone.com/*
// @include      *://mpp.terrium.net/*
// @include      *://piano.ourworldofpixels.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452827/the%20funny%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/452827/the%20funny%20fonts.meta.js
// ==/UserScript==
const o = {
"a": "𝕒",
"b": "𝕓",
"c": "𝕔",
"d": "𝕕",
"e": "𝕖",
"f": "𝕗",
"g": "𝕘",
"h": "𝕙",
"i": "𝕚",
"j": "𝕛",
"k": "𝕜",
"l": "𝕝",
"m": "𝕞",
"n": "𝕟",
"o": "𝕠",
"p": "𝕡",
"q": "𝕢",
"r": "𝕣",
"s": "𝕤",
"t": "𝕥",
"u": "𝕦",
"v": "𝕧",
"w": "𝕨",
"x": "𝕩",
"y": "𝕪",
"z": "𝕫"
};

var t = {
"A": "𝔸",
"B": "𝔹",
"C": "ℂ",
"D": "𝔻",
"E": "𝔼",
"F": "𝔽",
"G": "𝔾",
"H": "ℍ",
"I": "𝕀",
"J": "𝕁",
"K": "𝕂",
"L": "𝕃",
"M": "𝕄",
"N": "ℕ",
"O": "𝕆",
"P": "ℙ",
"Q": "ℚ",
"R": "ℝ",
"S": "𝕊",
"T": "𝕋",
"U": "𝕌",
"V": "𝕍",
"W": "𝕎",
"X": "𝕏",
"Y": "𝕐",
"Z": "ℤ"
};

MPP.chat.send = (msg) => {
  if (/[a-z]/.test(msg)) {
    Object.keys(o).forEach(f => {
      msg = msg.replaceAll(f, o[f]);
    })
  }
  if (/[A-Z]/.test(msg)) {
    Object.keys(t).forEach(f => {
      msg = msg.replaceAll(f, t[f]);
    })
  }
    MPP.client.sendArray([{
        m: 'a',
        message: msg
    }]);
}