// ==UserScript==
// @name         🤖ChatGPT 朗读助手 - 英语听力神器！
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在ChatGPT原生网页中添加朗读功能的脚本，可以让你听到ChatGPT的声音~。
// @author       OpenAI - ChatGPT
// @match        https://chat.openai.com/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464313/%F0%9F%A4%96ChatGPT%20%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B%20-%20%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%8A%9B%E7%A5%9E%E5%99%A8%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/464313/%F0%9F%A4%96ChatGPT%20%E6%9C%97%E8%AF%BB%E5%8A%A9%E6%89%8B%20-%20%E8%8B%B1%E8%AF%AD%E5%90%AC%E5%8A%9B%E7%A5%9E%E5%99%A8%EF%BC%81.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Load saved voice selection from localStorage
    const savedVoice =
          localStorage.getItem("savedVoice") ||
          "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)";

    const buttonStyles = {
        shared: {
            borderColor: "rgba(86,88,105,var(--tw-border-opacity))",
            fontSize: ".875rem",
            lineHeight: "1.25rem",
            padding: "0.5rem 0.75rem",
            borderRadius: "0.25rem",
            marginLeft: "0.25rem",
            position: "relative",
            bottom: "5px",
        },
        light: {
            backgroundColor: "white",
            color: "black",
        },
        dark: {
            backgroundColor: "rgba(52,53,65,var(--tw-bg-opacity))",
            color: "rgba(217,217,227,var(--tw-text-opacity))",
        }
    };

    const selectorStyles = {
        shared: {
            marginLeft: "0.25rem",
            position: "relative",
            bottom: "5px",
            fontSize: ".875rem",
            padding: "0.1rem 0.5rem",
            borderRadius: "0.25rem",
            display: "none", // Hide selector by default
        },
        light: {
            backgroundColor: "white",
            color: "black",
        },
        dark: {
            backgroundColor: "rgba(52,53,65,var(--tw-bg-opacity))",
            color: "rgba(217,217,227,var(--tw-text-opacity))",
        }
    };

    function isDarkMode() {
        return document.documentElement.classList.contains("dark");
    }

    function createButton() {
        const button = document.createElement("button");
        button.innerHTML = "朗读";
        button.title = "朗读";
        button.setAttribute("data-chatgpt", "");
        Object.assign(
            button.style,
            buttonStyles.shared,
            isDarkMode() ? buttonStyles.dark : buttonStyles.light
        );
        return button;
    }
    let selectedVoice = localStorage.getItem('savedVoice') || 'Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)';

    function updateAllSelectors() {
        const selectors = document.querySelectorAll('select[data-chatgpt]');
        selectors.forEach((select) => {
            select.value = selectedVoice;
        });
    }
    function createLanguageSelector() {
        const select = document.createElement('select');
        select.setAttribute('data-chatgpt', '');
        Object.assign(select.style, selectorStyles.shared, isDarkMode() ? selectorStyles.dark : selectorStyles.light);


        const voices = window.speechSynthesis
        .getVoices()
        .filter((voice) => voice.name.includes("Microsoft"));

        const voiceGroups = voices.reduce((groups, voice) => {
            const language = voice.lang.split("-")[0];
            if (!groups[language]) {
                groups[language] = [];
            }
            groups[language].push(voice);
            return groups;
        }, {});

        Object.keys(voiceGroups).forEach((language) => {
            const optgroup = document.createElement("optgroup");
            optgroup.label = language;
            voiceGroups[language].forEach((voice) => {
                const option = document.createElement("option");
                option.value = voice.name;
                option.text = voice.name.replace('Microsoft ', '');
                optgroup.appendChild(option);
            });
            select.appendChild(optgroup);
        });

        select.value = selectedVoice;


        return select;
    }

    function createToggleButton() {
        const toggleButton = document.createElement("button");
        const svgIcon = `<svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M42 19H5.99998" stroke="${isDarkMode() ? buttonStyles.dark.color : buttonStyles.light.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M30 7L42 19" stroke="${isDarkMode() ? buttonStyles.dark.color : buttonStyles.light.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.79897 29H42.799" stroke="${isDarkMode() ? buttonStyles.dark.color : buttonStyles.light.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.79895 29L18.799 41" stroke="${isDarkMode() ? buttonStyles.dark.color : buttonStyles.light.color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>`;
      toggleButton.innerHTML = svgIcon;
      toggleButton.title = "切换语言包";
      toggleButton.setAttribute("data-chatgpt", "");
      Object.assign(
          toggleButton.style,
          buttonStyles.shared,
          isDarkMode() ? buttonStyles.dark : buttonStyles.light
      );
      return toggleButton;
  }


    function createSaveButton() {
        const saveButton = document.createElement("button");
        saveButton.innerHTML = "保存";
        saveButton.title = "保存";
        saveButton.setAttribute("data-chatgpt", "");
        Object.assign(
            saveButton.style,
            buttonStyles.shared,
            isDarkMode() ? buttonStyles.dark : buttonStyles.light
        );
        return saveButton;
    }



    function addButtonAndSelector() {
        const elements = document.querySelectorAll('.markdown.prose');
        elements.forEach((elm) => {
            if (elm.nextElementSibling?.getAttribute('data-chatgpt-container') === 'true') return;

            const button = createButton();
            const languageSelector = createLanguageSelector();
            const toggleButton = createToggleButton();
            const saveButton = createSaveButton();

            button.addEventListener("mouseenter", () => {
                button.style.backgroundColor = buttonStyles.hover.backgroundColor;
            });

            button.addEventListener("mouseleave", () => {
                button.style.backgroundColor = buttonStyles.normal.backgroundColor;
            });

            button.addEventListener("click", () => {
                if (button.classList.contains("playing")) {
                    window.speechSynthesis.cancel();
                    button.innerHTML = "朗读";
                    button.classList.remove("playing");
                    button.disabled = false;
                    return;
                }

                button.classList.add("playing");
                button.innerHTML = "生成中请稍等...";
                button.disabled = true;

                const msg = new SpeechSynthesisUtterance(elm.textContent);
                msg.rate = 0.825;

                msg.addEventListener("boundary", (event) => {
                    const currentWord = elm.textContent.slice(
                        event.charIndex,
                        event.charIndex + event.charLength
                    );
                    button.innerHTML = `朗读中: ${currentWord}`;
                    button.disabled = false;
                });

                msg.addEventListener("end", () => {
                    button.innerHTML = "朗读";
                    button.classList.remove("playing");
                    button.disabled = false;
                });

                msg.voice = speechSynthesis
                    .getVoices()
                    .find((voice) => voice.name === languageSelector.value);

                msg.onerror = (errorEvent) => {
                    if (errorEvent.error === "interrupted") {
                        return;
                    }
                    const errorMsg = `发生错误: ${errorEvent.error}`;
                    button.innerHTML = `发生错误: ${errorEvent.error}`;
                    button.classList.remove("playing");
                    button.disabled = false;
                };

                window.speechSynthesis.speak(msg);
            });

            toggleButton.addEventListener('click', () => {
                languageSelector.style.display = languageSelector.style.display === 'none' ? 'block' : 'none';
                saveButton.style.display = saveButton.style.display === 'none' ? 'block' : 'none';
            });

            saveButton.addEventListener('click', () => {
                selectedVoice = languageSelector.value;
                localStorage.setItem('savedVoice', selectedVoice);
                languageSelector.style.display = 'none';
                saveButton.style.display = 'none';
                updateAllSelectors();
            });

            saveButton.style.display = 'none';
            const container = document.createElement("span");
            container.setAttribute("data-chatgpt-container", "true");
            container.appendChild(button);
            container.appendChild(toggleButton);
            container.appendChild(languageSelector);
            container.appendChild(saveButton);
            Object.assign(container.style, {
                display: "flex",
                alignItems: "center",
            });


            saveButton.addEventListener("click", () => {
                localStorage.setItem("savedVoice", languageSelector.value);
            });

            elm.parentNode.insertBefore(container, elm.nextSibling);
        });
    }

    function updateButtonAndSelectorStyles() {
        const buttons = document.querySelectorAll("button[data-chatgpt]");
        const selectors = document.querySelectorAll("select[data-chatgpt]");

        buttons.forEach((button) => {
            Object.assign(
                button.style,
                buttonStyles.shared,
                isDarkMode() ? buttonStyles.dark : buttonStyles.light
            );
            if (button.hasAttribute("data-chatgpt")) {
                const svgIcon = button.querySelector("svg");
                const paths = svgIcon.querySelectorAll("path");
                paths.forEach((path) => {
                    path.setAttribute("stroke", isDarkMode() ? buttonStyles.dark.color : buttonStyles.light.color);
                });
            }
        });

        selectors.forEach((select) => {
            Object.assign(
                select.style,
                selectorStyles.shared,
                isDarkMode() ? selectorStyles.dark : selectorStyles.light
            );
        });
    }


    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            window.speechSynthesis.cancel();
            const buttons = document.querySelectorAll("button.playing");
            buttons.forEach((button) => {
                button.innerHTML = "朗读";
                button.classList.remove("playing");
            });
        }
    });

    window.speechSynthesis.onvoiceschanged = () => {
        addButtonAndSelector();
    };

    window.addEventListener("beforeunload", () => {
        window.speechSynthesis.cancel();
    });

    setInterval(() => {
        addButtonAndSelector();
    }, 2000);

    const darkModeObserver = new MutationObserver(updateButtonAndSelectorStyles);
    darkModeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
    });
})();
