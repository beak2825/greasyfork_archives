// ==UserScript==
// @name         WebUI 프롬프트 확장?
// @namespace    https://greasyfork.org/ko/scripts/461682
// @version      0.2.2
// @description  챗 GPT에서 탬플릿 매번 작성없이 쓰기?
// @author       DeTK
// @match        https://chat.openai.com/chat
// @match        https://chat.openai.com/chat/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461682/WebUI%20%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8%20%ED%99%95%EC%9E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/461682/WebUI%20%ED%94%84%EB%A1%AC%ED%94%84%ED%8A%B8%20%ED%99%95%EC%9E%A5.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const texts = {"기본":"normal", "토픽":"topic"};

  while (true) {
    await sleep(500);
    if (document.querySelector("#__next") && !document.querySelector("#MakePrompt")) {
      await init();
    }
  }
  return;



  async function init() {

    document.querySelector("#MakePrompt")?.remove();
    const div = document.createElement("div");
    div.id = "MakePrompt";
    div.style.marginTop = "8px";

    const modal = document.createElement("div");
    modal.className = "dark hidden bg-gray-900 rounded-md px-2 pb-3 mb-3 overflow-auto h-80";
    const ul = document.createElement("ul");

    const getHeight = v => {
      const match = v.value.match(/\r?\n(?!\\)/g);
      const count = match ? match.length + 1 : 1;
      return `${24 * count}px`;
    };

    for (const text of ["기본", "토픽"]) {
      const li1 = document.createElement("li");
      li1.className = "text-xl ml-3 pb-3"
      li1.style = "padding-top: 8px;";
      li1.textContent = text;
      ul.append(li1);

      const li2 = document.createElement("li");
      li2.className = "flex flex-col w-full py-2 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]";
      const textarea = document.createElement("textarea");
      textarea.value = await GM.getValue(texts[text], "");
      textarea.style = "overflow-y:hidden; height:24px;";
      textarea.style.height = getHeight(textarea);
      textarea.className = `${texts[text]} m-0 w-full resize-none border-0 bg-transparent p-0 pl-2 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent md:pl-0`;

      for (const eventName of ["keydown", "keyup", "keypress"]) {
        textarea.addEventListener(eventName, async (e) => {
          if (8 == e.keyCode || 46 == e.keyCode || (13 == e.keyCode && e.shiftKey)) {
            textarea.style.height = getHeight(textarea);
            textarea.scrollTop = 0;
          }
          await GM.setValue(textarea.classList[0], textarea.value);
        });
      }
      textarea.addEventListener("focus", async (e) => {
        textarea.parentElement.previousElementSibling.scrollIntoView({ block: "start", inline: "nearest", behavior: "smooth" });
      });

      li2.append(textarea);
      ul.append(li2);
    }

    modal.append(ul);
    div.append(modal);

    const button1 = document.createElement("button");
    button1.textContent = "WebUI 프롬프트 설정";
    button1.style.display = "inlineblock";

    button1.onclick = (e) => {
      e.preventDefault();
      modal.classList.toggle("hidden");
    }
    button1.className = "btn relative btn-neutral border-0 md:border";
    div.append(button1);

    const input = document.createElement("input");
    input.type = "text";
    input.value = await GM.getValue("resultC", "1");
    input.style = "display:inlineblock; width:50px; text-align:center; font-size: 1rem;";
    input.style.marginLeft = "8px";
    input.className = "resultC btn-neutral relative border-0 md:border";
    input.addEventListener("input", async (e) => {
      await GM.setValue("resultC", input.value);
    });
    div.append(input);

    const button2 = document.createElement("button");
    button2.textContent = "검색";
    button2.style.display = "inlineblock";
    button2.style.marginLeft = "8px";
    button2.className = "btn relative btn-neutral border-0 md:border";
    button2.onclick = (e) => {
      // e.preventDefault();
      modal.classList.toggle("hidden", true);
      document.querySelector("form textarea").value = getPromptText();

    }
    div.append(button2);

    document.querySelector("form > div").appendChild(div)
    // setTimeout(console.clear, 1000);
  }

  function getPromptText() {
    return `I'll explain the rules for Rrompt Rearranger.
0. Response using absolutely only codeblocks and "Response Form" inside a code block and The format of the code block is in txt format.
1. Use {prompt} to refer to "provide prompt" as much as possible, and if there is anything missing, use your creativity to fill in the missing information.
2. Use only the parentheses provided.
3. Please make sure to include category names in your prompt when rearranging the prompts.
4. Add a short prompt description in "Description - ".
5. Please do not use () except for "Quality - " items.
6. Your response must be in English.
7. Do not modify the Provided Prompt, Do not modify the Quality.
8. Give the result in the same form as the "Response Form" without exception and with the use of absolutely!

Response Form :
Quality - {result}
Style - {result}
background - {result}
Subject - {result}
View - {result}
Appearance - {result}
Clothing - {result}
Pose - {result}
Details - {result}
Effects - {result}
Description - {result}

Quality :
"${document.querySelector("#MakePrompt .normal").value}"

Provided Prompt :
"${document.querySelector("#MakePrompt .topic").value}"

I only need the result in ${document.querySelector("#MakePrompt .resultC").value} code blocks.`;
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Your code here...
})();