// ==UserScript==
// @name        StackOverflow Code Language Switcher
// @namespace   https://github.com/Christopher-Hayes/stackoverflow-code-language-switcher
// @homepageURL https://github.com/Christopher-Hayes/stackoverflow-code-language-switcher
// @supportURL  https://github.com/Christopher-Hayes/stackoverflow-code-language-switcher
// @description Adds a dropdown to code blocks in StackOverflow to switch the code language. Powered by GPT-3 AI.
// @match       https://stackoverflow.com/questions/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_addValueChangeListener
// @grant       GM_setClipboard
// @version     1.0
// @author      Chris Hayes
// @license     GPL3
// @downloadURL https://update.greasyfork.org/scripts/457875/StackOverflow%20Code%20Language%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/457875/StackOverflow%20Code%20Language%20Switcher.meta.js
// ==/UserScript==

class LangConvert {
  constructor() {
    this.key = GM_getValue("openai_key", "");

    if (!this.key || this.key === "your-openai-key-here") {
      GM_setValue("openai_key", "your-openai-key-here");
      console.error(
        '"openai_key" not set in violent monkey script. Please get an OpenAI key and set this config value to use the OpenAI API.'
      );
    }

    this.supportedLanguages = GM_getValue("supported_languages", [
      "javascript",
      "typescript",
      "python",
      "java",
      "bash",
      "css",
      "scss",
      "html",
      "c",
      "c++",
      "c#",
      "rust",
      "go",
      "kotlin",
      "php",
      "ruby",
      "liquid",
      "swift",
      "react",
      "vue",
      "svelte",
      "angular",
    ]);

    GM_setValue("supported_languages", this.supportedLanguages);

    this.previousConversions = {};
  }

  setKey(newKey) {
    this.key = newKey;
  }
  setSupportedLanguages(newLanguages) {
    this.supportedLanguages = newLanguages;
  }

  async makeGPT3Request(code, oldLang, newLang) {
    const url = "https://api.openai.com/v1/completions";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.key}`,
    };

    // Uses Davinci 003 text-completion
    // code-completion and edit were slower and didn't work as well
    const body = {
      model: "text-davinci-003",
      prompt: `# Convert this${oldLang ? " from " + oldLang : ""} to ${newLang}
# ${oldLang ? oldLang : "Old"} version

${code}

# ${newLang} version`,
      max_tokens: 1000,
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    console.log(
      "[StackOverflow Code Language Switcher] Full OpenAI response:",
      response
    );

    const data = await response.json();
    console.log("[StackOverflow Code Language Switcher] Response data:", data);

    let newCode = data.choices[0].text;
    // if the first line is an empty newline, remove it
    if (newCode.startsWith("\n")) {
      newCode = newCode.slice(1);
    }
    // if the last line is an empty newline, remove it
    if (newCode.endsWith("\n")) {
      newCode = newCode.slice(0, -1);
    }

    return newCode;
  }

  getCodeElements() {
    return Array.from(document.querySelectorAll(".s-prose pre code"));
  }

  setup() {
    const codeElements = this.getCodeElements();

    for (const codeElem of codeElements) {
      const pre = codeElem.parentElement;
      const div = document.createElement("div");
      div.classList.add("lang-convert");
      div.style = `
        height: 0;
        float: right;
        margin-bottom: -20px;
        display: block;
        position: relative;
        top: 10px;
        right: 8px;
      `;

      // Show supported languages in dropdown
      const select = document.createElement("select");
      select.innerHTML = `${this.supportedLanguages
        .slice(0, 20)
        .map((lang) => `<option value="${lang}">${lang}</option>`)
        .join("")}`;
      select.style = `
        background: #181818;
        color: #999;
        outline: none;
        border: 0;
        padding: .5em 0.7em;
        border-radius: 7px;
        font-size: 12px;
      `;
      // Change style of select element when hovered over
      select.addEventListener("mouseenter", () => {
        select.style.background = "black";
        select.style.color = "white";
      });
      select.addEventListener("mouseleave", () => {
        select.style.background = "#181818";
        select.style.color = "#999";
      });
      div.appendChild(select);

      // Add div before pre element
      pre.parentElement.insertBefore(div, pre);

      // Set default value of dropdown to the language of the code element
      const lang = codeElem.className.split("-")[1];
      select.value = lang;

      this.previousConversions[lang] = codeElem.textContent;

      select.addEventListener("change", async (e) => {
        const oldLang = codeElem.className.split("-")[1];
        const newLang = e.target.value;
        if (oldLang === newLang) return;

        // Show "converting" overlay message
        const overlay = document.createElement("div");
        overlay.style = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 20px;
          font-weight: bold;
        `;
        overlay.innerHTML = "Converting...";
        pre.style.position = "relative";
        pre.appendChild(overlay);

        const oldCode = codeElem.textContent;
        let newCode = "";
        if (this.previousConversions[newLang]) {
          newCode = this.previousConversions[newLang];
        } else {
          newCode = await this.makeGPT3Request(oldCode, oldLang, newLang);
          this.previousConversions[newLang] = newCode;
        }

        GM_setClipboard(newCode);

        codeElem.classList.remove(`language-${oldLang}`);
        codeElem.classList.add(`language-${newLang}`);
        codeElem.textContent = newCode;

        // add a script to the page that will highlight the new code using window.hljs
        // This must be injected to have access to the highlight.js object already loaded into StackOverflow
        const codeID =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);
        codeElem.id = codeID;
        const script = document.createElement("script");
        script.innerHTML = `if (window.hljs) window.hljs.highlightElement(document.getElementById("${codeID}"));`;
        document.body.appendChild(script);

        // Remove "converting" overlay message
        pre.removeChild(overlay);
        pre.style.position = "static";
      });
    }
  }
}

let langConvert = new LangConvert();
langConvert.setup();

GM_addValueChangeListener("openai_key", (name, oldValue, newValue) => {
  langConvert.setKey(newValue);
});

GM_addValueChangeListener("supported_languages", (name, oldValue, newValue) => {
  langConvert.setSupportedLanguages(newValue);
});
