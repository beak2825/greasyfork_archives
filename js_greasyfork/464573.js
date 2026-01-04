// ==UserScript==
// @name         SubmitGPT
// @namespace    submitgpt
// @version      2.0
// @description  Generate feedback for SubmitHub and uncompress your bulletpoints into a nice formal format
// @match        https://www.submithub.com/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @license      MPL-2.0
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/464573/SubmitGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/464573/SubmitGPT.meta.js
// ==/UserScript==

let systemPrompt =
  localStorage.getItem("systemPrompt") ||
  `
You are a feedback assistance system.

You will be given a summary. Using points from that summary you will write feedback. If the user doesn't write anything, you will provide a generic feedback and invent reasons, for example "the genre and style didn't fit us", "we didn't like the drums/vocals/bass", and others like that.

- You are rewriting the user's feedback, not agreeing or disagreeing with the user. Your output will be what people think the user wrote
- You will write from the first person perspective, using plural pronouns "we", "us".
- Don't overuse the example.
- Make sure you include a conclusion such as "Best regards", and a friendly greeting.
- Sound natural, human, a bit formal.
- Sound like you are an experienced music promoter providing valuable feedback to the music artist.
- You won't suggest how to fix the existing track, but rather focus on clarifying what to pay attention to for future tracks
- You won't be overly technical
- Additional instructions by the user will be enclosed <as such>, so if a user writes <500 words>, you should write 500 words.
- By default, unless specified otherwise, you will write 250 words, in a semi-casual style.

- You will sign off and refer to yourself as "G"

Example feedback (for stylistic guidance only):

Hello there,

Thank you for submitting your track for our consideration.
After listening to your track, we can see that you have a good foundation, but we noticed a few areas that could use some improvement.

Firstly, we felt that the intro was a bit long-winded and empty.
Additionally, while the melody you chose to remix had potential, it quickly became repetitive. We really wanted to hear either the melody be switched up, or some additional sounds to be introduced to keep things interesting.
Furthermore, we found that the mixing felt too soft and lacked the necessary energy to bring out the Phonk vibe.
Lastly, the outro felt too sudden and lacked the proper build-up to create a satisfying end.

Summing up, we would suggest that you keep working on improving your production and perhaps try to experiment with original sounds and melodies to create unique and engaging tracks. We hope this feedback has been helpful, and we wish you the best of luck with your future projects.

Best regards,
- G
`;
let apiURL =
  localStorage.getItem("apiURL") ||
  "https://chat2.igerman.cc/v1/chat/completions";
let apiKey = localStorage.getItem("apiKey") || "Your-API-Key";
let selectedModel = localStorage.getItem("selectedModel") || "gpt-4o";

