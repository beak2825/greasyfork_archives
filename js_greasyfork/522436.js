// ==UserScript==
// @author      IanDesuyo
// @name        UtaTen Enhancer
// @namespace   https://github.com/IanDesuyo/userscripts/utanet-enhancer
// @description Enhances the UtaTen website.
// @match       https://utaten.com/lyric/*
// @version     1.0
// @grant       none
// @noframes
// @homepageURL https://github.com/IanDesuyo/userscripts
// @supportURL  https://github.com/IanDesuyo/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/522436/UtaTen%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/522436/UtaTen%20Enhancer.meta.js
// ==/UserScript==

const GPT_TRANSLATE_LANG = "Traditional Chinese";
const GPT_PROMPT = `Translate the following lyrics into ${GPT_TRANSLATE_LANG}, put the translation at the end of each line and give a brief description of the meaning of the song in ${GPT_TRANSLATE_LANG} at the end.`;

(() => {
  // Create a style element to override the user-select property
  const style = document.createElement("style");
  style.textContent = `
    .lyricBody {
      user-select: text !important;
      -webkit-user-select: text !important;
    }

    .lyricBody .ruby .rt {
      user-select: none !important;
      -webkit-user-select: none !important;
    }

    .lyricBody [translate="yes"] {
      display: none;
    }

    .translated-ltr .lyricBody [translate="yes"] {
      display: block;
      font-size: 1rem;
      color: #999;
    }

    .translated-ltr .lyricBody br {
      content: "";
      display: block;
      margin-bottom: 1rem;
    }
  `;

  document.head.appendChild(style);

  // Clone the lyric body to remove event listeners
  const clone = document.querySelector(".lyricBody").cloneNode(true);
  clone.oncontextmenu = null;
  clone.onselectstart = null;

  // Enhance for Google Translate
  // Add the "translate=no" attribute
  clone.setAttribute("translate", "no");

  // Clone lyric lines to better format for translation
  let lyricLine = "";
  const lyricLines = [];

  for (const child of clone.querySelector(".romaji").children) {
    if (child.tagName === "BR") {
      lyricLines.push(lyricLine);
      lyricLine = "";
    } else if (child.tagName === "SPAN") {
      lyricLine += child.querySelector(".rb").textContent;
    }
  }

  // Insert the lyric lines into the clone
  const hiraganaBrs = clone.querySelectorAll(".hiragana br");
  const romajiBrs = clone.querySelectorAll(".romaji br");
  for (let i = 0; i < lyricLines.length; i++) {
    const lyricLine = lyricLines[i];
    const hiraganaBr = hiraganaBrs[i];
    const romajiBr = romajiBrs[i];

    const el = document.createElement("p");
    el.textContent = lyricLine;
    el.setAttribute("translate", "yes");

    hiraganaBr.before(el);
    romajiBr.before(el.cloneNode(true));
  }

  // Replace the original lyric body with the clone
  document.querySelector(".lyricBody").replaceWith(clone);

  // Add a button to copy lyrics
  const copyButton = document.createElement("dl");
  copyButton.className = "lyricFont__size";
  copyButton.innerHTML = `
    <dt class="lyricFont__title">Tools</dt>
    <dd>
      <input type="button" value="Copy" onclick="copyLyrics()">
      <input type="button" value="GPT" onclick="gptLyrics()">
    </dd>
  `;
  window.copyLyrics = () => {
    const lyrics = lyricLines.join("\n");
    navigator.clipboard.writeText(lyrics);
  };

  window.gptLyrics = () => {
    const lyrics = lyricLines.join("\n");
    const prompt = GPT_PROMPT + "\n\n" + lyrics;

    window.open(`https://chatgpt.com/?temporary-chat=true&q=${encodeURIComponent(prompt)}`, "_blank", "noreferrer");
  };

  document.querySelector(".lyricFont").appendChild(copyButton);
})();
