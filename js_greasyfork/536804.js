// ==UserScript==
// @name         Quizlet Live HACK MOD MENU 2025
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  A hack for Quizlet Live updated on April 2025! - Dark UI Theme with Background Image - UI loads instantly. Now with working cheat logic.
// @author       Dark Shadow
// @match        https://quizlet.com/live/*
// @match        https://quizlet.com/live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/536804/Quizlet%20Live%20HACK%20MOD%20MENU%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/536804/Quizlet%20Live%20HACK%20MOD%20MENU%202025.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration & State ---
    var UIVersion = '2.3'; // Version der UI-Design von Script 2
    var LogicVersion = '1.0.7'; // Version der Kernlogik von Script 1

    var autoAnswer = false;
    var showAnswers = false;
    var pairs = [];
    var lastAnswer = ""; // Wird von der Logik aus Script 1 verwendet
    var POLLING_INTERVAL_MS = 100; // Beibehalten von Script 2, 1ms von Script 1 ist zu aggressiv

    // --- UI Creation (Compact & Revised Animation) - AUS SCRIPT 2 ---
    function createUI() {
        if (document.querySelector('.ql-hack-main-ui')) {
            console.warn("[QuizletHack] UI already exists.");
            return;
        }

        const uiElement = document.createElement('div');
        uiElement.className = 'ql-hack-main-ui';
        uiElement.style.position = 'fixed';
        uiElement.style.top = '20px';
        uiElement.style.left = '20px';
        uiElement.style.width = '260px';
        uiElement.style.backgroundImage = 'url("https://c4.wallpaperflare.com/wallpaper/945/873/190/dark-black-shadows-mysterious-wallpaper-preview.jpg")';
        uiElement.style.backgroundSize = 'cover';
        uiElement.style.backgroundPosition = 'center center';
        uiElement.style.backgroundRepeat = 'no-repeat';
        uiElement.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        uiElement.style.borderRadius = '8px';
        uiElement.style.boxShadow = '0px 3px 10px rgba(0, 0, 0, 0.6)';
        uiElement.style.zIndex = '9999';
        uiElement.style.overflow = 'hidden';
        uiElement.style.fontFamily = 'Arial, sans-serif';
        uiElement.style.color = 'white';
        uiElement.style.backdropFilter = 'blur(3px)';

        const handle = document.createElement('div');
        handle.className = 'ql-hack-handle';
        handle.style.fontSize = '14px';
        handle.textContent = 'Quizlet Utils';
        handle.style.color = 'white';
        handle.style.width = '100%';
        handle.style.boxSizing = 'border-box';
        handle.style.height = '30px';
        handle.style.backgroundColor = '#111111';
        handle.style.cursor = 'grab';
        handle.style.textAlign = 'center';
        handle.style.lineHeight = '30px';
        handle.style.position = 'relative';
        handle.style.borderTopLeftRadius = '8px';
        handle.style.borderTopRightRadius = '8px';
        handle.style.transition = 'border-radius 0.3s ease-in-out';
        uiElement.appendChild(handle);

        const createButton = (text, bgColor, rightPos, clickHandler) => {
            const button = document.createElement('div');
            button.textContent = text;
            button.style.position = 'absolute';
            button.style.top = '0';
            button.style.right = rightPos;
            button.style.width = '30px';
            button.style.height = '100%';
            button.style.backgroundColor = bgColor;
            button.style.color = 'white';
            button.style.display = 'flex';
            button.style.justifyContent = 'center';
            button.style.alignItems = 'center';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.addEventListener('click', clickHandler);
            handle.appendChild(button);
            return button;
        };

        const closeButton = createButton('✕', '#444444', '0px', () => {
            if (uiElement && uiElement.parentNode) uiElement.parentNode.removeChild(uiElement);
            autoAnswer = false; showAnswers = false;
        });
        closeButton.style.borderTopRightRadius = '8px';

        const minimizeButton = createButton('─', '#444444', '30px', () => {
            toggleMinimize();
        });

        const contentContainer = document.createElement('div');
        contentContainer.className = 'ql-hack-content';
        uiElement.appendChild(contentContainer);

        const header3 = document.createElement('h2');
        header3.textContent = 'Answering';
        header3.style.marginTop = '0px'; header3.style.marginBottom = '10px';
        header3.style.textAlign = 'center'; header3.style.fontSize = '16px';
        header3.style.color = 'white';
        header3.style.fontWeight = 'bold';
        contentContainer.appendChild(header3);

        const createSwitch = (labelText, onChangeCallback) => {
            const container = document.createElement('div');
            container.style.display = 'flex'; container.style.alignItems = 'center';
            container.style.justifyContent = 'space-between'; container.style.marginBottom = '12px';
            const label = document.createElement('span');
            label.textContent = labelText; label.style.fontSize = '13px'; label.style.color = 'white';
            container.appendChild(label);
            const switchLabel = document.createElement('label'); switchLabel.className = 'ql-hack-switch';
            container.appendChild(switchLabel);
            const input = document.createElement('input'); input.type = 'checkbox';
            input.addEventListener('change', function() { onChangeCallback(this.checked); });
            switchLabel.appendChild(input);
            const slider = document.createElement('span'); slider.className = 'ql-hack-slider';
            switchLabel.appendChild(slider);
            return { container, input };
        };
        contentContainer.appendChild(createSwitch('Auto Answer', checked => { autoAnswer = checked; console.log(`[QuizletHack] Auto Answer ${autoAnswer ? 'Enabled' : 'Disabled'}`); }).container);
        contentContainer.appendChild(createSwitch('Show Answers', checked => { showAnswers = checked; console.log(`[QuizletHack] Show Answers ${showAnswers ? 'Enabled' : 'Disabled'}`); if (!showAnswers) clearDynamicAnswerStyles(); }).container);

        const versionLabel = document.createElement('p');
        versionLabel.textContent = `UI: v${UIVersion} / Logic: v${LogicVersion}`; // Zeigt beide Versionen
        versionLabel.style.fontSize = '10px'; versionLabel.style.textAlign = 'center';
        versionLabel.style.marginTop = '10px'; versionLabel.style.marginBottom = '5px';
        versionLabel.style.opacity = '0.7';
        contentContainer.appendChild(versionLabel);

        const githubContainer = document.createElement('div');
        githubContainer.style.textAlign = 'center'; githubContainer.style.fontSize = '10px';
        githubContainer.style.opacity = '0.9'; githubContainer.style.marginBottom = '5px';
        const githubLink = (user, role) => `<a href="https://github.com/${user}" target="_blank" style="color: white; text-decoration: underline;">${user} (${role})</a>`;
        githubContainer.innerHTML = `Credits: ${githubLink('Dark Shadow', 'UI')} & ${githubLink('Dark Shadow', 'Logic')}`; // Angepasste Credits
        contentContainer.appendChild(githubContainer);

        if (!document.getElementById('quizlet-hack-styles')) {
            const style = document.createElement('style');
            style.id = 'quizlet-hack-styles';
            style.textContent = `
                .ql-hack-main-ui a:hover { text-decoration: none; }
                .ql-hack-content { max-height: 300px; opacity: 1; overflow: hidden; padding: 10px 15px; transition: max-height 0.35s ease-in-out, opacity 0.3s ease-in-out, padding 0.3s ease-in-out; box-sizing: border-box; background-color: transparent; }
                .ql-hack-main-ui.minimized .ql-hack-content { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; }
                .ql-hack-main-ui.minimized .ql-hack-handle { border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                .ql-hack-switch { position: relative; display: inline-block; width: 40px; height: 22px; vertical-align: middle; }
                .ql-hack-switch input { opacity: 0; width: 0; height: 0; }
                .ql-hack-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #555555; transition: .3s; border-radius: 22px; }
                .ql-hack-slider:before { position: absolute; content: ""; height: 16px; width: 16px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.2); }
                input:checked + .ql-hack-slider { background-color: #00C853; } /* Changed to a green color */
                input:focus + .ql-hack-slider { box-shadow: 0 0 2px #BBBBBB; }
                input:checked + .ql-hack-slider:before { transform: translateX(18px); background-color: #FFFFFF; } /* Knob white when ON */
            `;
            document.head.appendChild(style);
        }

        let isMinimized = false;
        const toggleMinimize = () => {
             isMinimized = !isMinimized;
             if (isMinimized) {
                 uiElement.classList.add('minimized');
                 minimizeButton.textContent = '□';
             } else {
                 uiElement.classList.remove('minimized');
                 minimizeButton.textContent = '─';
             }
             console.log(`[QuizletHack] UI ${isMinimized ? 'Minimized' : 'Restored'}`);
        };

        let isDragging = false; let offsetX, offsetY;
        handle.addEventListener('mousedown', (e) => {
            if (e.target === closeButton || e.target === minimizeButton) {
                isDragging = false; return;
            }
            isDragging = true;
            offsetX = e.clientX - uiElement.getBoundingClientRect().left;
            offsetY = e.clientY - uiElement.getBoundingClientRect().top;
            handle.style.cursor = 'grabbing';
            uiElement.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', (e) => {
             if (isDragging) {
                 let newX = e.clientX - offsetX;
                 let newY = e.clientY - offsetY;
                 const maxX = window.innerWidth - uiElement.offsetWidth;
                 const maxY = window.innerHeight - uiElement.offsetHeight;
                 newX = Math.max(0, Math.min(newX, maxX));
                 newY = Math.max(0, Math.min(newY, maxY));
                 uiElement.style.left = newX + 'px';
                 uiElement.style.top = newY + 'px';
             }
        });
        document.addEventListener('mouseup', () => {
             if (isDragging) {
                 isDragging = false;
                 handle.style.cursor = 'grab';
                 uiElement.style.removeProperty('user-select');
             }
        });

        if (document.body) {
            document.body.appendChild(uiElement);
            console.log("[QuizletHack] UI Created with Background Image.");
        } else {
            console.error("[QuizletHack] document.body not found when trying to append UI.");
        }
    } // End of createUI

    // --- Core Logic Functions (AUS SCRIPT 1, angepasst) ---
    // Selektoren für Quizlet-Elemente
    const SELECTOR_QUESTION_TEXT = ".FormattedText"; // Für den Fragetext
    const SELECTOR_ANSWER_OPTIONS = ".a1w6enf9";   // Für die Antwortmöglichkeiten
                                                   // HINWEIS: Diese Klassennamen können sich ändern, wenn Quizlet seine Seite aktualisiert.

    function getPair(str) {
        // Direkt aus Script 1 übernommen
        let result = undefined;
        if (!str || !Array.isArray(pairs)) return undefined;
        pairs.forEach(function(pair) {
            if (Array.isArray(pair) && pair.length >= 2) {
                if (pair[0] === str) {
                    result = pair[1];
                }
                if (pair[1] === str) {
                    result = pair[0];
                }
            }
        });
        return result;
    }

    function findCorrectAnswerDetails() {
        // Kombiniert Logik aus Script 1's getAnswerIndex und Script 2's findCorrectAnswerIndex
        let resultIdx = undefined;
        let correctAnswerText = undefined;
        const questionElement = document.querySelector(SELECTOR_QUESTION_TEXT);

        if (!questionElement || !questionElement.textContent) {
            // console.warn("[QuizletHack] Question element not found.");
            return { index: undefined, text: undefined };
        }

        const questionText = questionElement.textContent;
        correctAnswerText = getPair(questionText);

        if (correctAnswerText === undefined && pairs.length > 0) {
            // console.warn(`[QuizletHack] Could not find pair for question: "${questionText}". Pairs might be stale or question format changed.`);
            // Script 1 hatte hier: location.reload(); pairs = []; was aggressiv ist.
            // Wir geben einfach undefined zurück, der mainLoop wird es handhaben.
            return { index: undefined, text: undefined };
        }

        const answerElements = document.querySelectorAll(SELECTOR_ANSWER_OPTIONS);
        if (answerElements && answerElements.length > 0) {
            answerElements.forEach(function(elem, idx) {
                if (elem && elem.textContent && elem.textContent === correctAnswerText) {
                    resultIdx = idx;
                }
            });
        } else {
            // console.warn("[QuizletHack] Answer option elements not found.");
        }
        return { index: resultIdx, text: correctAnswerText };
    }

    function clickAnswer(index) {
        // Aus Script 1 (answerQuestion), umbenannt für Klarheit
        if (typeof index !== 'number' || index < 0) return false;
        try {
            const answerElements = document.querySelectorAll(SELECTOR_ANSWER_OPTIONS);
            if (answerElements && answerElements.length > index && answerElements[index]) {
                answerElements[index].click();
                return true;
            } else {
                // console.warn("[QuizletHack] Could not find answer element at index", index, "to click.");
                return false;
            }
        } catch (e) {
            console.error("[QuizletHack] Error clicking answer at index", index, ":", e);
            return false;
        }
    }

    function highlightCorrectAnswer(correctIndex) {
        // Aus Script 1 (highlight), umbenannt für Klarheit
        if (typeof correctIndex !== 'number' || correctIndex < 0) return;
        try {
            const answerElements = document.querySelectorAll(SELECTOR_ANSWER_OPTIONS);
            if (answerElements && answerElements.length > 0) {
                answerElements.forEach(function(elem, idx) {
                    if (elem && elem.style) {
                        if (idx === correctIndex) {
                            elem.style.color = 'rgb(152, 241, 209)'; // Hellgrün für richtig
                            elem.style.fontWeight = 'bold';
                            elem.style.opacity = '1';
                        } else {
                            elem.style.color = 'rgb(218, 69, 67)'; // Rot für falsch
                            elem.style.fontWeight = 'normal';
                            elem.style.opacity = '0.7'; // Etwas gedämpft
                        }
                    }
                });
            }
        } catch (e) {
            console.error("[QuizletHack] Error applying highlight styles:", e);
        }
    }

    function clearDynamicAnswerStyles() {
        // Beibehaltung der Funktion aus Skript 2, da sie gut ist
        try {
            document.querySelectorAll(SELECTOR_ANSWER_OPTIONS).forEach(function(elem) {
                if (elem && elem.style) {
                    elem.style.color = '';
                    elem.style.fontWeight = '';
                    elem.style.opacity = '';
                }
            });
        } catch (e) {
            // console.warn("[QuizletHack] Minor error clearing answer styles:", e);
        }
    }

    // --- XHR Interception (AUS SCRIPT 1) ---
    if (!XMLHttpRequest.prototype._quizletHackIntercepted_v1_logic) { // Eindeutiger Flag-Name
        const originalXhrOpen = XMLHttpRequest.prototype.open;
        const originalXhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._interceptedUrl = url;
            try {
                return originalXhrOpen.call(this, method, url, ...rest);
            } catch (e) {
                console.error("[QuizletHack] Error in XHR open interceptor:", e);
                throw e;
            }
        };

        XMLHttpRequest.prototype.send = function (...args) {
            try {
                this.addEventListener('load', function () {
                    if (this.responseText && typeof this.responseText === 'string') {
                        let text = this.responseText;
                        let index = text.indexOf("42["); // Charakteristischer Prefix für Quizlet Live Daten via Socket.IO
                        if (index !== -1) {
                            try {
                                // Die JSON-Struktur beginnt nach "42["
                                // Es ist ein Array, wobei das zweite Element ([1]) die relevanten Daten enthält
                                let jsonDataString = text.substring(index + 2); // Entfernt "42"
                                // Manchmal sind mehrere Nachrichten konkateniert, wir versuchen, nur die erste zu parsen
                                // oder eine, die "cards" enthält
                                let parsedOuterArray;
                                try {
                                     // Versuche, das äußere Array zu parsen
                                     // Oft ist die Struktur 42["event", payload]
                                     // Wir müssen das erste vollständige JSON-Array extrahieren
                                     let bracketCount = 0;
                                     let jsonEndIndex = 0;
                                     for(let k=0; k < jsonDataString.length; k++) {
                                         if(jsonDataString[k] === '[') bracketCount++;
                                         if(jsonDataString[k] === ']') bracketCount--;
                                         if(bracketCount === 0 && jsonDataString[k] === ']') {
                                             jsonEndIndex = k;
                                             break;
                                         }
                                     }
                                     if (jsonEndIndex > 0) {
                                         parsedOuterArray = JSON.parse(jsonDataString.substring(0, jsonEndIndex + 1));
                                     } else {
                                         // Fallback, wenn die obige Logik fehlschlägt (z.B. bei komplexeren oder verketteten Nachrichten)
                                         // Dieser Teil ist weniger robust
                                         parsedOuterArray = JSON.parse(jsonDataString.match(/^(\[.*?\])/)[0]);
                                     }

                                } catch (e) {
                                     // console.warn("[QuizletHack] Could not parse initial JSON array structure from XHR.", e, "Data snippet:", jsonDataString.substring(0,200));
                                     return;
                                }


                                if (Array.isArray(parsedOuterArray) && parsedOuterArray.length > 1 &&
                                    parsedOuterArray[1] && typeof parsedOuterArray[1] === 'object' &&
                                    Array.isArray(parsedOuterArray[1].cards)) {

                                    let cards = parsedOuterArray[1].cards;
                                    let extractedPairs = cards.map(function (card){
                                        // Sicherheitsüberprüfungen für die verschachtelten Eigenschaften
                                        const termSide = card.cardSides && card.cardSides[0] && card.cardSides[0].media && card.cardSides[0].media[0];
                                        const definitionSide = card.cardSides && card.cardSides[1] && card.cardSides[1].media && card.cardSides[1].media[0];

                                        if (termSide && termSide.plainText && definitionSide && definitionSide.plainText) {
                                            return [termSide.plainText, definitionSide.plainText];
                                        }
                                        // console.warn("[QuizletHack] Card with incomplete data found:", card);
                                        return null; // Ungültige Karte
                                    }).filter(pair => pair !== null); // Entferne ungültige Karten

                                    if (extractedPairs.length > 0) {
                                        pairs = extractedPairs;
                                        console.log("[QuizletHack] Extracted " + pairs.length + " pairs:", pairs);
                                        lastAnswer = ""; // Wichtig: lastAnswer zurücksetzen, wenn neue Paare geladen werden
                                    } else {
                                       // console.warn("[QuizletHack] Parsed data, but found no valid pairs in cards array.");
                                    }
                                } else {
                                   // console.log("[QuizletHack] Intercepted XHR, but not the game data structure we expected. Data:", parsedOuterArray);
                                }
                            } catch (e) {
                                // console.warn("[QuizletHack] Error parsing intercepted JSON data. This might be okay for non-game data.", e, "Data snippet:", text.substring(index, index + 200));
                            }
                        }
                    }
                });
            } catch (e) {
                console.error("[QuizletHack] Error adding 'load' listener to XHR:", e);
            }

            try {
                return originalXhrSend.call(this, ...args);
            } catch (e) {
                console.error("[QuizletHack] Error in XHR send interceptor:", e);
                throw e;
            }
        };
        XMLHttpRequest.prototype._quizletHackIntercepted_v1_logic = true; // Setze den Flag
        console.log("[QuizletHack] XHR interception (v1 logic) active.");
    }


    // --- Main Loop (Struktur von Script 2, Logik-Aufrufe angepasst) ---
    function mainGameLoop() {
        try {
            const SELECTOR_END_VIEW = ".StudentEndView"; // Klasse, die das Spielende anzeigt

            if (document.querySelector(SELECTOR_END_VIEW)) {
                if (lastAnswer !== "") { // Nur zurücksetzen, wenn es einen Wert hatte
                    lastAnswer = "";
                    console.log("[QuizletHack] Game ended, lastAnswer reset.");
                }
                if (showAnswers) clearDynamicAnswerStyles();
                return; // Verarbeitung stoppen, wenn das Spiel vorbei ist
            }

            if (pairs.length === 0) {
                // console.log("[QuizletHack] Waiting for pairs data..."); // Optional für Debugging
                return;
            }

            const questionElement = document.querySelector(SELECTOR_QUESTION_TEXT);
            if (!questionElement) { // Wenn kein Frageelement gefunden wird
                if (showAnswers) clearDynamicAnswerStyles(); // Stile entfernen, wenn keine Frage da ist
                return;
            }

            const { index: correctAnswerIndex, text: currentCorrectAnswerText } = findCorrectAnswerDetails();

            if (correctAnswerIndex !== undefined && currentCorrectAnswerText !== undefined) {
                // Auto Answer Logik
                if (autoAnswer && lastAnswer !== currentCorrectAnswerText) { // Verhindert erneutes Klicken auf dieselbe Antwort
                    if (clickAnswer(correctAnswerIndex)) {
                        lastAnswer = currentCorrectAnswerText; // Merke dir die zuletzt beantwortete Frage
                        // console.log("[QuizletHack] Auto-answered:", currentCorrectAnswerText);
                    }
                }
                // Show Answers Logik
                if (showAnswers) {
                    highlightCorrectAnswer(correctAnswerIndex);
                } else {
                    clearDynamicAnswerStyles(); // Sicherstellen, dass Stile entfernt werden, wenn "Show Answers" deaktiviert ist
                }
            } else {
                // Wenn keine korrekte Antwort gefunden wurde (z.B. zwischen Fragen oder Fehler bei der Paarsuche)
                if (showAnswers) {
                    clearDynamicAnswerStyles();
                }
                // Wenn correctAnswerText undefined ist, aber eine Frage da ist, und pairs existieren,
                // könnte das ein Hinweis auf ein Problem sein (z.B. eine neue Frage, die nicht in den `pairs` ist).
                // Die Logik in `findCorrectAnswerDetails` versucht, dies bereits abzufangen.
            }
        } catch (e) {
            console.error("[QuizletHack] Error in main game loop:", e);
            // Optional: Intervall stoppen bei wiederholten Fehlern
            // clearInterval(mainIntervalId);
        }
    }

    // --- Initialization ---
    createUI();
    var mainIntervalId = setInterval(mainGameLoop, POLLING_INTERVAL_MS);
    console.log(`[QuizletHack] Initialized. UI v${UIVersion}, Logic v${LogicVersion}. Main loop running every ${POLLING_INTERVAL_MS}ms.`);

})(); // End of IIFE