const activeStreams = new Map();
const ICONS = {
  generate: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Generate</title><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"></path></svg>`,
  stop: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><title>Stop</title><path d="M6 6h12v12H6z"></path></svg>`,
};

async function streamChatCompletion(prompt, textField, signal) {
  const requestBody = {
    model: selectedModel,
    presence_penalty: 0.7,
    top_p: 0.75,
    max_tokens: 3000,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt },
    ],
    stream: true,
  };

  const response = await fetch(apiURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
    signal: signal,
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: response.statusText }));
    throw new Error(
      `API Error: ${response.status} - ${
        errorData.error?.message || errorData.message
      }`
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  textField.value = ""; // Clear field for new content

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop(); // Keep the last, possibly incomplete line for the next chunk

    for (const line of lines) {
      if (line.trim().startsWith("data: ")) {
        const jsonStr = line.substring(6);
        if (jsonStr.trim() === "[DONE]") return;

        try {
          const chunk = JSON.parse(jsonStr);
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            textField.value += content;
            M.textareaAutoResize(textField);
            textField.dispatchEvent(new Event("input", { bubbles: true }));
          }
        } catch (e) {
          console.warn("Could not parse stream chunk:", jsonStr);
        }
      }
    }
  }
}

function addGenerateButton(textField) {
  const parentDiv = textField.parentElement;
  const feedbackIcons = parentDiv.querySelector("div.feedback-icons");

  if (!feedbackIcons || feedbackIcons.querySelector(".submitgpt-button")) return;

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "contents";
  buttonContainer.className = "submitgpt-button";
  buttonContainer.innerHTML = ICONS.generate;

  feedbackIcons.insertBefore(buttonContainer, feedbackIcons.firstChild);

  buttonContainer.addEventListener("click", async (event) => {
    if (event.shiftKey) {
      createModal();
      return;
    }

    if (activeStreams.has(textField)) {
      activeStreams.get(textField).abort();
      return;
    }

    const controller = new AbortController();
    activeStreams.set(textField, controller);

    let prompt = textField.value.trim();
    const originalContent = textField.value;
    if (!prompt) {
      prompt =
        "<There are no specific feedback points provided by the user. Provide a generic feedback.>";
    }

    buttonContainer.innerHTML = ICONS.stop;
    textField.disabled = true;

    try {
      await streamChatCompletion(prompt, textField, controller.signal);
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Stream cancelled by user.");
        textField.value = originalContent; // Restore original text on cancellation
      } else {
        console.error("Streaming failed:", error);
        alert(`Error: ${error.message}`);
        textField.value = originalContent; // Restore original text on other errors
      }
    } finally {
      activeStreams.delete(textField);
      buttonContainer.innerHTML = ICONS.generate;
      textField.disabled = false;
      M.textareaAutoResize(textField);
      textField.dispatchEvent(new Event("input", { bubbles: true }));
    }
  });
}

function addGenerateButtons() {
  const textFields = document.querySelectorAll('[id^="feedback-input-"]');
  textFields.forEach(addGenerateButton);
}

const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        if (node.matches('[id^="feedback-input-"]')) {
          addGenerateButton(node);
        } else {
          node
            .querySelectorAll('[id^="feedback-input-"]')
            .forEach(addGenerateButton);
        }
      }
    }
  }
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

window.addEventListener("load", addGenerateButtons);

const blockList = ["https://engine.montiapm.com"];
const open = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function () {
  const url = arguments[1];
  if (blockList.some((pattern) => url.includes(pattern))) {
    console.log(`Blocked request to ${url}`);
    return;
  }
  open.apply(this, arguments);
};

function createModal() {
  const existingModal = document.querySelector(".userscript-config-modal");
  if (existingModal) return;

  const modal = document.createElement("div");
  modal.className = "userscript-config-modal";
  modal.style.cssText = `
    width: 50vw; height: auto; position: fixed; top: 50%; left: 50%;
    transform: translate(-50%, -50%); max-height: 90vh; overflow-y: auto;
    background: #1f1f1f; padding: 20px; box-shadow: 0 0 24px rgba(0,0,0,0.5);
    border-radius: 8px; border: 1px solid rgba(255,255,255,0.5);
    opacity: 0; transition: opacity 0.2s ease-in-out; z-index: 9999;
  `;

  setTimeout(() => (modal.style.opacity = "1"), 0);

  const content = document.createElement("div");
  content.className = "modal-content";

  const modelList = [
    "gpt-3.5-turbo",
    "gpt-4o",
    "chatgpt-4o-latest",
    "gpt-4.1",
    "gpt-4.1-mini",
    "gpt-4.1-nano",
  ];

  const modelSelectionHTML = `
    <div style="margin-bottom: 20px;">
      <label for="model-select" style="display: block; text-align: center; margin-bottom: 10px;">Model:</label>
      <select id="model-select" class="browser-default" style="background: #292929; color: white; border: 1px solid grey; border-radius: 5px; padding: 10px; width: 100%;">
        ${modelList
          .map(
            (model) =>
              `<option value="${model}" ${
                selectedModel === model ? "selected" : ""
              }>${model}</option>`
          )
          .join("")}
      </select>
    </div>
  `;

  const systemPromptHTML = `
    <div style="margin-bottom: 20px;">
      <label style="display: block; text-align: center; margin-bottom: 10px;">System Prompt:</label>
      <textarea id="system-prompt-input" class="materialize-textarea" style="background: #292929; outline: grey solid 1px; padding: 10px; border-radius: 5px; color: white; min-height: 150px; height: auto;">${systemPrompt}</textarea>
    </div>
  `;

  const apiURLHTML = `
    <div style="margin-bottom: 20px;">
      <label style="display: block; text-align: center; margin-bottom: 10px;">API URL:</label>
      <textarea id="api-url-input" class="materialize-textarea" style="background: #292929; outline: grey solid 1px; padding: 10px; border-radius: 5px; color: white; height: auto;">${apiURL}</textarea>
    </div>
  `;

  const apiKeyHTML = `
    <div style="margin-bottom: 20px;">
      <label style="display: block; text-align: center; margin-bottom: 10px;">API Key:</label>
      <textarea id="api-key-input" class="materialize-textarea" type="password" style="background: #292929; outline: grey solid 1px; padding: 10px; border-radius: 5px; color: white; height: auto;">${apiKey}</textarea>
    </div>
  `;

  const closeButton = document.createElement("button");
  closeButton.textContent = "Close";
  closeButton.style.cssText = `
    background: transparent; color: #e57373; border: 1px solid #e57373;
    border-radius: 8px; padding: 8px 16px; margin: 10px auto; display: block;
    cursor: pointer; transition: all 0.2s ease-in-out;
  `;
  closeButton.onmouseover = () =>
    (closeButton.style.boxShadow = "0 0 8px #e57373");
  closeButton.onmouseout = () => (closeButton.style.boxShadow = "none");

  closeButton.addEventListener("click", () => {
    modal.style.opacity = "0";
    setTimeout(() => modal.remove(), 200);
  });

  content.innerHTML =
    modelSelectionHTML + systemPromptHTML + apiURLHTML + apiKeyHTML;
  content.appendChild(closeButton);
  modal.appendChild(content);
  document.body.appendChild(modal);

  const modelSelect = modal.querySelector("#model-select");
  const systemPromptInput = modal.querySelector("#system-prompt-input");
  const apiURLInput = modal.querySelector("#api-url-input");
  const apiKeyInput = modal.querySelector("#api-key-input");

  modelSelect.addEventListener("change", (e) => {
    selectedModel = e.target.value;
    localStorage.setItem("selectedModel", selectedModel);
  });
  systemPromptInput.addEventListener("input", (e) => {
    systemPrompt = e.target.value;
    localStorage.setItem("systemPrompt", systemPrompt);
  });
  apiURLInput.addEventListener("input", (e) => {
    apiURL = e.target.value;
    localStorage.setItem("apiURL", apiURL);
  });
  apiKeyInput.addEventListener("input", (e) => {
    apiKey = e.target.value;
    localStorage.setItem("apiKey", apiKey);
  });

  M.textareaAutoResize(systemPromptInput);
  M.textareaAutoResize(apiURLInput);
  M.textareaAutoResize(apiKeyInput);
}

GM.registerMenuCommand("Configure", createModal);