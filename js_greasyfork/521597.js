// ==UserScript==
// @name         Streamer Mode for skribbl.io
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Add on for streaming skribbl.io - Safe streaming everyone!
// @author       Alpha
// @match        https://skribbl.io/*
// @exclude      https://skribbl.io/credits
// @grant        none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/521597/Streamer%20Mode%20for%20skribblio.user.js
// @updateURL https://update.greasyfork.org/scripts/521597/Streamer%20Mode%20for%20skribblio.meta.js
// ==/UserScript==

    (function() {
        'use strict';

        const style = document.createElement('style');
        style.textContent = `
        body{
        background-image: url("https://imgur.com/xVBUecv.png");
        }

        #home .button-create{
        background-color: #403483;
}
        #home .button-create:hover:not(:disabled){
        background-color: #1d1648;
        }
        #home .button-play{
        background-color: #6441A4;
        }

        #home .button-play:hover:not(:disabled){
        background-color:rgb(48, 27, 90);
        }
    `;
        document.documentElement.style.setProperty('--COLOR_PANEL_BG', '#1e006480');
        document.documentElement.style.setProperty('--COLOR_PANEL_LO', '#403483');
        document.documentElement.style.setProperty('--COLOR_PANEL_HI', '#ffffff');
        document.documentElement.style.setProperty('--COLOR_PANEL_BUTTON', '#6441A4');
        document.documentElement.style.setProperty('--COLOR_TOOL_TIP_BG', '#6441A4');
        document.documentElement.style.setProperty('--COLOR_CHAT_TEXT_JOIN', '#5a5dff');
        document.documentElement.style.setProperty('--COLOR_CHAT_TEXT_GUESSCHAT', '#3f47ad');
        document.documentElement.style.setProperty('--COLOR_PLAYER_BG_GUESSED_BASE', '#8b72d6');
        document.documentElement.style.setProperty('--COLOR_PLAYER_BG_GUESSED_ALT', '#6441A4');
        document.documentElement.style.setProperty('--COLOR_PANEL_BUTTON_HOVER', 'rgb(48, 27, 90)');
        document.documentElement.style.setProperty('--COLOR_CHAT_BG_GUESSED_BASE', '#ac91ff');
        document.documentElement.style.setProperty('--COLOR_CHAT_BG_GUESSED_ALT', '#c0bdff');
        document.documentElement.style.setProperty('--COLOR_PLAYER_ME_GUESSED', '#c0bdff');
        document.documentElement.style.setProperty('--COLOR_PLAYER_ME', '#6549ff');
        document.head.appendChild(style);

        const logoImg = document.querySelector("#home > div.logo-big > a > img");
        if (logoImg) {
            logoImg.src = "https://imgur.com/gIKOKSJ.gif";
        }

        const logoImgSmol = document.querySelector("#game-logo > a > img");
        if (logoImgSmol) {
            logoImgSmol.src = "https://imgur.com/gIKOKSJ.gif";
        }

        const buttonContainer = document.createElement('div');
        buttonContainer.style.position = 'fixed';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.padding = '15px';
        buttonContainer.style.backgroundColor = 'var(--COLOR_PANEL_BG)';
        buttonContainer.style.zIndex = '999';
        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexDirection = 'column';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.borderRadius = 'var(--BORDER_RADIUS)';
        buttonContainer.style.alignItems = 'center';

        const streamingButton = document.createElement('button');
        streamingButton.textContent = '';
        streamingButton.style.cssText = `
            z-index: 1000;
            width: 32px;
            height: 32px;
            background-image: url('https://imgur.com/1n1H9g7.gif');
            cursor: pointer;
            filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
            background-color: transparent;
            background-size: contain;
            background-repeat: no-repeat;
            position: relative;
            opacity: 0.6;
            transition: opacity .15s ease, transform .15s ease;
        `;



        // Button Tooltip Creation

        function createTooltip(button, tooltipText) {

            button.textContent = '';

            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip W';
            tooltip.style.cssText = `
                position: absolute;
                z-index: 10000;
                filter: drop-shadow(2px 2px 2px rgba(0, 0, 0, .15));
                animation: tooltip_introduce 0.2s ease-in-out;
                visibility: hidden;
                opacity: 0;
                transition: opacity 0.3s;
            `;

            const tooltipContent = document.createElement('div');
            tooltipContent.className = 'tooltip-content';
            tooltipContent.textContent = tooltipText;
            tooltipContent.style.cssText = `
                color: var(--COLOR_PANEL_TEXT);
                background-color: var(--COLOR_TOOL_TIP_BG);
                border-radius: var(--BORDER_RADIUS);
                padding: 7px;
                font-size: 11.5px;
                white-space: nowrap;
                text-align: center;
                text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.22);
            `;

            const tooltipArrow = document.createElement('div');
            tooltipArrow.className = 'tooltip-arrow';
            tooltipArrow.style.cssText = `
                position: absolute;
                top: 50%;
                left: -14px;
                border-top: 10px solid transparent;
                border-bottom: 10px solid transparent;
                border-left: 10px solid var(--COLOR_TOOL_TIP_BG);
                transform: translateY(-50%);
            `;

            tooltip.appendChild(tooltipContent);
            tooltip.appendChild(tooltipArrow);

            button.style.position = 'relative';
            button.appendChild(tooltip);

            button.addEventListener('mouseenter', () => {
                tooltip.style.visibility = 'visible';
                tooltip.style.opacity = '1';
                button.style.opacity = '1';
                button.style.transform = 'scale(1.2)';
            });

            button.addEventListener('mouseleave', () => {
                tooltip.style.visibility = 'hidden';
                tooltip.style.opacity = '0';
                button.style.opacity = '0.6';
                button.style.transform = 'scale(1)';
            });
        }

        createTooltip(streamingButton, 'Streamer Mode!');

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
        @keyframes tooltip_introduce {
            0% {
                opacity: 0;
                transform: scale(0.8);
            }
            100% {
                opacity: 1;
                transform: scale(1);
            }
        }
    `;
        document.head.appendChild(styleSheet);
        buttonContainer.appendChild(streamingButton);
        document.body.appendChild(buttonContainer);

        // Streamer Mode

        let streamerModeEnabled = false;
        let popupWindow = null;
        let observer = null;
        let hintsObserver = null;
        let chatObserver = null;
        let bannedWords = [];
        let standardBannedWords = ["nigger", "niger", "negro", "horny", "nigga", "blowjob", "jackoff", "jack off", "fuck", "20cm", "6 inch", "handjob", "whore", "cunt", "卐", "88", "cock", "viagra", "neger", "afd", "cdu", "csu", "dick", "👉👌", "asesinato", "asno", "bastardo", "bollera", "cabrón", "caca", "chupada", "chupapollas", "chupetón", "concha", "concha de tu madre", "coño", "coprofagía", "culo", "drogas", "esperma", "fiesta de salchichas", "follador", "follar", "gilipichis", "gilipollas", "hacer una paja", "haciendo el amor", "heroína", "idiota", "imbécil", "infierno", "jilipollas", "kapullo", "lameculos", "maciza", "macizorra", "maldito", "mamada", "marica", "maricón", "mariconazo", "martillo", "mierda", "nazi", "orina", "pedo", "pendejo", "pervertido", "pezón", "pinche", "pis", "prostituta", "puta", "racista", "ramera", "sádico", "semen", "sexo", "sexo oral", "soplagaitas", "soplapollas", "tetas grandes", "tía buena", "travesti", "trio", "verga", "vete a la mierda", "fucker", "tribadism", "two girls one cup", "topless", "vibrator", "twink", "voyeur", "swastika", "schwuchtel", "schlong", "threesome", "lolita", "throat", "swinger", "tubgirl", "upskirt", "urethra", "wet", "philia", "orgasm", "panty", "orgy", "bitch", "doggy", "gangbang", "gang bang", "genital", "homoerotic", "golden shower", "dildo", "penis", "pedo", "pegg", "nsfw", "nig nog", "vagina", "kys", "fuck you", "suicid", "sucker", "2 girls 1 cup", "suck", "2g1c", "tit", "🖕", "bdsm", "milf", "gilf", "nud", "anus", "scissoring", "slut", "sex", "hitler", "adolf", "hoe", "fucking", "piece of shit", "rectum", "boob", "jerk", "masturbat", "xx", "porn", "rape", "rosy", "camgirl", "sodom", "rapi", "pube", "fuck me", "strap", "strip", "prostit", "gay sex", "ape", "blonde on blonde", "bastar", "coprolagnia", "fucking gay", "eat my", "cream pie", "creampie", "creaming", "cum", "puss", "lewd", "hentai", "gya", "shut the fuck up", "卍", "ꖦ", "✙", "ᛋᛋ", "☭", "deez", "squirt", "dumbass", "nutt", "nut in", "thicc", "moan", "blow job", "anal", "rectal", "oral", "jew", "biggers", "booty", "glans", "vulva", "twat", "boner", "booti", "wank", "jizz", "doggie", "asshole", "arse", "gore", "missionary", "bang", "fecal", "eroti", "fellatio", "femdom", "mia kh", "groom", "mös", "kanak", "kanack", "fresse", "lesbe", "prick", "hure", "wichs", "pthc", "wix", "fick", "arsch", "undress", "hundeso", "leck m", "flittchen", "kack", "gefickt"];
        const wordsContainerSelector = "#game-canvas > div.overlay-content > div.words";
        const currentWordSelector = "#game-word > div.word";

        function saveBannedWords() {
            const allBannedWords = [...new Set(bannedWords)];
            localStorage.setItem("bannedWords", JSON.stringify(allBannedWords));
        }

        function loadBannedWords() {
            const storedWords = localStorage.getItem("bannedWords");
            if (storedWords) {
                bannedWords = JSON.parse(storedWords);
            }
            console.log(bannedWords)
        }

        function openStreamerWindow() {
            if (!popupWindow || popupWindow.closed) {
                popupWindow = window.open(
                    "",
                    "StreamerMode",
                    "width=600,height=800,scrollbars=no,resizable=yes,top=100,left=100"
                );

                if (popupWindow) {
                    popupWindow.document.title = "Streamer Mode";
                    popupWindow.document.body.style.cssText = `
                            font-family: "Nunito", sans-serif;
                            padding: 10px;
                            margin: 0;
                            background-image: url("https://imgur.com/xVBUecv.png");
                            background-size: 350px;
                            background-repeat: repeat;
                            color: #fff;
                            user-select: none;
                            display: flex;
                            flex-direction: column;
                            width: 100%;
                            height: 100%;
                        `;
                    popupWindow.document.body.innerHTML = `
                            <h2 style="filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));">Words:</h2>
                            <div id="streamer-words" style="display: flex; flex-wrap: wrap; gap: 8px; background: #35394A; font-weight: bold;"></div>
                            <h2 style="filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));">Current Word:</h2>
                            <div id="streamer-current-word" style="font-size: 1.2em; font-weight: bold; color: black; background: white; border-radius: 4px; width: 300px; height: 50px; display: flex; justify-content: center; align-items: center;"></div>
                            <div class="filterHeader" style="display: flex; align-items: center; gap: 8px; flex: 0 1 auto;"><img src="https://imgur.com/iSRTj2U.gif" alt="icon" style="width: 32px; height: 32px; filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));"><h2 style="filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));">Banned Words/Phrases</h2></div>
                            <textarea id="banned-words-input" spellcheck="false" placeholder="Words/phrases separated by a , (comma)" style="width: 90%; height: 200px; border: 1px solid #707070; filter: blur(8px); flex: 1 1 auto; resize: none; font: inherit; padding: .2em .5em; border-radius: 3px; font-size: 1.1em;"></textarea>
                            <label style="margin-top: 10px; display: flex; align-items: center; gap: 8px;">
                                <input type="checkbox" id="use-standard-words" style="aspect-ratio: 1; width: auto; height: 100%; margin: 0; padding: 0; transition: none; display: grid; place-content: center; background-color: white; color: rgb(44, 44, 44); "> Use/Add standard banned words
                            </label>
                        `;

                    const textarea = popupWindow.document.getElementById("banned-words-input");
                    const standardCheckbox = popupWindow.document.getElementById("use-standard-words");

                    textarea.style.cssText += `
    outline: none;
`;

                    textarea.addEventListener("focus", () => {
                        textarea.style.borderColor = "#56b2fd";
                        textarea.style.boxShadow = "0 0 10px -4px #56b2fd";
                        textarea.style.filter = "none";
                    });

                    textarea.addEventListener("blur", () => {
                        textarea.style.borderColor = "#707070";
                        textarea.style.boxShadow = "none";
                        textarea.style.filter = "blur(8px)";
                    });

                    standardCheckbox.style.cssText += `
                            &:focus {
                                outline: 0;
                                border-color: #56b2fd;
                                box-shadow: 0 0 10px -4px #56b2fd;
                                font-style: normal;
                            }
                        `;

                    textarea.addEventListener("input", () => {
                        bannedWords = textarea.value.split(",").map(word => word.trim().toLowerCase());
                        saveBannedWords();
                    });

                    standardCheckbox.addEventListener("change", () => {
                        bannedWords = bannedWords || [];
                        if (standardCheckbox.checked) {
                            bannedWords = bannedWords.length > 1 ? [...new Set([...bannedWords, ...standardBannedWords])] : [...standardBannedWords];

                        } else {
                            bannedWords = bannedWords.filter(word => !standardBannedWords.includes(word));
                        }
                        saveBannedWords();
                        loadBannedWords();
                        textarea.value = bannedWords.join(", ");
                    });

                    loadBannedWords();
                    textarea.value = bannedWords.join(", ");

                    startPopupMonitor();
                } else {
                    console.error("Failed to create popup window. Please allow popups for this site.");
                }
            }
        }

        function observePlayerBubbles(streamerModeEnabled, bannedWords) {
            const playersContainer = document.querySelector("#game-players > div");

            if (!playersContainer) {
                console.error("Players container not found.");
                return null;
            }

            const observer = new MutationObserver(() => {
                if (!streamerModeEnabled) return;

                const textElements = playersContainer.querySelectorAll(
                    "div.player > div.player-bubble > div.content > div.text"
                );

                textElements.forEach((textElement) => {
                    const text = textElement.textContent || "";

                    console.log("Processing text:", text);

                    if (bannedWords.some((word) => text.includes(word))) {
                        console.log("Banned word found:", text);

                        textElement.style.filter = "blur(8px)";
                        console.log(`Applied blur to element:`, textElement);
                    } else {
                        textElement.style.filter = "none";
                        console.log(`Removed blur from element:`, textElement);
                    }
                });
            });

            observer.observe(playersContainer, {
                childList: true,
                subtree: true,
            });

            return observer;
        }

        function observeChat() {
            const chatContainer = document.querySelector("#game-chat > div.chat-content");
            if (!chatContainer) {
                console.error("Chat content not found.");
                return;
            }

            chatObserver = new MutationObserver(() => {
                const lastMessage = chatContainer.querySelector("p:last-child");

                if (lastMessage) {
                    const targetElements = lastMessage.querySelectorAll("b, span");

                    targetElements.forEach((element) => {
                        const text = element.textContent.trim().toLowerCase();
                        if (streamerModeEnabled && bannedWords.length > 1 && bannedWords.some(word => text.includes(word))) {
                            if (!element.classList.contains("censored")) {
                                element.classList.add("censored");

                                element.style.filter = "blur(4px)";

                                element.addEventListener("mouseover", () => {
                                    if (streamerModeEnabled) {
                                        element.style.filter = "none";
                                    }
                                });

                                element.addEventListener("mouseout", () => {
                                    if (streamerModeEnabled) {
                                        element.style.filter = "blur(4px)";
                                    }
                                });
                            }
                        } else {
                            element.style.filter = "none";
                            element.classList.remove("censored");
                        }
                    });
                }

                const playerNames = document.querySelectorAll("div.player-name");
                playerNames.forEach((playerName) => {
                    const text = playerName.textContent.trim().toLowerCase();
                    if (streamerModeEnabled && bannedWords.length > 1 && bannedWords.some(word => text.includes(word))) {
                        if (!playerName.classList.contains("censored")) {
                            playerName.classList.add("censored");

                            playerName.style.filter = "blur(4px)";

                            playerName.addEventListener("mouseover", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "none";
                                }
                            });

                            playerName.addEventListener("mouseout", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "blur(4px)";
                                }
                            });
                        }
                    } else {
                        playerName.style.filter = "none";
                        playerName.classList.remove("censored");
                    }
                });

                const playerNames2 = document.querySelectorAll("div.name");
                playerNames2.forEach((playerName) => {
                    const text = playerName.textContent.trim().toLowerCase();
                    if (streamerModeEnabled && bannedWords.length > 1 && bannedWords.some(word => text.includes(word))) {
                        if (!playerName.classList.contains("censored")) {
                            playerName.classList.add("censored");

                            playerName.style.filter = "blur(4px)";

                            playerName.addEventListener("mouseover", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "none";
                                }
                            });

                            playerName.addEventListener("mouseout", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "blur(4px)";
                                }
                            });
                        }
                    } else {
                        playerName.style.filter = "none";
                        playerName.classList.remove("censored");
                    }
                });

                const playerNames3 = document.querySelectorAll("div.rank-name");
                playerNames3.forEach((playerName) => {
                    const text = playerName.textContent.trim().toLowerCase();
                    if (streamerModeEnabled && bannedWords.length > 1 && bannedWords.some(word => text.includes(word))) {
                        if (!playerName.classList.contains("censored")) {
                            playerName.classList.add("censored");

                            playerName.style.filter = "blur(4px)";

                            playerName.addEventListener("mouseover", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "none";
                                }
                            });

                            playerName.addEventListener("mouseout", () => {
                                if (streamerModeEnabled) {
                                    playerName.style.filter = "blur(4px)";
                                }
                            });
                        }
                    } else {
                        playerName.style.filter = "none";
                        playerName.classList.remove("censored");
                    }
                });

            });

            chatObserver.observe(chatContainer, {
                childList: true
            });
        }

        function cleanupBlurEffects() {
            const blurredElements = document.querySelectorAll(".censored");
            blurredElements.forEach((element) => {
                element.style.filter = "none";
                element.classList.remove("censored");

                element.onmouseover = null;
                element.onmouseout = null;
            });
        }


        function disconnectChatObserver() {
            if (chatObserver) {
                chatObserver.disconnect();
                chatObserver = null;
            }
        }


        function closeStreamerWindow() {
            if (popupWindow && !popupWindow.closed) {
                popupWindow.close();
            }
            popupWindow = null;
            stopPopupMonitor();
        }

        function updateStreamerWindow(wordsContainer, currentWord) {
            if (popupWindow && !popupWindow.closed) {
                const wordsDiv = popupWindow.document.querySelector("#streamer-words");
                const currentWordDiv = popupWindow.document.querySelector("#streamer-current-word");

                if (wordsDiv) {
                    wordsDiv.innerHTML = "";
                    if (wordsContainer) {
                        const wordElements = wordsContainer.querySelectorAll(".word");
                        wordElements.forEach((wordElement, index) => {
                            const word = wordElement.textContent.trim();
                            const wordBox = document.createElement("div");
                            wordBox.textContent = word;
                            wordBox.style.cssText = `
                                    padding: 8px;
                                    margin: 1em;
                                    border: white solid;
                                    border-radius: 4px;
                                    font-size: 1em;
                                    cursor: pointer;
                                    transition: background 0.3s, color 0.3s;
                                `;
                            wordBox.addEventListener("mouseover", () => {
                                wordBox.style.background = "white";
                                wordBox.style.color = "#35394A";
                            });
                            wordBox.addEventListener("mouseout", () => {
                                wordBox.style.background = "transparent";
                                wordBox.style.color = "white";
                            });
                            wordBox.addEventListener("click", () => {
                                wordElement.click();
                            });
                            wordsDiv.appendChild(wordBox);
                        });
                    } else {
                        wordsDiv.textContent = "No words available.";
                    }
                }

                if (currentWordDiv) {
                    if (currentWord) {
                        const wordLengthString = currentWord.split(/\s/).map(word => word.replace(/-/g, '').length);
                        const wordLength = wordLengthString.join(" ");
                        currentWordDiv.innerHTML = `${currentWord} <sup style="transform: scale(0.7);margin-bottom: 8px;">${wordLength}</sup>`;
                    } else {
                        currentWordDiv.textContent = "No word available.";
                    }
                }
            }
        }

        let popupMonitorInterval = null;

        function startPopupMonitor() {
            if (popupMonitorInterval) return;

            popupMonitorInterval = setInterval(() => {
                if (popupWindow && popupWindow.closed) {
                    toggleStreamerMode();
                }
            }, 500);
        }

        function stopPopupMonitor() {
            if (popupMonitorInterval) {
                clearInterval(popupMonitorInterval);
                popupMonitorInterval = null;
            }
        }

        function observeHints() {
            const hintsContainer = document.querySelector("#game-word > div.hints > div.container");

            if (!hintsContainer) {
                console.error("Could not find hints container.");
                return;
            }

            hintsObserver = new MutationObserver(() => {
                const hints = hintsContainer.querySelectorAll(".hint");

                const allUncovered = Array.from(hints).every(
                    (hint) => hint.classList.contains("uncover")
                );

                if (allUncovered) {
                    const guessedWord = Array.from(hints)
                        .map((hint) =>
                            hint.textContent.trim() === "" && hint.classList.contains("uncover") ?
                            " " :
                            hint.textContent.trim()
                        )
                        .join("");

                    updateStreamerWindow(null, guessedWord);

                    hints.forEach((hint) => {
                        if (hint.classList.contains("uncover") && hint.textContent.trim() !== "") {
                            hint.textContent = "_";
                        }
                    });

                    hintsObserver.disconnect();
                    hintsObserver.observe(hintsContainer, {
                        childList: true,
                        subtree: true
                    });
                }
            });

            hintsObserver.observe(hintsContainer, {
                childList: true,
                subtree: true
            });
        }




        function disconnectObservers() {
            if (observer) {
                observer.disconnect();
            }
            if (hintsObserver) {
                hintsObserver.disconnect();
            }
            observer = null;
            hintsObserver = null;
        }

        function observeWords() {
            const wordsContainer = document.querySelector(wordsContainerSelector);
            const currentWord = document.querySelector(currentWordSelector);

            if (!wordsContainer || !currentWord) {
                console.error("Could not find words container or current word element.");
                return;
            }

            wordsContainer.style.visibility = "hidden";
            currentWord.style.visibility = "hidden";

            observer = new MutationObserver(() => {
                const currentWordText = currentWord.textContent.trim();
                updateStreamerWindow(wordsContainer, currentWordText);
            });

            observer.observe(wordsContainer, {
                childList: true,
                subtree: true
            });
            observer.observe(currentWord, {
                childList: true,
                subtree: true
            });
        }

        let bubblesObserver;

        function toggleStreamerMode() {
            streamerModeEnabled = !streamerModeEnabled;

            if (streamingButton) {
                streamingButton.style.filter = streamerModeEnabled ? "none" : "grayscale(100%)";
            }

            if (streamerModeEnabled) {
                openStreamerWindow();
                observeWords();
                disconnectChatObserver();
                observeHints();
                observeChat();

                bubblesObserver = observePlayerBubbles(streamerModeEnabled, bannedWords);

                console.log("Streamer Mode enabled.");
                addBlurToggleButton();
            } else {
                disconnectObservers();
                closeStreamerWindow();
                cleanupBlurEffects();

                if (bubblesObserver) {
                    bubblesObserver.disconnect();
                    bubblesObserver = null;
                }

                const wordsContainer = document.querySelector(wordsContainerSelector);
                const currentWord = document.querySelector(currentWordSelector);
                if (wordsContainer) wordsContainer.style.visibility = "";
                if (currentWord) currentWord.style.visibility = "";

                console.log("Streamer Mode disabled.");
            }
        }



        let blurButton = null;
        let isBlurred = false;

        function addBlurToggleButton() {
            const gameCanvas = document.querySelector("#game-canvas > canvas");

            if (!gameCanvas) {
                console.error("Canvas element not found.");
                return;
            }

            if (blurButton) {
                console.warn("Blur button already exists.");
                return;
            }

            blurButton = document.createElement('button');
            blurButton.textContent = '';
            blurButton.className = 'blurButton';
            blurButton.style.cssText = `
        z-index: 1000;
        width: 48px;
        height: 48px;
        background-image: url('https://imgur.com/lGaaS9h.gif');
        cursor: pointer;
        filter: drop-shadow(3px 3px 0 rgba(0, 0, 0, .3));
        background-color: transparent;
        background-size: contain;
        background-repeat: no-repeat;
        position: absolute;
        opacity: 0.6;
        transition: opacity .15s ease, transform .15s ease;
        top: 4px;
        left: 4px;
    `;

            const style = document.createElement('style');
            style.textContent = `
        .blurButton:hover {
            opacity: 1 !important;
            transform: scale(1.1);
        }
    `;
            document.head.appendChild(style);

            const gameCanvasContainer = document.querySelector("#game-canvas");
            if (gameCanvasContainer) {
                gameCanvasContainer.style.position = "relative";
                gameCanvasContainer.appendChild(blurButton);
            } else {
                console.error("Game canvas container not found.");
                return;
            }

            blurButton.addEventListener("click", () => {
                isBlurred = !isBlurred;
                gameCanvas.style.filter = isBlurred ? "blur(50px)" : "none";
            });
        }




        streamingButton.addEventListener('click', toggleStreamerMode);
    })();