// ==UserScript==
// @name         Discourse AI Write
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Advanced AI Write, powered by Gemini. Write your discourse posts with ease. Quickly ask questions.
// @author       ethandacat
// @match        https://x-camp.discourse.group/*
// @icon         https://avatars.githubusercontent.com/u/78333227?s=200&v=4
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533582/Discourse%20AI%20Write.user.js
// @updateURL https://update.greasyfork.org/scripts/533582/Discourse%20AI%20Write.meta.js
// ==/UserScript==

let now = new Date();
let sessionId = `${now.getFullYear().toString() +
                (now.getMonth() + 1).toString().padStart(2, '0') +
                now.getDate().toString().padStart(2, '0') +
                now.getHours().toString().padStart(2, '0') +
                now.getMinutes().toString().padStart(2, '0') +
                now.getSeconds().toString().padStart(2, '0') +
                now.getMilliseconds().toString().padStart(3, '0')}${Math.floor(Math.random() * 1000) + 1}`;

console.log(sessionId);


async function askGemini(prompt) {
  try {
    const res = await fetch('https://ai-write-nine.vercel.app/proxy/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt,
    session_id: sessionId // or make this dynamic if you want per-editor-session chats
  })
});

    if (!res.ok) return `(Gemini error ${res.status})`;
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text ?? "(no response)";
  } catch (err) {
    return `(Fetch error: ${err.message})`;
  }
}

function addButton() {
  const bar = document.querySelector(".d-editor-button-bar");
  if (!bar || document.querySelector(".ai-write-button")) return;

  const button = document.createElement("button");
  button.className = "btn no-text btn-icon quote ai-write-button";
  button.tabIndex = 0;
  button.title = "AI Write";
  button.innerHTML = `
    <svg class="fa d-icon d-icon-microchip-ai svg-icon svg-string" xmlns="http://www.w3.org/2000/svg">
      <use href="#robot"></use>
    </svg>
  `;

  button.addEventListener("click", () => {
    const pophtml = `
    <div class="modal-container">
      <div class="modal d-modal poll-ui-builder" data-keyboard="false" aria-modal="true" role="dialog" aria-labelledby="discourse-modal-title">
        <div class="d-modal__container">
          <div class="d-modal__header">
            <div class="d-modal__title">
              <h1 id="discourse-modal-title" class="d-modal__title-text">Discourse AI Write</h1>
            </div>
            <button class="btn no-text btn-icon btn-transparent modal-close d-ai-close" title="close" type="button">
              <svg class="fa d-icon d-icon-xmark svg-icon svg-string" xmlns="http://www.w3.org/2000/svg"><use href="#xmark"></use></svg>
              <span aria-hidden="true">​</span>
            </button>
          </div>
          <div class="d-modal__body" tabindex="-1">
            <div class="poll-options">
              <p>What should Gemini revise or generate?</p>
              <div class="input-group poll-option-value">
                <input type="text" autofocus class="d-ai-inp">
              </div>
              <p>Thank you for using Discourse AI Write by Ethan!</p>
            </div>
          </div>
          <div class="d-modal__footer">
            <button class="btn btn-icon-text btn-primary d-ai-gen" type="button">
              <span class="d-button-label">Generate!</span>
            </button>
            <button class="btn btn-text btn-flat d-ai-close2" type="button">
              <span class="d-button-label">cancel</span>
            </button>
          </div>
        </div>
      </div>
      <div class="d-modal__backdrop"></div>
    </div>
    `;

    const pop = document.createElement("div");
    pop.innerHTML = pophtml;
    document.querySelector(".discourse-root").appendChild(pop);

    document.querySelector(".d-ai-close").onclick = () => document.querySelector(".modal-container")?.remove();
    document.querySelector(".d-ai-close2").onclick = () => document.querySelector(".modal-container")?.remove();

    const input = document.querySelector(".d-ai-inp");
    const genBtn = document.querySelector(".d-ai-gen");

    genBtn.onclick = async () => {
      const inptxt = input.value;
      const modal = document.querySelector(".modal-container");

      genBtn.disabled = true;
      genBtn.innerHTML = "<span class='d-button-label'>Loading...</span>";

      const textarea = document.querySelector("textarea.d-editor-input");
      if (textarea) {
        const result = await askGemini(inptxt);
        textarea.value = result;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
      }
        document.querySelector(".modal-container").remove();
        document.querySelector(".modal-container").remove();
        document.querySelector(".modal-container").remove();
    };

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") genBtn.click();
      else if (e.key === "Escape") document.querySelector(".modal-container")?.remove();
    });
  });

  bar.appendChild(button);
  console.log("AI Write button added");
}

function reliableWaitForEditor(callback) {
  let lastEditor = null;
  const check = () => {
    const editor = document.querySelector(".d-editor-button-bar");
    if (editor && editor !== lastEditor) {
      lastEditor = editor;
      callback();
    }
  };
  setInterval(check, 300);
  document.addEventListener("visibilitychange", check);
  window.addEventListener("hashchange", check);
  window.addEventListener("focus", check);
}

reliableWaitForEditor(addButton);
