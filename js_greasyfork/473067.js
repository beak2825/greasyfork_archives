// ==UserScript==
// @name         ChatGPT+轻小说生肉TXT+分段上传+自动翻译
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  GPT自动分段上传轻小说生肉TXT,然后翻译输出中文内容
// @author       LegendYU
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473067/ChatGPT%2B%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%94%9F%E8%82%89TXT%2B%E5%88%86%E6%AE%B5%E4%B8%8A%E4%BC%A0%2B%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/473067/ChatGPT%2B%E8%BD%BB%E5%B0%8F%E8%AF%B4%E7%94%9F%E8%82%89TXT%2B%E5%88%86%E6%AE%B5%E4%B8%8A%E4%BC%A0%2B%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Initialize default values
    let num = 15;
    let shouldStop = false;
    let prefixText = "";

    // CSS styles for the elements
    const styles = {
        button:
        "background-color: #FAE69E; font-weight: bold; width:100px; height:30px; color: #927201; padding: 5px; border: none; border-radius: 5px; margin: 5px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;",
        greenButton:
        "background-color: #19C37D; font-weight: bold; width:100px; height:30px; color: white; padding: 5px; border: none; border-radius: 5px; margin: 5px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;",
        stopButton:
        "background-color: #dc3545; font-weight: bold; width:100px; height:30px; color: white; padding: 5px; border: none; border-radius: 5px; margin: 5px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;",
        aboutButton:
        "background-color: #FAE69E; font-weight: bold; width:100px; height:30px; color: #927201; padding: 5px; border: none; border-radius: 5px; margin: 5px; font-size: 14px; cursor: pointer; transition: all 0.3s ease;",
        progress:
        "width: 70%; height: 15px; background-color: #d9d9e3; border-radius: 15px; margin-top: 10px; overflow: hidden; margin: 0 auto; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);",
        progressBar:
        "height: 100%; background: linear-gradient(90deg, #19C37D, #1B98E0); width: 0%; transition: width 0.5s ease-in-out; border-radius: 15px;",
        input:
        "margin: 5px; width: 120px; height: 30px; padding: 5px; font-size: 14px; border: 1px solid #ccc; border-radius: 5px;",
    };

    // Function to create an input
    const createInput = (placeholderText) => {
        const input = document.createElement("input");
        input.type = "number";
        input.placeholder = placeholderText;
        input.style = styles.input;
        return input;
    };

    // Function to create a file input
    const createFileInput = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".txt,.js,.py,.html,.css,.json,.csv";
        input.style = styles.input;
        return input;
    };

    // Function to create a button
    const createButton = (text, style) => {
        const button = document.createElement("button");
        button.style = style;
        button.textContent = text;
        // Add hover style
        button.onmouseover = function () {
            this.style.border = "2px solid rgba(0, 0, 0, 0.5)"; // shallow black border on hover
        };
        button.onmouseout = function () {
            this.style.border = "none"; // remove border when mouse leaves
        };
        return button;
    };

    // Function to create a button wrapper (div)
    const createButtonWrapper = (
        submitButton,
        aboutButton,
        input1,
        input2,
        prefixButton
    ) => {
        const div = document.createElement("div");
        div.classList.add("buttonWrapper");
        div.appendChild(input1);
        div.appendChild(input2);
        div.appendChild(prefixButton);
        div.appendChild(submitButton);
        div.appendChild(aboutButton);
        div.setAttribute("data-inserted", "true");
        return div;
    };

    // Function to create a progress element
    const createProgress = () => {
        const progress = document.createElement("div");
        progress.style = styles.progress;
        const progressBar = document.createElement("div");
        progressBar.style = styles.progressBar;
        const progressAnimation = document.createElement("style");
        progressAnimation.type = "text/css";
        progressAnimation.innerHTML = `
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .animated-gradient {
      background-size: 200% 200%;
      animation: gradient 5s ease infinite;
    }
  `;
    document.head.appendChild(progressAnimation);
    progressBar.classList.add("animated-gradient");
    progress.appendChild(progressBar);
    return { progress, progressBar };
};

    function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    // Async function to submit conversation
    async function submitConversation(text, part, filename, delay) {
        const textarea = document.querySelector("textarea[tabindex='0']");
        const inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        const enterKeyEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            keyCode: 13,
        });
        textarea.value = `Part ${part} of ${filename}: \n\n ${prefixText} ${text}`;
        textarea.dispatchEvent(inputEvent);
        await sleep(delay);
        textarea.dispatchEvent(enterKeyEvent);
    }

    // Function to check if ChatGPT is ready
    async function isChatGptReady() {
        let chatgptReady = false;
        while (!chatgptReady) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
        }
        return chatgptReady;
    }

    // Function to split text into sentences
    function splitIntoSentences(text) {
        // Use regular expression to split text by sentence
        return text.match(/[^。！？”.!?]+[。！？”.!?]+/g);
    }

    // Function to group sentences
    function groupSentences(sentences, groupSize) {
        const groups = [];
        for (let i = 0; i < sentences.length; i += groupSize) {
            groups.push(sentences.slice(i, i + groupSize).join(""));
        }
        return groups;
    }

    const initPlugin = () => {
        // Check if the element exists and insert the elements into the DOM
        const checkExist = setInterval(function () {
            const parentElement = document.querySelector(
                ".pb-3.pt-2"
            );
            if (
                parentElement !== null &&
                !parentElement.getAttribute("data-inserted")
            ) {
                console.log("Element exists!");
                // 添加一个标记，表示已经插入了插件
                parentElement.setAttribute("data-inserted", "true");
                // Create elements
                prefixText = "将以下日语内容翻译成简体中文:";
                const submitButton = createButton("上传文件", styles.button);
                const aboutButton = createButton("关于", styles.aboutButton);
                const numInput = createInput("单次句子数量");
                const delayInput = createInput("延迟时间（秒）");
                const prefixButton = createButton("前置提示词", styles.button);
                const buttonWrapper = createButtonWrapper(
                    submitButton,
                    aboutButton,
                    numInput,
                    delayInput,
                    prefixButton
                );

                const { progress, progressBar } = createProgress();
                parentElement.insertBefore(buttonWrapper, parentElement.firstChild);
                parentElement.insertBefore(progress, parentElement.firstChild);
                clearInterval(checkExist);

                // Handle prefix button click
                prefixButton.addEventListener("click", () => {
                    const prefixInput = createFileInput();

                    const fileChangeListener = async () => {
                        if (!prefixInput.files.length) {
                            // add this check
                            prefixInput.removeEventListener("change", fileChangeListener);
                            return;
                        }

                        const file = prefixInput.files[0];
                        const reader = new FileReader();
                        reader.readAsText(file);
                        reader.onload = () => {
                            prefixText = reader.result;
                            prefixButton.style = styles.greenButton;
                        };
                    };

                    prefixInput.addEventListener("change", fileChangeListener);

                    prefixInput.click();
                });

                submitButton.addEventListener("click", async () => {
                    // If a file is uploading, stop it
                    if (submitButton.textContent === "停止") {
                        shouldStop = true;
                        progressBar.style.width = "0%";
                        submitButton.textContent = "上传文件"; // change the button text back to 'Upload file'
                        submitButton.style = styles.button; // change the button color back to blue
                        return;
                    }

                    // Get values from inputs and update variables
                    num = numInput.value ? parseInt(numInput.value) : num;
                    const delay = delayInput.value
                    ? parseInt(delayInput.value) * 1000
                    : 1000;
                    const input = createFileInput();

                    const fileChangeListener = async () => {
                        if (!input.files.length) {
                            // add this check
                            input.removeEventListener("change", fileChangeListener);
                            return;
                        }

                        const file = input.files[0];
                        const reader = new FileReader();
                        reader.readAsText(file);
                        reader.onload = async () => {
                            // Change the button to a stop button after file read is completed
                            submitButton.textContent = "停止"; // change the button text to 'Stop'
                            submitButton.style = styles.stopButton; // change the button color to red

                            const sentences = splitIntoSentences(reader.result);
                            const chunks = groupSentences(sentences, num);
                            for (let i = 0; i < chunks.length; i++) {
                                if (shouldStop) {
                                    shouldStop = false;
                                    break;
                                }
                                if (!shouldStop) {
                                    await submitConversation(chunks[i], i + 1, file.name, delay);
                                }
                                progressBar.style.width = `${((i + 1) / chunks.length) * 100}%`;
                                if (!shouldStop) {
                                    await isChatGptReady();
                                }
                                if (shouldStop) {
                                    shouldStop = false;
                                    break;
                                }
                            }
                            progressBar.style.backgroundColor = "#19C37D";

                            // After file uploading is finished or stopped
                            submitButton.textContent = "上传文件"; // change the button text back to 'Upload file'
                            submitButton.style = styles.button; // change the button color back to blue
                            progressBar.style.width = "0%";
                        };
                    };

                    input.addEventListener("change", fileChangeListener);
                    input.click();
                });

                // aboutButton click
                aboutButton.addEventListener("click", () => {
                    // 生成一个半透明的背景
                    const overlay = document.createElement("div");
                    overlay.style = `
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
`;

          // 生成一个带有毛玻璃效果的窗口
          const modal = document.createElement("div");
          modal.style = `
  width: 50%;
  padding: 20px;
  background: rgba(225, 225, 225, 0.7);
  border-radius: 10px;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  text-align: center;
`;

          // 添加帮助文字
          const text = document.createElement("p");
          text.innerHTML =
              "<div>【ChatGPT自动上传插件】</div>" +
              '<div style="text-align: left;"><br>1.选择参数：设定单次发送句子的数量和延迟时间。<br>' +
              "2.设定提示词(可选)：点击“前置提示词”按钮，选择一个文件作为固定提示词。<br>" +
              "3.上传文件：点击“上传文件”按钮，选择一个文本。<br>" +
              "4.停止上传：在文件上传过程中，随时可以点击“停止”按钮来停止上传。<br>" +
              "5.查看进度：屏幕上的进度条显示上传的进度。<br><br>" +
              "【注意】上传文件只支持TXT格式，上传文件后会稍微卡顿几秒。<br><br>" +
              "作者：老陆（微信：laolu2045）<br>" +
              "想加入AI群一起学习或有其他建议请联系我。</div>";
          modal.appendChild(text);

          // 添加关闭按钮
          const closeButton = document.createElement("button");
          closeButton.textContent = "关闭";
          closeButton.style = `
  display: block;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background: linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%);
  box-shadow: 0px 3px 15px rgba(0,0,0,0.2);
  color: white;
  cursor: pointer;
  transition: background 0.5s;
`;
          closeButton.addEventListener("mouseover", () => {
              closeButton.style.background = "rgba(236, 116, 116, 1)";
          });
          closeButton.addEventListener("mouseout", () => {
              closeButton.style.background =
                  "linear-gradient(90deg, rgba(235, 52, 52, 1) 0%, rgba(236, 116, 116, 1) 100%)";
          });
          closeButton.addEventListener("click", () => {
              document.body.removeChild(overlay);
          });
          modal.appendChild(closeButton);

          // 将窗口添加到背景上，然后将背景添加到文档上
          overlay.appendChild(modal);
          document.body.appendChild(overlay);
      });
    }
  }, 100);
};

    // Initialize MutationObserver
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList") {
                const targetElement = document.querySelector(
                    ".pb-3.pt-2"
                );

                if (
                    targetElement !== null &&
                    !targetElement.querySelector(".buttonWrapper[data-inserted='true']")
                ) {
                    initPlugin();
                }
            }
        }
    };

    // 使用MutationObserver来监听DOM变化
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            // 检查是否有新节点被添加
            if (mutation.addedNodes.length) {
                initPlugin();
            }
        });
    });

    // 选项配置
    const observerConfig = {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true,
    };

    // 监听document.body的变化
    observer.observe(document.body, observerConfig);

})();