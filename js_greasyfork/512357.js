// ==UserScript==
// @name         SkillRack Math Captcha Solver
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Solves Math Captcha on the SkillRack website using Tesseract.js.
// @author       Bit-Blazer
// @license      GNU GPLv3
// @match        https://www.skillrack.com/faces/candidate/codeprogram.xhtml
// @match        https://www.skillrack.com/faces/candidate/tutorprogram.xhtml
// @icon         https://envs.sh/GiG.png
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512689/SkillRack%20Math%20Captcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/512689/SkillRack%20Math%20Captcha%20Solver.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Define the IDs of the captcha input field, and proceed button
  const CAPTCHA_INPUT = "capval";
  const PROCEED_BTN = "proceedbtn";

  console.log("[Captcha Solver] Script initialized.");

  /**
   * Inverts the colors of the Captcha Image for better OCR results.
   * This is useful for enhancing the text recognition capability of Tesseract.js.
   * @param {HTMLImageElement} image - The image to be inverted.
   * @returns {string} - Base64 encoded data URL of the inverted image.
   */
  function invertColors(image) {
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      ctx.globalCompositeOperation = "difference"; // Invert colors
      ctx.fillStyle = "white"; // Set background to white
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas
      console.log("[Captcha Solver] Image colors inverted successfully.");
      return canvas.toDataURL(); // Return the inverted image as a data URL
    } catch (error) {
      console.error("[Captcha Solver] Error inverting colors:", error);
      throw new Error("Image processing failed.");
    }
  }

  /**
   * Extracts the username from the span element.
   * This function looks for the username pattern in the badge label.
   * @returns {string} - The extracted username or an empty string if not found.
   */
  function getUsername() {
    const usernameElement = document.querySelector(".ui-chip-text"); // Select the username element
    const match = usernameElement.textContent.match(/(\d{12}@\w{3})/); // Match the username pattern
    const username = match ? match[0] : ""; // Return the matched username or empty string
    console.log("[Captcha Solver] Extracted username:", username);
    return username;
  }

  /**
   * Solves the captcha by extracting numbers and performing the calculation.
   * @param {string} text - The OCR result from the captcha image.
   * @param {string} username - The username to be removed from the OCR text.
   * @returns {number|null} - The result of the addition or null if not found.
   */
  function solveCaptcha(text, username) {
    try {
      // Remove the username from the OCR text and trim whitespace
      const cleanedText = text.replace(new RegExp(username, "gi"), "").trim();
      // Match the addition pattern in the cleaned text
      const match = cleanedText.match(/(\d+)\s*\+\s*(\d+)/);
      // Return the sum of the two numbers if a match is found

      if (!match) {
        console.warn(
          "[Captcha Solver] No valid captcha pattern found in OCR text:",
          text
        );
        return null;
      }
      const result = parseInt(match[1], 10) + parseInt(match[2], 10);
      console.log(
        "[Captcha Solver] Captcha solved:",
        `${match[1]} + ${match[2]} = ${result}`
      );
      return result;
    } catch (error) {
      console.error("[Captcha Solver] Error solving captcha:", error);
      return null;
    }
  }

  /**
   * Handles the captcha-solving process.
   * This function orchestrates the overall captcha solving by coordinating image processing and user interactions.
   */
  async function handleCaptcha() {
    // Get the captcha elements from the DOM
    console.log("[Captcha Solver] Handling captcha...");

    try {
      const captchaImage = document.querySelector("img[src*='data:image']");
      const captchaInput = document.getElementById(CAPTCHA_INPUT);
      const proceedBtn = document.getElementById(PROCEED_BTN);

      // Log an error and exit if any elements are not found
      if (!captchaImage) throw new Error("Captcha image not found.");
      if (!captchaInput) throw new Error("Captcha input field not found.");
      if (!proceedBtn) throw new Error("Proceed button not found.");

      // Get the username from the UI
      const username = getUsername();
      // Invert the colors of the captcha image for better OCR processing
      const invertedImg = invertColors(captchaImage);

      // Process the inverted image using Tesseract.js for OCR
      const {
        data: { text },
      } = await Tesseract.recognize(invertedImg, "eng", {
        whitelist:
          "1234567890+=abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@ ", // Allowed characters
        psm: 6, // Page segmentation mode
      });

      console.log("[Captcha Solver] OCR text extracted:", text);

      // Solve the Captcha using the OCR text and username
      const result = solveCaptcha(text, username);
      // Notify if the captcha could not be solved
      if (result === null) {
        console.warn("[Captcha Solver] Unable to solve captcha.");
        return;
      }

      // Fill the captcha input with the calculated result
      captchaInput.value = result;
      // Click the submit button to proceed

      console.log("[Captcha Solver] Filled captcha input with result:", result);

      proceedBtn.click();
      console.log("[Captcha Solver] Proceed button clicked.");
    } catch (error) {
      // Log any errors encountered during the OCR process

      console.error("[Captcha Solver] Error handling captcha:", error);
    }
  }

  /**
   * Checks if the required elements are available and triggers captcha solving.
   */
  function monitorElements() {
    console.log("Finding Elements....");
    const interval = setInterval(() => {
      const captchaImage = document.querySelector("img[src*='data:image']");
      const captchaInput = document.getElementById(CAPTCHA_INPUT);
      const proceedBtn = document.getElementById(PROCEED_BTN);

      if (captchaImage && captchaInput && proceedBtn) {
        console.log(
          "[Captcha Solver] Required elements found. Starting captcha solver."
        );
        clearInterval(interval);
        handleCaptcha();
      }
    }, 500); // Check every 500ms
  }

  monitorElements(); // Start looking for elements here
})();
