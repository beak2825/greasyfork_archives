//
// Copyright © 2023 adithyagenie
//
// SPDX-License-Identifier: AGPL-3.0-or-later
//

// ==UserScript==
// @name         Skillrack Captcha Solver
// @namespace    https://github.com/adithyagenie/skillrack-captcha-solver
// @version      0.7
// @description  Solves math captcha in SkillRack using Tesseract.js
// @author       adithyagenie
// @license      AGPL-3.0-or-later
// @include      /https:\/\/(www\.)?skillrack\.com\/faces\/candidate\/(codeprogram|tutorprogram|codeprogramgroup)\.xhtml/
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@6.0.1/dist/tesseract.min.js
// @downloadURL https://update.greasyfork.org/scripts/476420/Skillrack%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/476420/Skillrack%20Captcha%20Solver.meta.js
// ==/UserScript==

const USERNAME = "";
const TUTOR =
  /https:\/\/(www.)?skillrack\.com\/faces\/candidate\/tutorprogram\.xhtml/gi;
const ERROR = "ui-growl-item";
const TUTOR_IMG = "j_id_5s";
const NON_TUTOR_IMG = "j_id_76";
const BACK_BTN = "j_id_63";
const CAPTCHA_ID = "capval";
const PROCEED_BTN_ID = "proceedbtn";

(function () {
	"use strict";

	// Invert colours for better ocr
    function invertColors(image) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);
        ctx.globalCompositeOperation = "difference";
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        return canvas.toDataURL();
    }

	// Remove username from captcha
    function solveCaptcha(text) {
        const cleanedText = text.replace(new RegExp(USERNAME, "gi"), "").trim();
        const match = cleanedText.match(/(\d+)\s*\+\s*(\d+)/);
        if (match) {
            return parseInt(match[1], 10) + parseInt(match[2], 10);
        }
        else {
            handleIncorrrectCaptcha();
            return -1;
        }
    }

    function handleCaptcha() {
        // Get the captcha
        const captchaImageId = window.location.href.includes("tutorprogram") ? TUTOR_IMG : NON_TUTOR_IMG;
        const image = document.getElementById(captchaImageId);
        const textbox = document.getElementById(CAPTCHA_ID);
        const button = document.getElementById(PROCEED_BTN_ID);
        if (!image || !textbox || !button) {
            console.log("Captcha or input elements not found.");
            return;
        }

        const invertedimg = invertColors(image);
		// Image Processing with Tesseract.js
		Tesseract.recognize(invertedimg, "eng", {
			whitelist: "1234567890+=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@ ",
			psm: 6,
		})
			.then(({ data: { text } }) => {
				console.log(`OCR: Result: ${text}`);
				// Solve the Math Problem
                const result = solveCaptcha(text);
                if (result == -1) return;
                else if (result === null) {
                    alert(`Unable to solve math captcha...`)
                    return;
                }
                textbox.value = result;
                // Click the submit button
                button.click();
				return;
			})
			.catch((error) => {
				alert("Error processing captcha:", error);
			});
	}
	function handleIncorrrectCaptcha() {
        // If in tutorial pages, can't go back.
        if (
            window.location.href.match(TUTOR)
        ) {
            alert("Unable to solve captcha :(");
            let captext = prompt("Captcha:");
            if (captext == null) return;
            const result = solveCaptcha(captext);
            const textbox = document.getElementById(CAPTCHA_ID);
            const button = document.getElementById(PROCEED_BTN_ID);
            textbox.value = result;
            button.click();
            return;
        }
        sessionStorage.setItem("captchaFail", "true");
        document.getElementById(BACK_BTN)?.click();

        return;
	}

	document.addEventListener("click", (event) => {
        if (
			event.target.tagName === "SPAN" && event.target.parentNode.tagName === "BUTTON" && event.target.textContent === "Solve"
		) {
            // Store button id of problem solve button.
            sessionStorage.setItem("Solvebtnid", event.target.parentNode.id);
		}
	}, false);

	// Wait for window to load
	window.addEventListener("load", function () {
		// Detect if last captcha attempt was a fail to re-nav back
		if (sessionStorage.getItem("captchaFail")) {
			// Reset captcha state
			sessionStorage.removeItem("captchaFail");
			// Get old button id
			const old = sessionStorage.getItem("Solvebtnid");
			if (old) {
				const oldbutt = document.getElementById(old);
				oldbutt?.click();
			}
			return;
		}

		const errors = document.getElementsByClassName(ERROR);
		if (errors.length > 0 && errors[0].textContent.includes("Incorrect Captcha")) {
            handleIncorrrectCaptcha();
		}
		handleCaptcha();
	});
})();
