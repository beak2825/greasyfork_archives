// ==UserScript==
// @name         Canvas Quiz Answer Identifier (Subtle Shadow + Edge Hover)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Stealthily highlights correct Canvas quiz answers with a faint right-edge shadow on hover only. Won’t steal focus or trigger LMS cursor alerts. API-based & unobtrusive UX by design. Fully self-contained & auto-loaded on quiz pages only.
// @author       You
// @match        *://*.instructure.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534749/Canvas%20Quiz%20Answer%20Identifier%20%28Subtle%20Shadow%20%2B%20Edge%20Hover%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534749/Canvas%20Quiz%20Answer%20Identifier%20%28Subtle%20Shadow%20%2B%20Edge%20Hover%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        const texts = document.getElementsByClassName("text");

        if (!texts.length) return;

        let questions = [];
        let optionsList = [];

        // Step 1: Extract questions and options
        for (let i = 0; i < texts.length; i++) {
            const questionDiv = texts[i].querySelector("div:nth-of-type(2)");
            const questionText = questionDiv?.innerText?.trim() || "";

            const optionLabels = texts[i].getElementsByClassName("answer_label");
            let optionsText = [];
            for (let j = 0; j < optionLabels.length; j++) {
                optionsText.push(optionLabels[j].innerText.trim());
            }

            questions.push(questionText);
            optionsList.push(optionsText);
        }

        // Step 2: Send questions to the API and get answers
        for (let i = 0; i < questions.length; i++) {
            const payload = {
                id: i,
                question: questions[i],
                options: optionsList[i].join(", "),
            };

            fetch("https://canvasquiz-new.uc.r.appspot.com/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })
                .then((res) => {
                    if (!res.ok) throw new Error("Network response error");
                    return res.json();
                })
                .then((data) => {
                    const correctAnswer = data.answer?.trim();
                    if (!correctAnswer) return;

                    const answerLabels = texts[i].getElementsByClassName("answer_label");
                    for (let j = 0; j < answerLabels.length; j++) {
                        const label = answerLabels[j];
                        const labelText = label.innerText.trim();

                        if (labelText === correctAnswer) {
                            label.style.position = "relative";

                            label.addEventListener("mouseenter", () => {
                                let shadowMarker = document.createElement("div");
                                shadowMarker.className = "hover-shadow-marker";
                                shadowMarker.style.position = "absolute";
                                shadowMarker.style.top = "50%";
                                shadowMarker.style.left = "100%"; // outside the label
                                shadowMarker.style.transform = "translateY(-50%) translateX(2px)";
                                shadowMarker.style.width = "8px";
                                shadowMarker.style.height = "20px";
                                shadowMarker.style.boxShadow = "0 0 6px rgba(0, 0, 0, 0.1)";
                                shadowMarker.style.borderRadius = "3px";
                                shadowMarker.style.pointerEvents = "none"; // don't interfere
                                label.appendChild(shadowMarker);
                            });

                            label.addEventListener("mouseleave", () => {
                                const marker = label.querySelector(".hover-shadow-marker");
                                if (marker) marker.remove();
                            });
                        }
                    }
                })
                .catch((err) => {
                    console.warn("Answer API error:", err);
                });
        }
    });
})();
