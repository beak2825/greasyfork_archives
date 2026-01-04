// ==UserScript==
// @name         Ovipets Credit Bot (with many other ovipets hack/cheat options)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple polling-based bot
// @match        *://*.ovipets.com/*
// @grant        GM_xmlhttpRequest
// @connect      127.0.0.1
// @connect      localhost
// @connect      im*.ovipets.com
// @connect      ovipets.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539228/Ovipets%20Credit%20Bot%20%28with%20many%20other%20ovipets%20hackcheat%20options%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539228/Ovipets%20Credit%20Bot%20%28with%20many%20other%20ovipets%20hackcheat%20options%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const API_BASE = "http://127.0.0.1:8000";
  const RUN_KEY = "ovipets_bot_running";
  const CLASS_NAMES_EVIL = [
    "Canis",
    "Draconis",
    "Equus",
    "Feline",
    "Gekko",
    "Lupus",
    "Mantis",
    "Raptor",
    "Slime",
    "Vulpes",
  ];
  const CLASS_NAMES = ["Turn Egg"];

  let pollInterval = null;
  let eggQueue = [];
  let isProcessing = false;
  let isPuzzleSolving = false;
  let isEvil = false;
  let isPeaceful = false;
  let accum = 0;
  function saveState() {
    // Save important state before reload
    sessionStorage.setItem("ovipets_bot_evil_mode", JSON.stringify(isEvil));
    sessionStorage.setItem(
      "ovipets_bot_peaceful_mode",
      JSON.stringify(isPeaceful)
    );
    sessionStorage.setItem("ovipets_bot_queue", JSON.stringify(eggQueue));
    sessionStorage.setItem("ovipets_bot_accumulator", JSON.stringify(accum));
    sessionStorage.setItem(
      "ovipets_bot_is_processing",
      JSON.stringify(isProcessing)
    );
    sessionStorage.setItem(
      "ovipets_bot_is_puzzle_solving",
      JSON.stringify(isPuzzleSolving)
    );
  }

  function restoreState() {
    // Restore state after page load
    try {
      const savedEvil = sessionStorage.getItem("ovipets_bot_evil_mode");
      const savedPeaceful = sessionStorage.getItem("ovipets_bot_peaceful_mode");
      const savedQueue = sessionStorage.getItem("ovipets_bot_queue");
      if (savedEvil !== null) {
        isEvil = JSON.parse(savedEvil);
        log(`Restored evil mode: ${isEvil}`);

        // Update UI toggle if it exists
        const evilToggle = document.getElementById("evil-mode-toggle");
        while (!evilToggle) {
          if (isEvil) {
            evilToggle.classList.add("active");
          } else {
            evilToggle.classList.remove("active");
          }

          // Update panel background color
          const panel = document.getElementById("ovipets-bot-panel");
          if (panel) {
            panel.style.background = isEvil
              ? "rgba(139, 0, 0, 0.8)" // Dark red with transparency
              : "rgba(0, 0, 0, 0.8)"; // Default black with transparency
          }
        }
      }
      if (savedPeaceful !== null) {
        isPeaceful = JSON.parse(savedPeaceful);
        log(`Restored peaceful mode: ${isPeaceful}`);
        // Update UI toggle if it exists
        const peacefulToggle = document.getElementById("peaceful-mode-toggle");
        while (!peacefulToggle) {
          if (isPeaceful) {
            peacefulToggle.classList.add("active");
          } else {
            peacefulToggle.classList.remove("active");
          }
        }
      }

      if (savedQueue !== null) {
        eggQueue = JSON.parse(savedQueue);
        log(`Restored queue with ${eggQueue.length} eggs`);
        updateQueueVisualizer();
        if (eggQueue.length > 0 && !isProcessing && !isPuzzleSolving) {
          log("Starting egg processing from restored queue");
          processEggQueue();
        }
      }
    } catch (error) {
      log("Error restoring state:", error);
    }
  }
  function log(...args) {
    console.log("%c[OVIPETS-BOT]", "background:#ff6b35;color:#fff;", ...args);
  }

  function isRunning() {
    return sessionStorage.getItem(RUN_KEY) === "true";
  }

  function extractUserIdFromPage() {
    // First try to get from the user avatar image
    const avatarImg = document.querySelector("#self > a > img");
    if (avatarImg && avatarImg.src) {
      const match = avatarImg.src.match(/[?&]usr=(\d+)/);
      if (match) {
        log(`Found user ID from avatar: ${match[1]}`);
        return match[1];
      }
    }

    // Fallback: check URL hash
    const hashMatch = location.hash.match(/usr=(\d+)/);
    if (hashMatch) {
      log(`Found user ID from URL hash: ${hashMatch[1]}`);
      return hashMatch[1];
    }

    // Fallback: check page scripts
    const scripts = document.querySelectorAll("script");
    for (let script of scripts) {
      const match = script.textContent.match(/usr[_\s]*[:=]\s*['"]*(\d+)/);
      if (match) {
        log(`Found user ID from script: ${match[1]}`);
        return match[1];
      }
    }

    log("Could not find user ID automatically");
    return null;
  }

  async function solvePuzzleWithAPI(imageBlob) {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", imageBlob, "puzzle.png");

      GM_xmlhttpRequest({
        method: "POST",
        url: `${API_BASE}/predict`,
        data: formData,
        onload: function (response) {
          try {
            const data = JSON.parse(response.responseText);
            resolve(data.predicted_class);
          } catch (error) {
            reject(error);
          }
        },
        onerror: reject,
      });
    });
  }

  async function solveAndSubmit() {
    isPuzzleSolving = true;
    log("🧩 PUZZLE SOLVING - Bot paused");

    const dlgSel = 'div.ui-dialog[role="dialog"]';
    const turnSel = 'button[onclick*="pet_turn_egg"]';
    const maxRetries = 1;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      log(`Solve attempt ${attempt}/${maxRetries}`);

      const dlg = document.querySelector(dlgSel);
      if (!dlg) {
        log("No dialog found");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      // Check if this is actually a puzzle dialog
      if (!dlg.innerHTML.includes("Name the Species")) {
        log("Not a puzzle dialog");
        isPuzzleSolving = false;
        return false;
      }

      const img = dlg.querySelector("fieldset img");
      if (!img) {
        log("No puzzle image found");
        await new Promise((r) => setTimeout(r, 300));
        continue;
      }

      try {
        // Get the image URL and convert to proper format
        const url = img.src.replace(/^\/\//, "https://");
        log(`Fetching puzzle image: ${url}`);

        // Fetch image as blob using GM_xmlhttpRequest
        const blob = await new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "blob",
            onload: (response) => resolve(response.response),
            onerror: (error) => reject(error),
          });
        });

        log("Sending to AI for prediction...");
        const prediction = await solvePuzzleWithAPI(blob);

        // Handle retry logic - use fallback prediction
        let predictedClass = prediction;
        if (attempt > 1) {
          predictedClass = "Raptor"; // Fallback for retries
          log(`Retry attempt, using fallback: ${predictedClass}`);
        } else {
          log(`AI predicted: ${predictedClass}`);
        }

        // Find and click the matching label
        let clicked = false;
        const labels = dlg.querySelectorAll("label");
        for (let label of labels) {
          if (label.textContent.trim() === predictedClass) {
            log(`Clicking label: ${predictedClass}`);
            label.click();
            clicked = true;
            break;
          }
        }

        if (!clicked) {
          log(`No label found for prediction: ${predictedClass}`);
          continue;
        }

        // Submit the answer
        const submitBtn = dlg.querySelector(".ui-dialog-buttonpane button");
        if (submitBtn) {
          log("Submitting answer...");
          submitBtn.click();
          await new Promise((r) => setTimeout(r, 259)); // Wait for response
        }

        // Check for error dialog
        const errorDialog = Array.from(document.querySelectorAll(dlgSel)).find(
          (d) => d.querySelector(".ui-dialog-title")?.innerText === "Error"
        );

        if (errorDialog) {
          log("Error dialog detected, wrong answer - retrying");
          // Close error dialog
          const errorBtn = errorDialog.querySelector(
            ".ui-dialog-buttonpane button"
          );
          if (errorBtn) errorBtn.click();

          await new Promise((r) => setTimeout(r, 300));

          // Click turn button again for retry
          const turnBtn = document.querySelector(turnSel);
          if (turnBtn) {
            turnBtn.click();
            await new Promise((r) => setTimeout(r, 300));
          }
          continue; // Retry
        }

        // Success - puzzle solved correctly
        log("✅ Puzzle solved successfully! Bot resuming...");
        // click any button matching the close dialog button until no more are found
        // <button type="button" class="ui-button ui-corner-all ui-widget ui-button-icon-only ui-dialog-titlebar-close" title="Close"><span class="ui-button-icon ui-icon ui-icon-closethick"></span><span class="ui-button-icon-space"> </span>Close</button>
        // after it has clicked all close buttons, it should look to see if more close buttons are available, repeating until no more are found
        const closeButtons = document.querySelectorAll(
          ".ui-dialog-titlebar-close"
        );
        while (closeButtons.length > 0) {
          closeButtons.forEach((btn) => {
            log("Clicking close button");
            btn.click();
          });
          await new Promise((r) => setTimeout(r, 300)); // Wait for dialog to close
          // Re-fetch close buttons
          closeButtons = document.querySelectorAll(".ui-dialog-titlebar-close");
        }
        log("All close buttons clicked, puzzle dialog should be closed now");
        // Wait a bit to ensure dialog closes

        isPuzzleSolving = false;
        return true;
      } catch (error) {
        log(`Error in attempt ${attempt}:`, error);
      }
    }

    log("❌ Failed to solve puzzle after all attempts. Bot resuming...");
    isPuzzleSolving = false;
    return false;
  }
  async function processEggQueue() {
    if (isProcessing || !isRunning()) return;

    isProcessing = true;

    while (eggQueue.length > 0 && isRunning()) {
      // Wait if puzzle is being solved
      while (isPuzzleSolving && isRunning()) {
        log("⏸️ Waiting for puzzle to be solved...");
        await new Promise((r) => setTimeout(r, 50));
      }

      if (!isRunning()) break;

      const egg = eggQueue.shift();
      log(`Processing egg ${egg.egg_id} (${eggQueue.length} remaining)`);

      // Update queue visualizer after removing egg
      updateQueueVisualizer();

      try {
        location.href = egg.page_url;
        accum += 1;
        if (accum >= 500) {
          log("🐢 Slow down! Waiting 5 seconds to avoid rate limiting...");
          await new Promise((r) => setTimeout(r, 5000));
          accum = 0;

          saveState();
          // hit the browser refresh button to avoid rate limiting
          location.reload();
        }
        // just wait for contentloaded
        await new Promise((r) => setTimeout(r, 100));
        // wait until <div class="loading"></div> is not present
        let attempts = 0;
        while (document.querySelector("div.loading") && attempts < 100) {
          log("⏳ Waiting for page to load... (processEggQueue)");
          attempts += 1;
          await new Promise((r) => setTimeout(r, 100));
        }
        log(`Page loaded for egg ${egg.egg_id}`);
        // look for a single instance of each CLASS_NAME from CLASS_NAMES on the page, anywhere
        // not just as a class name but as any string of text anywhere in the entire HTML/JS/plaintext of the page
        var classesOnPage = true;
        var classes_to_use = isEvil ? CLASS_NAMES_EVIL : CLASS_NAMES;
        for (const className of classes_to_use) {
          if (!document.body.innerHTML.includes(className)) {
            log(
              `❌ Egg ${egg.egg_id} does not have required class: ${className}`
            );
            classesOnPage = false;
            break; // No need to check further if one is missing
          }
        }
        if (!classesOnPage) {
          log(
            `❌ Egg ${egg.egg_id} does not have all required classes on the page, skipping`
          );
          continue;
        }
        // Try to click turn button with retries
        let turnAttempts = 0;
        const maxTurnAttempts = 0;

        const tryTurn = async () => {
          const turnBtn = document.querySelector(
            'button[onclick*="pet_turn_egg"]'
          );
          if (turnBtn) {
            log("Found turn button, clicking...");
            turnBtn.click();
            await new Promise((r) => setTimeout(r, 300));

            // Check if puzzle dialog appeared
            const dlg = document.querySelector('div.ui-dialog[role="dialog"]');
            if (dlg && dlg.innerHTML.includes("Name the Species")) {
              log("Puzzle dialog detected, solving...");
              await solveAndSubmit();
            } else {
              const closeButtons = document.querySelectorAll(
                ".ui-dialog-titlebar-close"
              );
              while (closeButtons.length > 0) {
                closeButtons.forEach((btn) => {
                  log("Clicking close button");
                  btn.click();
                });
                await new Promise((r) => setTimeout(r, 300)); // Wait for dialog to close
                // Re-fetch close buttons
                closeButtons = document.querySelectorAll(
                  ".ui-dialog-titlebar-close"
                );
              }
              log("No puzzle dialog, egg turned successfully");
            }
            return true;
          } else if (turnAttempts++ < maxTurnAttempts) {
            log(
              `Turn button not found, attempt ${turnAttempts}/${maxTurnAttempts}`
            );
            await new Promise((r) => setTimeout(r, 300));
            return await tryTurn();
          } else {
            log("Turn button not found after all attempts");
            return false;
          }
        };

        await tryTurn();

        // Wait before processing next egg
        await new Promise((r) => setTimeout(r, 50));
        while (document.querySelector("div.loading")) {
          log("⏳ Waiting for page to load... (after egg turn)");
          await new Promise((r) => setTimeout(r, 100));
        }
      } catch (error) {
        log(`Error processing egg ${egg.egg_id}:`, error);
      }
    }

    isProcessing = false;
    // Update visualizer when queue is empty
    updateQueueVisualizer();
  }

  function pollForEggs() {
    if (isPuzzleSolving) {
      log("Skipping poll - puzzle in progress");
      return;
    }
    GM_xmlhttpRequest({
      method: "GET",
      url: `${API_BASE}/get_eggs`,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);

          if (data.eggs && data.eggs.length > 0) {
            log(`Found ${data.eggs.length} new eggs!`);
            const oldQueueLength = eggQueue.length;
            eggQueue.push(...data.eggs);

            // Update queue visualizer after adding eggs
            setTimeout(() => {
              updateQueueVisualizer();
            }, 100);

            if (!isProcessing && !isPuzzleSolving) {
              processEggQueue();
            }
          }

          // If server is idle, restart collection
          if (data.status === "idle" && isRunning() && !isPuzzleSolving) {
            log("Server idle, restarting collection...");
            startCollection();
          }
        } catch (error) {
          log("Error parsing eggs:", error);
        }
      },
      onerror: function (error) {
        log("Error fetching eggs:", error);
      },
    });
  }
  function updateProgress() {
    if (!isRunning()) return;

    GM_xmlhttpRequest({
      method: "GET",
      url: `${API_BASE}/progress`,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          log(
            `Progress update: ${data.friends_completed}/${data.friends_total}, running: ${data.is_running}`
          ); // Debug log

          const progressElement = document.getElementById("friend-progress");

          if (progressElement) {
            if (data.is_running && data.friends_total > 0) {
              progressElement.textContent = `👥 ${data.friends_completed}/${data.friends_total}`;
              progressElement.style.display = "block";
              log(
                `Updated progress display to: ${progressElement.textContent}`
              ); // Debug log
            } else {
              log(
                `Hiding progress - running: ${data.is_running}, total: ${data.friends_total}`
              ); // Debug log
            }
          }

          // Update status indicator
          updateStatusIndicator();
        } catch (error) {
          log("Error updating progress:", error);
        }
      },
      onerror: function (error) {
        log("Error fetching progress:", error);
      },
    });

    // Replace the problematic code block with this:
    if (isEvil) {
      const evilToggle = document.getElementById("evil-mode-toggle");
      if (evilToggle) {
        // The toggle is a checkbox input, not a div with classes
        evilToggle.checked = true;

        // The visual slider is the span with class "slider"
        const slider = evilToggle.nextElementSibling; // This gets the .slider span
        if (slider && slider.classList.contains("slider")) {
          // Trigger the CSS :checked state by ensuring the input is checked
          slider.style.backgroundColor = "#e74c3c"; // Red background for evil mode
          slider.style.transition =
            "background-color 0.3s ease, box-shadow 0.3s ease";
        }
      }

      // Update panel background color (correct ID)
      const panel = document.getElementById("bot-controls");
      if (panel) {
        panel.style.background = "rgba(139, 0, 0, 0.8)"; // Dark red with transparency
      }
    }
  }
  function updateStatusIndicator() {
    const statusDot = document.getElementById("status-dot");
    if (statusDot) {
      if (isRunning()) {
        statusDot.style.backgroundColor = "#00ff00"; // Green when running
        statusDot.title = "Bot is running";
      } else {
        statusDot.style.backgroundColor = "#ff0000"; // Red when stopped
        statusDot.title = "Bot is stopped";
      }
    }
  }

  function updateQueueVisualizer() {
    const queueContainer = document.getElementById("queue-visualizer");
    if (!queueContainer) return;

    const currentQueueLength = eggQueue.length;
    const maxBarWidth = 220; // Maximum width of the queue bar
    const segmentWidth = 0.22; // Width of each egg segment
    const maxSegments = Math.floor(maxBarWidth / segmentWidth);

    // Get or create the background bar (gray bar)
    let backgroundBar = queueContainer.querySelector(".queue-background-bar");
    if (!backgroundBar) {
      backgroundBar = document.createElement("div");
      backgroundBar.className = "queue-background-bar";
      backgroundBar.style.cssText = `
                height: 14px;
                width: ${maxBarWidth}px;
                background: rgba(255,255,255,0.1);
                border-radius: 7px;
                position: relative;
                overflow: hidden;
            `;

      // Insert the background bar into the existing container
      const existingBarContainer = queueContainer.querySelector(
        'div[style*="height: 14px"]'
      );
      if (existingBarContainer) {
        existingBarContainer.replaceWith(backgroundBar);
      } else {
        queueContainer.appendChild(backgroundBar);
      }
    }

    // Get or create the queue bar (orange bar) - make it a child of background bar
    let queueBar = backgroundBar.querySelector(".queue-bar");
    if (!queueBar) {
      queueBar = document.createElement("div");
      queueBar.className = "queue-bar";
      queueBar.style.cssText = `
                height: 100%;
                background: linear-gradient(90deg, #ff6b35, #f7931e);
                border-radius: 6px;
                transition: width 0.3s ease;
                position: absolute;
                top: 0;
                left: 0;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.3);
                box-sizing: border-box;
            `;
      backgroundBar.appendChild(queueBar);

      // also make sure the ui changes (switch and background color) are applied
      // if evil mode is enabled
      if (isEvil) {
        queueBar.style.background = "linear-gradient(90deg, #ff0000, #aa0000)";
        queueBar.style.boxShadow = "0 2px 8px rgba(255, 0, 0, 0.3)";
        // make sure the switch is actually on
        const evilToggle = document.getElementById("evil-mode-toggle");
        if (evilToggle) {
          evilToggle.classList.add("active");
        }

        // Update panel background color
        const panel = document.getElementById("ovipets-bot-panel");
        if (panel) {
          panel.style.background = "rgba(139, 0, 0, 0.8)"; // Dark red with transparency
        }
      } else {
        queueBar.style.background = "linear-gradient(90deg, #ff6b35, #f7931e)";
        queueBar.style.boxShadow = "0 2px 8px rgba(255, 107, 53, 0.3)";
      }
    }

    // Calculate target width - constrain to max bar width
    const visibleSegments = Math.min(currentQueueLength, maxSegments);
    const targetWidth = Math.min(visibleSegments * segmentWidth, maxBarWidth);

    // Get current width
    const currentWidth = parseInt(queueBar.style.width) || 0;

    // Update width with animation
    queueBar.style.width = `${targetWidth}px`;

    // Add segments effect
    if (targetWidth > currentWidth) {
      // Queue growing - animate segments flying in from right
      animateSegmentsIn(
        queueBar,
        Math.ceil((targetWidth - currentWidth) / segmentWidth)
      );
    } else if (targetWidth < currentWidth) {
      // Queue shrinking - animate segments leaving from left
      animateSegmentsOut(
        queueBar,
        Math.ceil((currentWidth - targetWidth) / segmentWidth)
      );
    }

    // Update queue counter
    const queueCounter = queueContainer.querySelector(".queue-counter");
    if (queueCounter) {
      queueCounter.textContent = `🥚 ${currentQueueLength}`;

      // Pulse effect when queue changes
      queueCounter.style.transform = "scale(1.1)";
      setTimeout(() => {
        queueCounter.style.transform = "scale(1)";
      }, 150);
    }

    // if isEvil is true just make sure the switch is on and the background color is dark red
    console.log(`isEvil: ${isEvil}`);
    if (isEvil) {
      const evilToggle = document.getElementById("evil-mode-toggle");
      while (!evilToggle) {
        console.log("Waiting for evil toggle to be available...");
        evilToggle = document.getElementById("evil-mode-toggle");
      }
      if (evilToggle) {
        evilToggle.classList.add("active");
      }

      // Update panel background color
      const panel = document.getElementById("ovipets-bot-panel");
      if (panel) {
        panel.style.background = "rgba(139, 0, 0, 0.8)"; // Dark red with transparency
      }
    }
  }

  function animateSegmentsIn(queueBar, segmentCount) {
    for (let i = 0; i < segmentCount; i++) {
      setTimeout(() => {
        const segment = document.createElement("div");
        segment.style.cssText = `
                    position: absolute;
                    right: -10px;
                    top: 0;
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(90deg, #ffaa35, #ff8535);
                    border-radius: 3px;
                    animation: flyInFromRight 0.4s ease-out forwards;
                `;

        // Add keyframes if not already added
        if (!document.getElementById("queue-animations")) {
          const style = document.createElement("style");
          style.id = "queue-animations";
          style.textContent = `
                        @keyframes flyInFromRight {
                            0% {
                                right: -10px;
                                opacity: 0;
                                transform: scale(0.5) rotate(45deg);
                            }
                            50% {
                                opacity: 1;
                                transform: scale(1.1) rotate(10deg);
                            }
                            100% {
                                right: 2px;
                                opacity: 0.8;
                                transform: scale(1) rotate(0deg);
                            }
                        }
                        @keyframes slideOutLeft {
                            0% {
                                left: 0;
                                opacity: 0.8;
                                transform: scale(1);
                            }
                            50% {
                                opacity: 0.5;
                                transform: scale(0.8);
                            }
                            100% {
                                left: -10px;
                                opacity: 0;
                                transform: scale(0.3);
                            }
                        }
                        .queue-bar {
                            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
                        }
                    `;
          document.head.appendChild(style);
        }

        queueBar.appendChild(segment);

        // Remove segment after animation
        setTimeout(() => {
          if (segment.parentNode) {
            segment.remove();
          }
        }, 500);
      }, i * 100); // Stagger the animations
    }
  }

  function animateSegmentsOut(queueBar, segmentCount) {
    for (let i = 0; i < segmentCount; i++) {
      setTimeout(() => {
        const segment = document.createElement("div");
        segment.style.cssText = `
                    position: absolute;
                    left: 2px;
                    top: 0;
                    width: 6px;
                    height: 100%;
                    background: linear-gradient(90deg, #ff6b35, #f7931e);
                    border-radius: 3px;
                    animation: slideOutLeft 0.3s ease-in forwards;
                `;

        queueBar.appendChild(segment);

        // Remove segment after animation
        setTimeout(() => {
          if (segment.parentNode) {
            segment.remove();
          }
        }, 350);
      }, i * 50); // Faster staggering for removal
    }
  }

  function startCollection() {
    const userId = extractUserIdFromPage() || prompt("Enter your user ID:");
    if (!userId) return;

    GM_xmlhttpRequest({
      method: "POST",
      url: `${API_BASE}/start_collection/${userId}${
        isPeaceful ? "?peaceful=true" : ""
      }`,
      onload: function (response) {
        try {
          const data = JSON.parse(response.responseText);
          log("Collection started:", data);
        } catch (error) {
          log("Error parsing start collection response:", error);
        }
      },
      onerror: function (error) {
        log("Error starting collection:", error);
      },
    });
  }

  function startBot() {
    log("Starting bot...");
    sessionStorage.setItem(RUN_KEY, "true");

    startCollection();

    // Poll for eggs every 3 seconds
    pollInterval = setInterval(() => {
      pollForEggs();
      updateProgress();
    }, 3000);

    // Update progress immediately
    updateProgress();

    // Update status indicator
    updateStatusIndicator();
  }

  function stopBot() {
    log("Stopping bot...");
    sessionStorage.removeItem(RUN_KEY);

    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    // Clean up saved state when manually stopping
    sessionStorage.removeItem("ovipets_bot_evil_mode");
    sessionStorage.removeItem("ovipets_bot_queue");
    sessionStorage.removeItem("ovipets_bot_accumulator");
    sessionStorage.removeItem("ovipets_bot_is_processing");
    sessionStorage.removeItem("ovipets_bot_is_puzzle_solving");
    // Hide progress display
    const progressElement = document.getElementById("friend-progress");
    if (progressElement) {
      // set to 0/0
      progressElement.textContent = "👥 0/0";
    }

    // Update status indicator
    updateStatusIndicator();

    // Notify server to stop collection
    GM_xmlhttpRequest({
      method: "POST",
      url: `${API_BASE}/stop_collection`,
      onload: function (response) {
        log("Collection stopped on server");
      },
      onerror: function (error) {
        log("Error stopping collection:", error);
      },
    });

    eggQueue = [];
    isProcessing = false;
    isPuzzleSolving = false;
    accum = 0;
  }
  // --- Befriender Module ---
  const Befriender = (function () {
    const RUN_KEY = "befriender_running";
    const LINKS_KEY = "befriender_links";
    const IDX_KEY = "befriender_index";
    const BASE_KEY = "befriender_base_href";
    const UL_KEY = "befriender_selected_ul";

    function log(...args) {
      console.log("%c[BEFRIENDER]", "background:#0055aa;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Befriender - Please click on the UL element containing the user avatars"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.removeItem(LINKS_KEY);
      sessionStorage.removeItem(UL_KEY);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      disableULSelection();
      log("Stopped Befriender");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getLinks() {
      try {
        return JSON.parse(sessionStorage.getItem(LINKS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function saveLinks(a) {
      sessionStorage.setItem(LINKS_KEY, JSON.stringify(a));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "befriender-ul-selection-style";
      style.textContent = `
                .befriender-ul-highlight {
                    outline: 3px solid #0055aa !important;
                    outline-offset: 2px !important;
                    cursor: pointer !important;
                    position: relative !important;
                }
                .befriender-ul-highlight::before {
                    content: "Click to select this list for befriending";
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #0055aa;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 3px;
                    white-space: nowrap;
                    z-index: 10000;
                }
                .befriender-selection-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 9999;
                    pointer-events: none;
                }
                .befriender-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #0055aa;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
            `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "befriender-selection-overlay";
      overlay.id = "befriender-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "befriender-instruction";
      instruction.id = "befriender-instruction";
      instruction.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>📨 Befriender Setup</strong></div>
                <div>Hover over UL elements and click the one containing the user avatars you want to befriend</div>
                <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
            `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("befriender-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("befriender-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("befriender-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("befriender-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    // Replace the handleULHover function in the Befriender module:

    function handleULHover(event) {
      const ul = event.target;
      ul.classList.add("befriender-ul-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "befriender-debug-info";
      debugInfo.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #0055aa;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10002;
                max-width: 300px;
            `;

      const userAvatars = ul.querySelectorAll("a.user.avatar").length;
      const totalLis = ul.querySelectorAll("li").length;
      const selector = generateUniqueSelector(ul);

      debugInfo.innerHTML = `
                <strong>🔍 UL Preview</strong><br>
                Selector: ${selector}<br>
                Total LIs: ${totalLis}<br>
                User Avatars: ${userAvatars}<br>
                ${
                  userAvatars > 0
                    ? "✅ Contains user avatars!"
                    : "❌ No user avatars found"
                }
            `;

      document.body.appendChild(debugInfo);
    }

    function handleULLeave(event) {
      event.target.classList.remove("befriender-ul-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("befriender-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    // Replace the handleULClick function in the Befriender module:

    // Replace the handleULClick and collectLinks functions in the Befriender module:

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class
      ul.classList.remove("befriender-ul-highlight");

      log(`Selected UL with ${ul.children.length} children`);

      // Clean up selection mode first
      disableULSelection();

      // Collect links immediately from the selected UL - no timeout needed
      collectLinksFromElement(ul);
    }

    // New function to collect links directly from the element
    function collectLinksFromElement(ul) {
      if (!isRunning()) return;

      log("Collecting avatar links from selected UL");

      if (!ul) {
        log("No UL element provided");
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract avatar links specifically
      const avatarLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for avatar links...`);

      lis.forEach((li, index) => {
        // Look for user avatar links
        const avatarLink =
          li.querySelector("a.user.avatar") ||
          li.querySelector("a.avatar") ||
          li.querySelector('a[href*="usr="]') ||
          li.querySelector('a[href*="#!/"]');

        if (avatarLink && avatarLink.href) {
          const href = avatarLink.href;

          // Check if it's a user profile link (not a pet link)
          const isUserLink =
            (href.includes("usr=") && !href.includes("pet=")) ||
            (href.includes("#!/") &&
              !href.includes("pet=") &&
              href !== "https://ovipets.com/#");

          if (isUserLink) {
            avatarLinks.push(href);
            log(`Found avatar link ${index + 1}: ${href}`);
          }
        }
      });

      if (!avatarLinks.length) {
        log("No avatar links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Debug what we actually found
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${avatarLinks.length} avatars to befriend`);
      saveLinks(avatarLinks);
      goToProfile();
    }

    // Keep the old collectLinks function for when we're at the base page
    function collectLinks() {
      if (!isRunning()) return;

      log("Looking for previously selected UL...");

      // This function is only called when we're back at the base page
      // and need to re-find the UL. Since we don't persist the selector,
      // we'll just let the user re-select if needed.
      log("Please re-select the UL containing user avatars");
      enableULSelection();
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function generateUniqueSelector(element) {
      // Remove the highlight class before generating selector
      element.classList.remove("befriender-ul-highlight");

      // Try ID first
      if (element.id) {
        return `#${element.id}`;
      }

      // Try class combination (excluding our highlight class)
      if (element.className) {
        const classes = element.className
          .split(" ")
          .filter((c) => c.trim() && c !== "befriender-ul-highlight");
        if (classes.length > 0) {
          let selector = `ul.${classes.join(".")}`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        }
      }

      // Try parent-child relationship
      let parent = element.parentElement;
      if (parent) {
        if (parent.id) {
          return `#${parent.id} > ul`;
        }
        if (parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            let selector = `.${classes.join(".")} > ul`;
            if (document.querySelectorAll(selector).length === 1) {
              return selector;
            }
          }
        }
      }

      // Try to find position among siblings
      const siblings = Array.from(element.parentElement?.children || []);
      const ulSiblings = siblings.filter((el) => el.tagName === "UL");
      if (ulSiblings.length === 1) {
        // Only UL child
        if (parent && parent.id) {
          return `#${parent.id} ul`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul`;
          }
        }
      } else {
        // Multiple UL siblings, use nth-of-type
        const index = ulSiblings.indexOf(element) + 1;
        if (parent && parent.id) {
          return `#${parent.id} ul:nth-of-type(${index})`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul:nth-of-type(${index})`;
          }
        }
      }

      // Final fallback: use XPath-like approach
      function getElementPath(el) {
        if (el.id) return `#${el.id}`;
        if (el === document.body) return "body";

        const parent = el.parentElement;
        if (!parent) return el.tagName.toLowerCase();

        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(
          (sibling) => sibling.tagName === el.tagName
        );

        if (sameTagSiblings.length === 1) {
          return `${getElementPath(parent)} > ${el.tagName.toLowerCase()}`;
        } else {
          const index = sameTagSiblings.indexOf(el) + 1;
          return `${getElementPath(
            parent
          )} > ${el.tagName.toLowerCase()}:nth-of-type(${index})`;
        }
      }

      return getElementPath(element);
    }
    // Replace the collectLinks function in the Befriender module:

    // Replace the collectLinks function in the Befriender module:

    function collectLinks() {
      if (!isRunning()) return;

      log("Collecting avatar links from selected UL");

      const ulSelector = getSelectedUL();
      if (!ulSelector) {
        log("No UL selected");
        stopBot();
        return;
      }

      let ul;

      // Handle special fallback selector
      if (ulSelector.startsWith("ul-signature:")) {
        ul = window.befrienderSelectedUL;
        if (!ul) {
          log("Element reference lost");
          stopBot();
          return;
        }
      } else {
        ul = document.querySelector(ulSelector);
      }

      if (!ul) {
        log(`Selected UL not found: ${ulSelector}`);
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract avatar links specifically (improved detection)
      const avatarLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for avatar links...`);

      lis.forEach((li, index) => {
        // Look for user avatar links with improved selectors
        const avatarLink =
          li.querySelector("a.user.avatar") ||
          li.querySelector("a.avatar") ||
          li.querySelector('a[href*="usr="]') ||
          li.querySelector('a[href*="#!/"]');

        if (avatarLink && avatarLink.href) {
          // More flexible user link detection
          const href = avatarLink.href;

          // Check if it's a user profile link (not a pet link)
          const isUserLink =
            (href.includes("usr=") && !href.includes("pet=")) ||
            (href.includes("#!/") &&
              !href.includes("pet=") &&
              !href === "https://ovipets.com/#");

          if (isUserLink) {
            avatarLinks.push(href);
            log(`Found avatar link ${index + 1}: ${href}`);
          }
        }
      });

      if (!avatarLinks.length) {
        log("No avatar links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Let's also log what we actually found for debugging
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${avatarLinks.length} avatars to befriend`);
      saveLinks(avatarLinks);
      goToProfile();
    }

    function goToProfile() {
      if (!isRunning()) return;

      const links = getLinks();
      const idx = getIndex();

      if (idx >= links.length) {
        log("All friend requests sent! Befriending complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`📨 Visiting profile ${idx + 1}/${links.length}...`);
      location.href = links[idx];
    }

    function handleProfile() {
      if (!isRunning()) return;

      log("🔍 Looking for friend request button...");
      let tries = 0;
      const maxTries = 1;

      const tryFriendButton = () => {
        const btn = document.querySelector('button[onclick*="friend_request"]');
        if (btn) {
          log("✅ Found friend request button, clicking...");
          btn.click();
          log("📨 Friend request sent!");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              location.href = getBase();
            }
          }, 300);
        } else if (tries++ < maxTries) {
          log(
            `⏳ Friend request button not found, retrying... (${tries}/${maxTries})`
          );
          setTimeout(tryFriendButton, 300);
        } else {
          log("❌ No friend request button found, skipping this user");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToProfile();
            }
          }, 300);
        }
      };

      setTimeout(tryFriendButton, 300);
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Befriender main executing...", href);

      // If we haven't collected links yet and we're at the base
      if (!sessionStorage.getItem(LINKS_KEY) && href === base) {
        log("📍 At base, need to collect avatar links");
        setTimeout(() => {
          if (isRunning()) {
            collectLinks();
          }
        }, 300);
      }
      // If we're back at the base and have collected links
      else if (href === base) {
        log("📍 At base, have links, continuing to next profile...");
        setTimeout(() => {
          if (isRunning()) {
            goToProfile();
          }
        }, 300);
      }
      // If we're on a user profile page
      else {
        log("📍 On user profile, sending friend request...");
        setTimeout(() => {
          if (isRunning()) {
            handleProfile();
          }
        }, 300);
      }
    }

    return { startBot, stopBot, main };
  })();
  // --- Old Ovipets Auto‐Turn Eggs Across Friends ---
  const OvipetsOldAcross = (function () {
    const RUN_KEY = "ovipets_old_across_running";
    const FR_KEY = "ovipets_old_across_friends";
    const FI_KEY = "ovipets_old_across_friend_index";
    const EG_KEY = "ovipets_old_across_eggs";
    const EI_KEY = "ovipets_old_across_egg_index";

    function log(...args) {
      console.log(
        "%c[OVIPETS-OLD-ACROSS]",
        "background:#444;color:#bada55;",
        ...args
      );
    }
    function startBot() {
      log("Starting Old Across bot");
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.removeItem(FR_KEY);
      sessionStorage.setItem(FI_KEY, "0");
      sessionStorage.removeItem(EG_KEY);
      sessionStorage.setItem(EI_KEY, "0");
      hideResume();
      main();
    }
    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      log("Stopped Old Across bot");
    }
    function resumeBot() {
      sessionStorage.setItem(RUN_KEY, "true");
      hideResume();
      stepEggIndex();
      navigateEggProfile();
    }
    function showResume() {
      const btn = document.getElementById("ovipets-old-across-resume");
      if (btn) btn.style.display = "inline-block";
    }
    function hideResume() {
      const btn = document.getElementById("ovipets-old-across-resume");
      if (btn) btn.style.display = "none";
    }
    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }
    function getFriends() {
      try {
        return JSON.parse(sessionStorage.getItem(FR_KEY)) || [];
      } catch {
        return [];
      }
    }
    function setFriends(a) {
      sessionStorage.setItem(FR_KEY, JSON.stringify(a));
    }
    function getFI() {
      return parseInt(sessionStorage.getItem(FI_KEY) || "0", 10);
    }
    function setFI(i) {
      sessionStorage.setItem(FI_KEY, String(i));
      log(`Friend index set to ${i}`);
    }
    function stepFI() {
      setFI(getFI() + 1);
    }
    function getEggs() {
      try {
        return JSON.parse(sessionStorage.getItem(EG_KEY)) || [];
      } catch {
        return [];
      }
    }
    function setEggs(a) {
      sessionStorage.setItem(EG_KEY, JSON.stringify(a));
    }
    function getEI() {
      return parseInt(sessionStorage.getItem(EI_KEY) || "0", 10);
    }
    function setEI(i) {
      sessionStorage.setItem(EI_KEY, String(i));
    }
    function stepEggIndex() {
      setEI(getEI() + 1);
    }

    function collectFriends() {
      if (!isRunning()) return;
      log("Collecting friends");
      const ul =
        document.querySelector("body div#friends-list-modal ul") ||
        document.querySelector("body div.friends-list ul") ||
        document.querySelector("body ul");
      if (!ul) {
        log("Friends list not found");
        stopBot();
        return;
      }
      const friends = Array.from(ul.querySelectorAll("a.user.avatar"))
        .map((a) => a.href)
        .filter(Boolean)
        .filter((h) => h !== window.location.origin + window.location.hash);
      log(`Found ${friends.length} friends`);
      setFriends(friends);
      navigateToNextFriend();
    }

    function navigateToNextFriend() {
      if (!isRunning()) return;
      const friends = getFriends();
      let idx = getFI();
      if (idx >= friends.length) {
        log("Restarting friends at 0");
        idx = 0;
        setFI(0);
      }
      const friendUrl = friends[idx];
      if (!friendUrl || typeof friendUrl !== "string") {
        log(`Invalid URL at ${idx}, skipping`);
        stepFI();
        setTimeout(navigateToNextFriend, 300);
        return;
      }
      let url = friendUrl.replace("#!/", "#!/?src=pets&sub=hatchery&usr=");
      if (url.includes("&usr=?usr=")) url = url.replace("&usr=?usr=", "&usr=");
      log(`Go to friend ${idx + 1}/${friends.length}`);
      location.href = url;
    }

    function hideAnnoyingDiv() {
      const annoyingSection = document.querySelector("#unnamed");
      if (annoyingSection) {
        annoyingSection.style.display = "none";
        log("Hiding annoying section");
      }
    }

    function collectEggs(retries = 3) {
      if (!isRunning()) return;
      setTimeout(function () {
        hideAnnoyingDiv();
        log("Collecting eggs (enhanced scan)");
        const progressiveScan = async () => {
          const found = new Set();
          for (let i = 0; i < retries; i++) {
            log(`Scan attempt ${i + 1}/${retries}`);
            var usr = document.querySelector("#src_pets")?.getAttribute("usr");
            while (!usr) {
              await new Promise((r) => setTimeout(r, 100));
              usr = document.querySelector("#src_pets")?.getAttribute("usr");
            }
            const response = await fetch(
              `https://ovipets.com/?src=pets&sub=hatchery&usr=${usr}&!=jQuery36001195479668276287_1748584681454&_=1748584681455`
            );
            if (!response.ok) {
              log("Failed to fetch hatchery page");
              continue;
            }
            log("Response received, parsing HTML");
            var text = await response.text();
            text = text.replace(/^[^{]*\(/, "").replace(/\);?$/, "");
            text = JSON.parse(text);
            text = text["output"];

            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");
            const lis = doc.querySelectorAll('img[title="Turn Egg"]');
            lis.forEach((li) => {
              const a =
                li.parentElement?.parentElement?.parentElement?.querySelector(
                  "a.pet"
                );
              if (a) found.add(a.href);
            });
          }
          log(`Found ${found.size} eggs`);
          return Array.from(found);
        };
        (async () => {
          let looseDone = false;
          async function attempt(n) {
            log(`Attempt ${n}/${retries}`);
            var lis = await progressiveScan();
            if (!looseDone) {
              looseDone = true;
              document
                .querySelectorAll('img[title="Turn Egg"]')
                .forEach((img) => {
                  log("checking img", img);
                  const li = img.parentElement?.parentElement?.parentElement;
                  const a = li?.querySelector("a.pet");
                  if (a) {
                    lis.push(a);
                    log("Found!");
                  }
                });
              log("Loose fallback");
              if (lis.length) {
                log(`Loose found ${lis.length}`);
                setEggs(lis.map((a) => a.href).filter(Boolean));
                return navigateEggProfile();
              }
            }
            if (n < retries) return attempt(n + 1);
            log("No eggs → next friend");
            stepFI();
            navigateToNextFriend();
          }
          attempt(1);
        })();
      }, 1500);
    }

    function navigateEggProfile() {
      if (!isRunning()) return;
      const eggs = getEggs(),
        idx = getEI();
      if (idx >= eggs.length) {
        log("Eggs done for this friend");
        stepFI();
        navigateToNextFriend();
        return;
      }
      log(`Go to egg page ${idx + 1}/${eggs.length}`);
      location.href = eggs[idx];
    }

    async function solveAndSubmitAll() {
      const dlgSel = 'div.ui-dialog[role="dialog"]',
        turnSel = 'button[onclick*="pet_turn_egg"]',
        maxR = 2;
      for (let a = 1; a <= maxR; a++) {
        const dlg = document.querySelector(dlgSel);
        if (!dlg) continue;
        const img = dlg.querySelector("fieldset img");
        if (!img) {
          log("No modal image");
          break;
        }
        const url = img.src.replace(/^\/\//, "https://");
        log(`Solve attempt ${a}: fetch ${url}`);
        const blob = await new Promise((res, rej) =>
          GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "blob",
            onload: (r) => res(r.response),
            onerror: (e) => rej(e),
          })
        );
        const form = new FormData();
        form.append("file", blob, "egg.jpg");
        log("Sending to AI");
        const resp = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: form,
        });
        const { predicted_class } = await resp.json();
        log("Predicted", predicted_class);
        Array.from(dlg.querySelectorAll("label")).forEach((lbl) => {
          if (lbl.textContent.trim() === predicted_class) lbl.click();
        });
        dlg.querySelector(".ui-dialog-buttonpane button").click();
        await new Promise((r) => setTimeout(r, 1000));
        const err = Array.from(document.querySelectorAll(dlgSel)).find(
          (d) => d.querySelector(".ui-dialog-title")?.innerText === "Error"
        );
        if (err) {
          log("Error modal, retry");
          err.querySelector(".ui-dialog-buttonpane button").click();
          document.querySelector(turnSel).click();
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      log("All solved, moving on");
      stepEggIndex();
      setTimeout(() => {
        const prev = location.href;
        navigateEggProfile();
        setTimeout(() => {
          if (location.href === prev) {
            log("Stuck, retry nav");
            navigateEggProfile();
          }
        }, 1500);
      }, 500);
    }

    function handleProfile() {
      if (!isRunning()) return;
      log("On egg profile");
      let tries = 0,
        max = 6;
      (function clickTry() {
        const btn = document.querySelector('button[onclick*="pet_turn_egg"]');
        if (btn) {
          log("Click turn");
          btn.click();
          setTimeout(async () => {
            const dlg = document.querySelector('div.ui-dialog[role="dialog"]');
            if (dlg && /Name the Species/.test(dlg.innerHTML)) {
              log("Puzzle");
              await solveAndSubmitAll();
            } else {
              log("No puzzle");
              stepEggIndex();
              navigateEggProfile();
            }
          }, 800);
        } else if (tries++ < max) {
          setTimeout(clickTry, 200);
        } else {
          log("No button");
          stepEggIndex();
          navigateEggProfile();
        }
      })();
    }

    function main() {
      if (!isRunning()) return;
      const h = location.hash || "";
      log("Old Across main", h);
      if (h.includes("sub=profile") && h.includes("pet=")) {
        handleProfile();
      } else if (h.includes("sub=hatchery")) {
        collectEggs();
      } else {
        collectFriends();
      }
    }

    return { startBot, stopBot, resumeBot, main };
  })();
  // --- Old Ovipets Thorough ---
  const OvipetsOldThorough = (function () {
    const RUN_KEY = "ovipets_old_thorough_running";
    const FR_KEY = "ovipets_old_thorough_friends";
    const FI_KEY = "ovipets_old_thorough_friend_index";
    const EG_KEY = "ovipets_old_thorough_eggs";
    const EI_KEY = "ovipets_old_thorough_egg_index";

    function log(...args) {
      console.log(
        "%c[OVIPETS-OLD-THOROUGH]",
        "background:#666;color:#bada55;",
        ...args
      );
    }
    function startBot() {
      log("Starting Old Thorough bot");
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.removeItem(FR_KEY);
      sessionStorage.setItem(FI_KEY, "0");
      sessionStorage.removeItem(EG_KEY);
      sessionStorage.setItem(EI_KEY, "0");
      hideResume();
      main();
    }
    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      log("Stopped Old Thorough bot");
    }
    function resumeBot() {
      sessionStorage.setItem(RUN_KEY, "true");
      hideResume();
      stepEggIndex();
      navigateEggProfile();
    }
    function showResume() {
      const btn = document.getElementById("ovipets-old-thorough-resume");
      if (btn) btn.style.display = "inline-block";
    }
    function hideResume() {
      const btn = document.getElementById("ovipets-old-thorough-resume");
      if (btn) btn.style.display = "none";
    }
    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }
    function getFriends() {
      try {
        return JSON.parse(sessionStorage.getItem(FR_KEY)) || [];
      } catch {
        return [];
      }
    }
    function setFriends(a) {
      sessionStorage.setItem(FR_KEY, JSON.stringify(a));
    }
    function getFI() {
      return parseInt(sessionStorage.getItem(FI_KEY) || "0", 10);
    }
    function setFI(i) {
      sessionStorage.setItem(FI_KEY, String(i));
      log(`Friend index set to ${i}`);
    }
    function stepFI() {
      setFI(getFI() + 1);
    }
    function getEggs() {
      try {
        return JSON.parse(sessionStorage.getItem(EG_KEY)) || [];
      } catch {
        return [];
      }
    }
    function setEggs(a) {
      sessionStorage.setItem(EG_KEY, JSON.stringify(a));
    }
    function getEI() {
      return parseInt(sessionStorage.getItem(EI_KEY) || "0", 10);
    }
    function setEI(i) {
      sessionStorage.setItem(EI_KEY, String(i));
    }
    function stepEggIndex() {
      setEI(getEI() + 1);
    }

    function collectFriends() {
      if (!isRunning()) return;
      log("Collecting friends");
      const ul =
        document.querySelector("body div#friends-list-modal ul") ||
        document.querySelector("body div.friends-list ul") ||
        document.querySelector("body ul");
      if (!ul) {
        log("Friends list not found");
        stopBot();
        return;
      }
      const friends = Array.from(ul.querySelectorAll("a.user.avatar"))
        .map((a) => a.href)
        .filter(Boolean)
        .filter((h) => h !== window.location.origin + window.location.hash);
      log(`Found ${friends.length} friends`);
      setFriends(friends);
      navigateToNextFriend();
    }

    function navigateToNextFriend() {
      if (!isRunning()) return;
      const friends = getFriends();
      let idx = getFI();
      if (idx >= friends.length) {
        log("Restarting friends at 0");
        idx = 0;
        setFI(0);
      }
      const friendUrl = friends[idx];
      if (!friendUrl || typeof friendUrl !== "string") {
        log(`Invalid URL at ${idx}, skipping`);
        stepFI();
        setTimeout(navigateToNextFriend, 500);
        return;
      }
      let url = friendUrl.replace("#!/", "#!/?src=pets&sub=hatchery&usr=");
      if (url.includes("&usr=?usr=")) url = url.replace("&usr=?usr=", "&usr=");
      log(`Go to friend ${idx + 1}/${friends.length}`);
      location.href = url;
    }

    function hideAnnoyingDiv() {
      const annoyingSection = document.querySelector("#unnamed");
      if (annoyingSection) {
        annoyingSection.style.display = "none";
        log("Hiding annoying section");
      }
    }

    function collectEggs(retries = 3) {
      if (!isRunning()) return;
      setTimeout(function () {
        hideAnnoyingDiv();
        log("Collecting eggs (thorough scan)");
        const progressiveScan = async () => {
          const found = new Set();
          const stepY = window.innerHeight * 0.1;
          log("--- SCAN DOWN ---");
          for (let y = 0; y <= document.body.scrollHeight; y += stepY) {
            window.scrollTo(0, y);
          }
          hideAnnoyingDiv();
          window.scrollTo(0, 0);
          log(`Scan complete, found ${found.size} li`);
          return Array.from(
            document.querySelectorAll(
              "#hatchery > div > form > ul > li > div > a"
            )
          );
        };
        (async () => {
          let looseDone = false;
          async function attempt(n) {
            log(`Attempt ${n}/${retries}`);
            var lis = await progressiveScan();
            looseDone = true;
            log("Thorough fallback");
            if (lis.length) {
              log(`Thorough found ${lis.length}`);
              setEggs(lis.map((a) => a.href).filter(Boolean));
              return navigateEggProfile();
            }
            if (n < retries) return attempt(n + 1);
            log("No eggs → next friend");
            stepFI();
            navigateToNextFriend();
          }
          attempt(1);
        })();
      }, 1500);
    }

    function navigateEggProfile() {
      if (!isRunning()) return;
      const eggs = getEggs(),
        idx = getEI();
      if (idx >= eggs.length) {
        log("Eggs done for this friend");
        stepFI();
        navigateToNextFriend();
        return;
      }
      log(`Go to egg page ${idx + 1}/${eggs.length}`);
      location.href = eggs[idx];
    }

    async function solveAndSubmitAll() {
      const dlgSel = 'div.ui-dialog[role="dialog"]',
        turnSel = 'button[onclick*="pet_turn_egg"]',
        maxR = 2;
      for (let a = 1; a <= maxR; a++) {
        const dlg = document.querySelector(dlgSel);
        if (!dlg) continue;
        const img = dlg.querySelector("fieldset img");
        if (!img) {
          log("No modal image");
          break;
        }
        const url = img.src.replace(/^\/\//, "https://");
        log(`Solve attempt ${a}: fetch ${url}`);
        const blob = await new Promise((res, rej) =>
          GM_xmlhttpRequest({
            method: "GET",
            url,
            responseType: "blob",
            onload: (r) => res(r.response),
            onerror: (e) => rej(e),
          })
        );
        const form = new FormData();
        form.append("file", blob, "egg.jpg");
        log("Sending to AI");
        const resp = await fetch("http://127.0.0.1:8000/predict", {
          method: "POST",
          body: form,
        });
        const { predicted_class } = await resp.json();
        log("Predicted", predicted_class);
        Array.from(dlg.querySelectorAll("label")).forEach((lbl) => {
          if (lbl.textContent.trim() === predicted_class) lbl.click();
        });
        dlg.querySelector(".ui-dialog-buttonpane button").click();
        await new Promise((r) => setTimeout(r, 1000));
        const err = Array.from(document.querySelectorAll(dlgSel)).find(
          (d) => d.querySelector(".ui-dialog-title")?.innerText === "Error"
        );
        if (err) {
          log("Error modal, retry");
          err.querySelector(".ui-dialog-buttonpane button").click();
          document.querySelector(turnSel).click();
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        break;
      }
      log("All solved, moving on");
      stepEggIndex();
      setTimeout(() => {
        const prev = location.href;
        navigateEggProfile();
        setTimeout(() => {
          if (location.href === prev) {
            log("Stuck, retry nav");
            navigateEggProfile();
          }
        }, 1500);
      }, 500);
    }

    function handleProfile() {
      if (!isRunning()) return;
      log("On egg profile");
      let tries = 0,
        max = 2;
      (function clickTry() {
        const btn = document.querySelector('button[onclick*="pet_turn_egg"]');
        if (btn) {
          log("Click turn");
          btn.click();
          setTimeout(async () => {
            const dlg = document.querySelector('div.ui-dialog[role="dialog"]');
            if (dlg && /Name the Species/.test(dlg.innerHTML)) {
              log("Puzzle");
              await solveAndSubmitAll();
            } else {
              log("No puzzle");
              stepEggIndex();
              navigateEggProfile();
            }
          }, 800);
        } else if (tries++ < max) {
          setTimeout(clickTry, 100);
        } else {
          log("No button");
          stepEggIndex();
          navigateEggProfile();
        }
      })();
    }

    function main() {
      if (!isRunning()) return;
      const h = location.hash || "";
      log("Old Thorough main", h);
      if (h.includes("sub=profile") && h.includes("pet=")) {
        handleProfile();
      } else if (h.includes("sub=hatchery")) {
        collectEggs();
      } else {
        collectFriends();
      }
    }

    return { startBot, stopBot, resumeBot, main };
  })();
  // --- Adopter Module ---
  const Adopter = (function () {
    const RUN_KEY = "adopter_running";
    const PETS_KEY = "adopter_pets";
    const IDX_KEY = "adopter_index";
    const BASE_KEY = "adopter_base_href";
    const UL_KEY = "adopter_selected_ul";

    function log(...args) {
      console.log("%c[ADOPTER]", "background:#ff6600;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Adopter - Please click on the UL element containing the pets"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.removeItem(PETS_KEY);
      sessionStorage.removeItem(UL_KEY);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      disableULSelection();
      log("Stopped Adopter");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "adopter-ul-selection-style";
      style.textContent = `
                .adopter-ul-highlight {
                    outline: 3px solid #ff6600 !important;
                    outline-offset: 2px !important;
                    cursor: pointer !important;
                    position: relative !important;
                }
                .adopter-ul-highlight::before {
                    content: "Click to select this list for adoption";
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #ff6600;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 3px;
                    white-space: nowrap;
                    z-index: 10000;
                }
                .adopter-selection-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 9999;
                    pointer-events: none;
                }
                .adopter-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #ff6600;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
            `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "adopter-selection-overlay";
      overlay.id = "adopter-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "adopter-instruction";
      instruction.id = "adopter-instruction";
      instruction.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>🏠 Adopter Setup</strong></div>
                <div>Hover over UL elements and click the one containing the pets you want to adopt</div>
                <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
            `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("adopter-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("adopter-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("adopter-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("adopter-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      event.target.classList.add("adopter-ul-highlight");
    }

    function handleULLeave(event) {
      event.target.classList.remove("adopter-ul-highlight");
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class before generating selector
      ul.classList.remove("adopter-ul-highlight");

      // Generate a unique selector for this UL
      let selector = generateUniqueSelector(ul);

      log(`Selected UL with selector: ${selector}`);

      // Test the selector immediately
      const testElement = document.querySelector(selector);
      if (testElement === ul) {
        log("✅ Selector test passed");
      } else {
        log("❌ Selector test failed, trying alternative...");

        // Try a more specific approach
        if (ul.parentElement) {
          const parent = ul.parentElement;

          if (parent.id) {
            selector = `#${parent.id} ul:nth-child(${
              Array.from(parent.children).indexOf(ul) + 1
            })`;
          } else if (parent.className) {
            const classes = parent.className.split(" ").filter((c) => c.trim());
            selector = `.${classes.join(".")} ul:nth-child(${
              Array.from(parent.children).indexOf(ul) + 1
            })`;
          } else {
            // Ultimate fallback - store the innerHTML signature
            const signature = ul.innerHTML.substring(0, 100);
            selector = `ul-signature:${btoa(signature)}`;

            // Store the actual element reference temporarily
            window.adopterSelectedUL = ul;
            log("Using element reference fallback");
          }
        }

        log(`Alternative selector: ${selector}`);
      }

      setSelectedUL(selector);

      // Clean up selection mode
      disableULSelection();

      // Start collecting pets from the selected UL
      setTimeout(() => {
        collectPets();
      }, 300);
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function generateUniqueSelector(element) {
      // Remove the highlight class before generating selector
      element.classList.remove("adopter-ul-highlight");

      // Try ID first
      if (element.id) {
        return `#${element.id}`;
      }

      // Try class combination (excluding our highlight class)
      if (element.className) {
        const classes = element.className
          .split(" ")
          .filter((c) => c.trim() && c !== "adopter-ul-highlight");
        if (classes.length > 0) {
          let selector = `ul.${classes.join(".")}`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        }
      }

      // Try parent-child relationship
      let parent = element.parentElement;
      if (parent) {
        if (parent.id) {
          return `#${parent.id} > ul`;
        }
        if (parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            let selector = `.${classes.join(".")} > ul`;
            if (document.querySelectorAll(selector).length === 1) {
              return selector;
            }
          }
        }
      }

      // Try to find position among siblings
      const siblings = Array.from(element.parentElement?.children || []);
      const ulSiblings = siblings.filter((el) => el.tagName === "UL");
      if (ulSiblings.length === 1) {
        // Only UL child
        if (parent && parent.id) {
          return `#${parent.id} ul`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul`;
          }
        }
      } else {
        // Multiple UL siblings, use nth-of-type
        const index = ulSiblings.indexOf(element) + 1;
        if (parent && parent.id) {
          return `#${parent.id} ul:nth-of-type(${index})`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul:nth-of-type(${index})`;
          }
        }
      }

      // Final fallback: use XPath-like approach
      function getElementPath(el) {
        if (el.id) return `#${el.id}`;
        if (el === document.body) return "body";

        const parent = el.parentElement;
        if (!parent) return el.tagName.toLowerCase();

        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(
          (sibling) => sibling.tagName === el.tagName
        );

        if (sameTagSiblings.length === 1) {
          return `${getElementPath(parent)} > ${el.tagName.toLowerCase()}`;
        } else {
          const index = sameTagSiblings.indexOf(el) + 1;
          return `${getElementPath(
            parent
          )} > ${el.tagName.toLowerCase()}:nth-of-type(${index})`;
        }
      }

      return getElementPath(element);
    }

    function collectPets() {
      if (!isRunning()) return;

      log("Collecting adoption pets from selected UL");

      const ulSelector = getSelectedUL();
      if (!ulSelector) {
        log("No UL selected");
        stopBot();
        return;
      }

      let ul;

      // Handle special fallback selector
      if (ulSelector.startsWith("ul-signature:")) {
        ul = window.adopterSelectedUL;
        if (!ul) {
          log("Element reference lost");
          stopBot();
          return;
        }
      } else {
        ul = document.querySelector(ulSelector);
      }

      if (!ul) {
        log(`Selected UL not found: ${ulSelector}`);
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract all pet links from li elements
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        const petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          petLinks.push(petLink.href);
          log(`Found pet link ${index + 1}: ${petLink.href}`);
        }
      });

      if (!petLinks.length) {
        log("No adoption pets found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));
        stopBot();
        return;
      }

      log(`Found ${petLinks.length} adoption pets`);
      savePets(petLinks);
      goToPet();
    }

    function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets processed - adoption complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`🏠 Going to adopt pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    function handlePetProfile() {
      if (!isRunning()) return;

      log("🔍 Looking for adoption button on pet profile...");
      let tries = 0;
      const maxTries = 10;

      const tryAdoptButton = () => {
        // Look for adoption button
        let adoptBtn = null;

        // Method 1: Look for button with "adopt" text
        const buttons = document.querySelectorAll(
          'button, input[type="button"], input[type="submit"]'
        );
        for (let btn of buttons) {
          if (
            btn.textContent.toLowerCase().includes("adopt") ||
            btn.value?.toLowerCase().includes("adopt") ||
            btn.onclick?.toString().includes("adopt")
          ) {
            adoptBtn = btn;
            break;
          }
        }

        // Method 2: Look for links with adopt in onclick
        if (!adoptBtn) {
          const links = document.querySelectorAll(
            'a[onclick*="adopt"], a[href*="adopt"]'
          );
          if (links.length > 0) {
            adoptBtn = links[0];
          }
        }

        if (adoptBtn) {
          log("✅ Found adoption button, clicking...");
          adoptBtn.click();

          // Wait for adoption modal or confirmation
          setTimeout(() => {
            if (isRunning()) {
              handleAdoptionModal();
            }
          }, 300);
        } else if (tries++ < maxTries) {
          log(
            `⏳ Adoption button not found, retrying... (${tries}/${maxTries})`
          );
          setTimeout(tryAdoptButton, 300);
        } else {
          log("❌ No adoption button found, moving to next pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        }
      };

      // Initial delay to let page load
      setTimeout(tryAdoptButton, 300);
    }

    function handleAdoptionModal() {
      if (!isRunning()) return;

      log("🔍 Looking for adoption confirmation modal...");
      let modalTries = 0;
      const maxModalTries = 10;

      const tryModal = () => {
        let confirmBtn = null;

        // Method 1: Look for visible dialog with adoption confirmation
        const modals = document.querySelectorAll(
          'div.ui-dialog[role="dialog"]'
        );
        for (let modal of modals) {
          if (modal.style.display !== "none" && modal.offsetParent !== null) {
            // Check if this modal contains adoption-related content
            if (
              modal.innerHTML.includes("adopt") ||
              modal.innerHTML.includes("Adopt")
            ) {
              const buttonPane = modal.querySelector(".ui-dialog-buttonpane");
              if (buttonPane) {
                confirmBtn = buttonPane.querySelector("button:first-child");
                if (confirmBtn) {
                  log("Found adoption modal confirmation button");
                  break;
                }
              }
            }
          }
        }

        // Method 2: Look for any visible dialog button as fallback
        if (!confirmBtn) {
          const dialogButtons = document.querySelectorAll(
            ".ui-dialog-buttonpane button"
          );
          for (let btn of dialogButtons) {
            if (btn.offsetParent !== null) {
              // visible
              confirmBtn = btn;
              log("Found dialog button via visibility fallback");
              break;
            }
          }
        }

        if (confirmBtn) {
          log("✅ Found adoption confirmation button, clicking...");
          confirmBtn.click();
          log("🏠 Adoption confirmed! Moving to next pet...");

          // Move to next pet
          setTimeout(() => {
            if (isRunning()) {
              setIndex(getIndex() + 1);
              goToPet();
            }
          }, 300);
        } else if (modalTries++ < maxModalTries) {
          log(
            `⏳ Modal button not found, retrying... (${modalTries}/${maxModalTries})`
          );
          setTimeout(tryModal, 300);
        } else {
          log("❌ No modal confirmation button found, moving to next pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        }
      };

      tryModal();
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Adopter main executing...", href);

      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        log("📍 On pet profile, looking for adoption button");
        setTimeout(() => {
          if (isRunning()) {
            handlePetProfile();
          }
        }, 300);
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        setTimeout(() => {
          if (isRunning()) {
            collectPets();
          }
        }, 300);
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 300);
      }
      // If we're on a different page
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to next pet");
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // --- Breeder Module ---
  const Breeder = (function () {
    const RUN_KEY = "breeder_running";
    const PETS_KEY = "breeder_pets";
    const IDX_KEY = "breeder_index";
    const BASE_KEY = "breeder_base_href";
    const UL_KEY = "breeder_selected_ul";
    const JUST_BREAD = "breeder_just_bred";

    function log(...args) {
      console.log("%c[BREEDER]", "background:#ff1493;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Breeder - Please click on the UL element containing the pets"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.setItem(JUST_BREAD, "false");
      sessionStorage.removeItem(PETS_KEY);
      sessionStorage.removeItem(UL_KEY);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      sessionStorage.removeItem(JUST_BREAD);
      disableULSelection();
      log("Stopped Breeder");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "breeder-ul-selection-style";
      style.textContent = `
                .breeder-ul-highlight {
                    outline: 3px solid #ff1493 !important;
                    outline-offset: 2px !important;
                    cursor: pointer !important;
                    position: relative !important;
                }
                .breeder-ul-highlight::before {
                    content: "Click to select this list for breeding";
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #ff1493;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 3px;
                    white-space: nowrap;
                    z-index: 10000;
                }
                .breeder-selection-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 9999;
                    pointer-events: none;
                }
                .breeder-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #ff1493;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
            `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "breeder-selection-overlay";
      overlay.id = "breeder-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "breeder-instruction";
      instruction.id = "breeder-instruction";
      instruction.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>💕 Breeder Setup</strong></div>
                <div>Hover over UL elements and click the one containing the pets you want to breed</div>
                <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
            `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("breeder-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("breeder-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("breeder-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("breeder-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      event.target.classList.add("breeder-ul-highlight");
    }

    function handleULLeave(event) {
      event.target.classList.remove("breeder-ul-highlight");
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class before generating selector
      ul.classList.remove("breeder-ul-highlight");

      // Generate a unique selector for this UL
      let selector = generateUniqueSelector(ul);

      log(`Selected UL with selector: ${selector}`);

      // Test the selector immediately
      const testElement = document.querySelector(selector);
      if (testElement === ul) {
        log("✅ Selector test passed");
      } else {
        log("❌ Selector test failed, trying alternative...");

        // Try a more specific approach
        if (ul.parentElement) {
          const parent = ul.parentElement;

          if (parent.id) {
            selector = `#${parent.id} ul:nth-child(${
              Array.from(parent.children).indexOf(ul) + 1
            })`;
          } else if (parent.className) {
            const classes = parent.className.split(" ").filter((c) => c.trim());
            selector = `.${classes.join(".")} ul:nth-child(${
              Array.from(parent.children).indexOf(ul) + 1
            })`;
          } else {
            // Ultimate fallback - store the innerHTML signature
            const signature = ul.innerHTML.substring(0, 100);
            selector = `ul-signature:${btoa(signature)}`;

            // Store the actual element reference temporarily
            window.breederSelectedUL = ul;
            log("Using element reference fallback");
          }
        }

        log(`Alternative selector: ${selector}`);
      }

      setSelectedUL(selector);

      // Clean up selection mode
      disableULSelection();

      // Start collecting pets from the selected UL
      setTimeout(() => {
        collectPets();
      }, 300);
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function generateUniqueSelector(element) {
      // Remove the highlight class before generating selector
      element.classList.remove("breeder-ul-highlight");

      // Try ID first
      if (element.id) {
        return `#${element.id}`;
      }

      // Try class combination (excluding our highlight class)
      if (element.className) {
        const classes = element.className
          .split(" ")
          .filter((c) => c.trim() && c !== "breeder-ul-highlight");
        if (classes.length > 0) {
          let selector = `ul.${classes.join(".")}`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        }
      }

      // Try parent-child relationship
      let parent = element.parentElement;
      if (parent) {
        if (parent.id) {
          return `#${parent.id} > ul`;
        }
        if (parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            let selector = `.${classes.join(".")} > ul`;
            if (document.querySelectorAll(selector).length === 1) {
              return selector;
            }
          }
        }
      }

      // Try to find position among siblings
      const siblings = Array.from(element.parentElement?.children || []);
      const ulSiblings = siblings.filter((el) => el.tagName === "UL");
      if (ulSiblings.length === 1) {
        // Only UL child
        if (parent && parent.id) {
          return `#${parent.id} ul`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul`;
          }
        }
      } else {
        // Multiple UL siblings, use nth-of-type
        const index = ulSiblings.indexOf(element) + 1;
        if (parent && parent.id) {
          return `#${parent.id} ul:nth-of-type(${index})`;
        }
        if (parent && parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            return `.${classes.join(".")} ul:nth-of-type(${index})`;
          }
        }
      }

      // Final fallback: use XPath-like approach
      function getElementPath(el) {
        if (el.id) return `#${el.id}`;
        if (el === document.body) return "body";

        const parent = el.parentElement;
        if (!parent) return el.tagName.toLowerCase();

        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(
          (sibling) => sibling.tagName === el.tagName
        );

        if (sameTagSiblings.length === 1) {
          return `${getElementPath(parent)} > ${el.tagName.toLowerCase()}`;
        } else {
          const index = sameTagSiblings.indexOf(el) + 1;
          return `${getElementPath(
            parent
          )} > ${el.tagName.toLowerCase()}:nth-of-type(${index})`;
        }
      }

      return getElementPath(element);
    }

    function collectPets() {
      if (!isRunning()) return;

      log("Collecting breeding pets from selected UL");

      const ulSelector = getSelectedUL();
      if (!ulSelector) {
        log("No UL selected");
        stopBot();
        return;
      }

      let ul;

      // Handle special fallback selector
      if (ulSelector.startsWith("ul-signature:")) {
        ul = window.breederSelectedUL;
        if (!ul) {
          log("Element reference lost");
          stopBot();
          return;
        }
      } else {
        ul = document.querySelector(ulSelector);
      }

      if (!ul) {
        log(`Selected UL not found: ${ulSelector}`);
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract all pet links from li elements
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        const petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          petLinks.push(petLink.href);
          log(`Found pet link ${index + 1}: ${petLink.href}`);
        }
      });

      if (!petLinks.length) {
        log("No breeding pets found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));
        stopBot();
        return;
      }

      log(`Found ${petLinks.length} breeding pets`);
      savePets(petLinks);
      goToPet();
    }

    function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets processed - breeding complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`🐾 Going to pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    function handlePetProfile() {
      if (!isRunning()) return;

      log("🔍 Looking for breeding tab on pet profile...");
      let tries = 0;
      const maxTries = 1; // Increased wait time

      const tryBreedingTab = () => {
        if (!isRunning()) return;

        // Try multiple selectors for the breeding tab
        let breedingTab = null;

        // Method 1: Look for the specific li with breeding panel attribute
        const breedingLi = document.querySelector(
          '#tabs > div > form > div > ul > li[panel*="sec=breeding"]'
        );
        if (breedingLi) {
          breedingTab = breedingLi.querySelector("a.ui-tabs-anchor");
        }

        // Method 2: Look for tab with "Breeding" text
        if (!breedingTab) {
          const tabs = document.querySelectorAll("#tabs a.ui-tabs-anchor");
          for (let tab of tabs) {
            if (tab.textContent.trim().toLowerCase().includes("breeding")) {
              breedingTab = tab;
              break;
            }
          }
        }

        // Method 3: Try the specific selector you provided
        if (!breedingTab) {
          breedingTab = document.querySelector("#ui-id-35");
        }

        // Method 4: Look for any tab with breeding in the href
        if (!breedingTab) {
          const allTabs = document.querySelectorAll(
            '#tabs a[href*="breeding"], #tabs a[href*="Breeding"]'
          );
          if (allTabs.length > 0) {
            breedingTab = allTabs[0];
          }
        }

        if (breedingTab) {
          log("✅ Found breeding tab, clicking...");
          breedingTab.click();

          // Wait longer for breeding section to load
          setTimeout(() => {
            if (isRunning()) {
              handleBreedingSection();
            }
          }, 300); // Increased wait time
        } else if (tries++ < maxTries) {
          log(`⏳ Breeding tab not found, retrying... (${tries}/${maxTries})`);
          setTimeout(tryBreedingTab, 300); // Wait longer between retries
        } else {
          log("❌ No breeding tab found after all attempts, skipping this pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        }
      };

      // Initial delay to let page load
      setTimeout(tryBreedingTab, 300);
    }

    // Replace the handleBreedingModal function in the Breeder module:
    function handleBreedingModal() {
      if (!isRunning()) return;

      log("🔍 Looking for breeding confirmation modal...");
      let modalTries = 0;
      const maxModalTries = 15;

      const tryModal = () => {
        if (!isRunning()) return;

        let confirmBtn = null;

        // Method 1: Look for the specific breeding modal button
        confirmBtn = document.querySelector(
          "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)"
        );

        // Method 2: Look for any visible dialog with breeding confirmation
        if (!confirmBtn) {
          const modals = document.querySelectorAll(
            'div.ui-dialog[role="dialog"]'
          );
          for (let modal of modals) {
            if (modal.style.display !== "none" && modal.offsetParent !== null) {
              // Check if this modal contains breeding-related content
              if (
                modal.innerHTML.includes("breed") ||
                modal.innerHTML.includes("Breed")
              ) {
                const buttonPane = modal.querySelector(".ui-dialog-buttonpane");
                if (buttonPane) {
                  confirmBtn = buttonPane.querySelector("button:first-child");
                  if (confirmBtn) {
                    log(
                      "Found breeding modal confirmation button via content search"
                    );
                    break;
                  }
                }
              }
            }
          }
        }

        // Method 3: Look for any visible dialog button as fallback
        if (!confirmBtn) {
          const dialogButtons = document.querySelectorAll(
            ".ui-dialog-buttonpane button"
          );
          for (let btn of dialogButtons) {
            if (btn.offsetParent !== null) {
              // visible
              confirmBtn = btn;
              log("Found dialog button via visibility fallback");
              break;
            }
          }
        }

        if (confirmBtn) {
          log("✅ Found breeding confirmation button, clicking...");
          // set just bred flag
          sessionStorage.setItem(JUST_BREAD, "true");
          confirmBtn.click();
          log(
            "💕 Breeding confirmed! Staying on same pet to find more partners..."
          );
        } else if (modalTries++ < maxModalTries) {
          log(
            `⏳ Modal button not found, retrying... (${modalTries}/${maxModalTries})`
          );
          setTimeout(tryModal, 300);
        } else {
          log("❌ No modal confirmation button found, moving to next pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        }
      };

      tryModal();
    }

    // Also update the handleBreedingSection function to handle "no more partners" case:

    function handleBreedingSection() {
      if (!isRunning()) return;

      log("💕 Looking for breeding partners...");

      let attempts = 0;
      const maxAttempts = 1;

      const findBreedingPartners = () => {
        if (!isRunning()) return;
        // look for a feeding link
        /*
                <button type="button" onclick="var self = this; ui_action_cmdExec('pet_feed','PetID=469843813',self.form,function(){ui_action_secLoad('pets','profile','profile','pet=469843813&amp;prio=1','',self);});" class="ui-button ui-corner-all ui-widget"><span>Feed</span></button>
                */
        // wait 100 ms
        setTimeout(() => {
          if (!isRunning()) return;
        }, 100);

        let feedingButton = document.querySelector(
          'button[onclick*="pet_feed"]'
        );
        if (feedingButton) {
          log("✅ Found feeding button, clicking...");
          feedingButton.click();
        }
        // find this selector
        // <select name="enclosure" onchange="var self = this; ui_action_secLoad('pets','profile','breeding','usr=5262473&amp;pet=476473623','',self);"><option value="0">hate these thing </option><option value="1">aye </option></select>
        // then for each item in the select, select the item, then check the breeding section
        log("🔍 looking for breeding tabs");
        var breedingSelector = document.querySelector(
          'select[name="enclosure"]'
        );
        var breedingLinks = [];
        if (breedingSelector) {
          log("✅ Found breeding selector, iterating options...");
          const options = breedingSelector.querySelectorAll("option");
          options.forEach((option) => {
            option.selected = true;
            log(`🔄 Selected breeding option: ${option.textContent}`);
          });

          // Try multiple selectors for the breeding UL
          let breedingUL = document.querySelector(
            "#breeding > div > form > ul"
          );

          if (!breedingUL) {
            // Fallback: look for any UL with breeding-related links
            const allULs = document.querySelectorAll("ul");
            for (let ul of allULs) {
              if (ul.querySelector('a[onclick*="pet_breed"]')) {
                breedingUL = ul;
                log("Found breeding UL via fallback search");
                break;
              }
            }
          }

          if (!breedingUL && attempts++ < maxAttempts) {
            log(
              `⏳ Breeding section not loaded yet, retrying... (${attempts}/${maxAttempts})`
            );
            setTimeout(findBreedingPartners, 300);
            return;
          }

          if (!breedingUL) {
            log("❌ No breeding UL found, moving to next pet");
            setIndex(getIndex() + 1);
            setTimeout(() => {
              if (isRunning()) {
                goToPet();
              }
            }, 300);
            return;
          }

          // Look for available breeding partners
          breedingLinks = breedingUL.querySelectorAll(
            'a[onclick*="pet_breed"]'
          );

          if (!breedingLinks.length) {
            log(
              "✅ No more breeding partners available for this pet, moving to next pet"
            );
            setIndex(getIndex() + 1);
            setTimeout(() => {
              if (isRunning()) {
                goToPet();
              }
            }, 300);
            return;
          }
        } else {
          // Try multiple selectors for the breeding UL
          let breedingUL = document.querySelector(
            "#breeding > div > form > ul"
          );

          if (!breedingUL) {
            // Fallback: look for any UL with breeding-related links
            const allULs = document.querySelectorAll("ul");
            for (let ul of allULs) {
              if (ul.querySelector('a[onclick*="pet_breed"]')) {
                breedingUL = ul;
                log("Found breeding UL via fallback search");
                break;
              }
            }
          }

          if (!breedingUL && attempts++ < maxAttempts) {
            log(
              `⏳ Breeding section not loaded yet, retrying... (${attempts}/${maxAttempts})`
            );
            setTimeout(findBreedingPartners, 300);
            return;
          }

          if (!breedingUL) {
            log("❌ No breeding UL found, moving to next pet");
            setIndex(getIndex() + 1);
            setTimeout(() => {
              if (isRunning()) {
                goToPet();
              }
            }, 300);
            return;
          }

          // Look for available breeding partners
          const breedingLinks = breedingUL.querySelectorAll(
            'a[onclick*="pet_breed"]'
          );

          if (!breedingLinks.length) {
            log(
              "✅ No more breeding partners available for this pet, moving to next pet"
            );
            setIndex(getIndex() + 1);
            setTimeout(() => {
              if (isRunning()) {
                goToPet();
              }
            }, 300);
            return;
          }
        }

        // Process the first available breeding partner
        const firstBreedingLink = breedingLinks[0];
        log(
          `🎯 Found ${breedingLinks.length} breeding partners, clicking first one...`
        );

        firstBreedingLink.click();

        // Wait for modal to appear
        setTimeout(() => {
          if (isRunning()) {
            handleBreedingModal();
          }
        }, 300);
        if (breedingLinks.length > 1) {
          log(
            `🔄 Found ${
              breedingLinks.length - 1
            } more breeding partners, will continue after this one`
          );
          // to repeat this pet after breeding, set the index back once
          setIndex(getIndex() - 1);
        }
      };

      findBreedingPartners();
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();
      var counter = 0;
      let feedingButton = document.querySelector('button[onclick*="pet_feed"]');
      if (feedingButton) {
        log("✅ Found feeding button, clicking...");
        feedingButton.click();
      }

      log("🚀 Breeder main executing...", href);
      // if just bred, go back to breeding section
      if (sessionStorage.getItem(JUST_BREAD) === "true") {
        log("🔙 Just bred, going back to breeding section...");
        // set just bred flag to false
        if (counter > 0) {
          counter = 0;
          sessionStorage.setItem(JUST_BREAD, "false");
          setTimeout(() => {
            if (isRunning()) {
              history.back();
            }
          }, 300);
          setTimeout(() => {
            if (isRunning()) {
              handlePetProfile();
            }
          }, 400);
        } else {
          counter++;
        }
      }
      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        // Check if we're already on the breeding tab
        let feedingButton = document.querySelector(
          'button[onclick*="pet_feed"]'
        );
        if (feedingButton) {
          log("✅ Found feeding button, clicking...");
          feedingButton.click();
        }
        const breedingSection = document.querySelector("#breeding");
        if (breedingSection) {
          log("📍 Already on breeding section, looking for partners...");
          setTimeout(() => {
            if (isRunning()) {
              handleBreedingSection();
            }
          }, 300);
        } else {
          let feedingButton = document.querySelector(
            'button[onclick*="pet_feed"]'
          );
          if (feedingButton) {
            log("✅ Found feeding button, clicking...");
            feedingButton.click();
          }
          log("📍 On pet profile, need to click breeding tab");
          setTimeout(() => {
            if (isRunning()) {
              handlePetProfile();
            }
          }, 300);
        }
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        setTimeout(() => {
          if (isRunning()) {
            collectPets();
          }
        }, 300);
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 300);
      }
      // If we're on a different page, go to current pet (not next!)
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to current pet");
          setTimeout(() => {
            if (isRunning()) {
              // Don't increment index - go to current pet
              const currentPetUrl = pets[getIndex()];
              if (currentPetUrl) {
                log(`🔄 Returning to current pet: ${currentPetUrl}`);
                location.href = currentPetUrl;
              } else {
                goToPet();
              }
            }
          }, 300);
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // --- Namer Module ---
  const Namer = (function () {
    const RUN_KEY = "namer_running";
    const PETS_KEY = "namer_pets";
    const IDX_KEY = "namer_index";
    const BASE_KEY = "namer_base_href";
    const UL_KEY = "namer_selected_ul";
    const NAME = "namer_name";

    function log(...args) {
      console.log("%c[NAMER]", "background:#9932cc;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Namer - Please click on the UL element containing the pets to name"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.removeItem(PETS_KEY);
      sessionStorage.removeItem(UL_KEY);
      sessionStorage.removeItem(NAME);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      disableULSelection();
      log("Stopped Namer");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "namer-ul-selection-style";
      style.textContent = `
              .namer-ul-highlight {
                  outline: 3px solid #9932cc !important;
                  outline-offset: 2px !important;
                  cursor: pointer !important;
                  position: relative !important;
              }
              .namer-ul-highlight::before {
                  content: "Click to select this list for naming";
                  position: absolute;
                  top: -25px;
                  left: 0;
                  background: #9932cc;
                  color: white;
                  padding: 2px 8px;
                  font-size: 12px;
                  border-radius: 3px;
                  white-space: nowrap;
                  z-index: 10000;
              }
              .namer-selection-overlay {
                  position: fixed;
                  top: 0;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  background: rgba(0,0,0,0.3);
                  z-index: 9999;
                  pointer-events: none;
              }
              .namer-instruction {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  background: #9932cc;
                  color: white;
                  padding: 20px;
                  border-radius: 8px;
                  font-family: monospace;
                  font-size: 16px;
                  z-index: 10001;
                  text-align: center;
                  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
              }
          `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "namer-selection-overlay";
      overlay.id = "namer-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "namer-instruction";
      instruction.id = "namer-instruction";
      instruction.innerHTML = `
              <div style="margin-bottom: 10px;"><strong>📝 Namer Setup</strong></div>
              <div>Hover over UL elements and click the one containing the pets you want to name</div>
              <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
          `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("namer-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("namer-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("namer-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("namer-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      const ul = event.target;
      ul.classList.add("namer-ul-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "namer-debug-info";
      debugInfo.style.cssText = `
              position: fixed;
              top: 10px;
              right: 10px;
              background: #9932cc;
              color: white;
              padding: 10px;
              border-radius: 5px;
              font-family: monospace;
              font-size: 12px;
              z-index: 10002;
              max-width: 300px;
          `;

      const petLinks = ul.querySelectorAll('a.pet[href*="pet="]').length;
      const totalLis = ul.querySelectorAll("li").length;

      debugInfo.innerHTML = `
              <strong>🔍 UL Preview</strong><br>
              Total LIs: ${totalLis}<br>
              Pet Links: ${petLinks}<br>
              ${
                petLinks > 0
                  ? "✅ Contains pet links!"
                  : "❌ No pet links found"
              }
          `;

      document.body.appendChild(debugInfo);
    }

    function handleULLeave(event) {
      event.target.classList.remove("namer-ul-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("namer-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class
      ul.classList.remove("namer-ul-highlight");

      log(`Selected UL with ${ul.children.length} children`);

      // Clean up selection mode first
      disableULSelection();

      // ask what the name should be with an alert prompt
      const name = prompt("Enter the name to use for all pets:", "cute guy");
      if (name) {
        sessionStorage.setItem(NAME, name);
        log(`Using name: ${name}`);
      } else {
        log('No name provided, using default "cute guy"');
        sessionStorage.setItem(NAME, "cute guy");
      }

      // Collect pets immediately from the selected UL
      collectPetsFromElement(ul);
    }

    function collectPetsFromElement(ul) {
      if (!isRunning()) return;

      log("Collecting pet links from selected UL");

      if (!ul) {
        log("No UL element provided");
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract pet links specifically
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        // Look for pet links - using the pattern from your example
        const petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          const href = petLink.href;

          // Check if it's a pet profile link (not a user link)
          const isPetLink =
            href.includes("pet=") && href.includes("sub=profile");

          if (isPetLink) {
            petLinks.push(href);
            log(`Found pet link ${index + 1}: ${href}`);
          }
        }
      });

      if (!petLinks.length) {
        log("No pet links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Debug what we actually found
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${petLinks.length} pets to name`);
      savePets(petLinks);
      goToPet();
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets named! Naming complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`📝 Going to name pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    function handlePetProfile() {
      if (!isRunning()) return;
      // while a close button is present, click it
      // <span class="ui-button-icon ui-icon ui-icon-closethick"></span>
      while (document.querySelector(".ui-button-icon.ui-icon-closethick")) {
        const closeBtn = document.querySelector(
          ".ui-button-icon.ui-icon-closethick"
        );
        log("🔄 Found close button, clicking to close any open modals...");
        closeBtn.click();
      }
      log("🔍 Looking for naming button on pet profile...");

      // Single attempt with minimal wait - no retries
      setTimeout(() => {
        const namingBtn = document.querySelector(
          "#profile > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.actions > div > div > button"
        );

        if (namingBtn) {
          log("✅ Found naming button, clicking...");
          namingBtn.click();

          // Wait for modal to appear with fixed delay
          setTimeout(() => {
            if (isRunning()) {
              handleNamingModal();
            }
          }, 250);
        } else {
          log("❌ No naming button found, moving to next pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 50);
        }
      }, 100);
    }

    function handleNamingModal() {
      if (!isRunning()) return;

      log("🔍 Looking for naming modal...");

      // Single attempt - modal should be ready by now
      const nameInput = document.querySelector(
        "#dialog > fieldset > div > div > input[type=text]"
      );

      if (nameInput) {
        log("✅ Found name input field, entering name...");

        // Clear existing text and type new name
        nameInput.value = "";
        nameInput.focus();
        nameInput.value = sessionStorage.getItem(NAME) || "cute guy";

        // Trigger input events to ensure the change is registered
        nameInput.dispatchEvent(new Event("input", { bubbles: true }));
        nameInput.dispatchEvent(new Event("change", { bubbles: true }));
        // click this body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix
        // just to be sure lol
        document
          .querySelector(
            "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix"
          )
          .click();

        log("📝 Name entered, looking for confirm button...");

        // Minimal wait then look for confirm button
        setTimeout(() => {
          const confirmBtn = document.querySelector(
            "body > div.ui-dialog.ui-corner-all.ui-widget.ui-widget-content.ui-front.ui-dialog-buttons.ui-draggable.ui-resizable > div.ui-dialog-buttonpane.ui-widget-content.ui-helper-clearfix > div > button:nth-child(1)"
          );

          if (confirmBtn) {
            log("✅ Found confirm button, clicking...");
            confirmBtn.click();
            log("🎉 Pet named successfully! Moving to next pet...");

            // Move to next pet with minimal delay
            setTimeout(() => {
              if (isRunning()) {
                setIndex(getIndex() + 1);
                goToPet();
              }
            }, 25);
          } else {
            log("❌ No confirm button found, moving to next pet");
            setIndex(getIndex() + 1);
            setTimeout(() => {
              if (isRunning()) {
                goToPet();
              }
            }, 50);
          }
        }, 100);
      } else {
        log("❌ No modal input found, moving to next pet");
        setIndex(getIndex() + 1);
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 50);
      }
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Namer main executing...", href);

      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        log("📍 On pet profile, looking for naming button");
        handlePetProfile();
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        setTimeout(() => {
          if (isRunning()) {
            // Re-enable UL selection
            enableULSelection();
          }
        }, 50);
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 50);
      }
      // If we're on a different page
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to next pet");
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 50);
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // --- Image Collector Module ---
  const ImageCollector = (function () {
    const RUN_KEY = "image_collector_running";
    const SPECIES_KEY = "image_collector_species";
    const COUNT_KEY = "image_collector_count";

    // List of species that the puzzle solver can recognize
    const SPECIES_OPTIONS = [
      "Canis",
      "Draconis",
      "Equus",
      "Feline",
      "Gekko",
      "Lupus",
      "Mantis",
      "Raptor",
      "Vulpes",
    ];

    function log(...args) {
      console.log(
        "%c[IMAGE-COLLECTOR]",
        "background:#ff4500;color:#fff;",
        ...args
      );
    }

    function startBot() {
      log("Starting Image Collector");

      // Show species selection modal
      showSpeciesSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(SPECIES_KEY);
      sessionStorage.removeItem(COUNT_KEY);
      log("Stopped Image Collector");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getSelectedSpecies() {
      return sessionStorage.getItem(SPECIES_KEY);
    }

    function setSelectedSpecies(species) {
      sessionStorage.setItem(SPECIES_KEY, species);
    }

    function getImageCount() {
      return parseInt(sessionStorage.getItem(COUNT_KEY) || "0", 10);
    }

    function setImageCount(count) {
      sessionStorage.setItem(COUNT_KEY, String(count));
    }

    function incrementImageCount() {
      const newCount = getImageCount() + 1;
      setImageCount(newCount);
      return newCount;
    }

    function showSpeciesSelection() {
      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.id = "image-collector-species-overlay";
      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

      // Create modal content
      const modal = document.createElement("div");
      modal.style.cssText = `
                background: #ff4500;
                color: white;
                padding: 30px;
                border-radius: 10px;
                font-family: monospace;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;

      modal.innerHTML = `
                <div style="margin-bottom: 20px; text-align: center;">
                    <h2 style="margin: 0 0 10px 0;">📸 Image Collector</h2>
                    <p style="margin: 0; font-size: 14px;">Select the species you want to collect images for:</p>
                </div>
                <div id="species-list" style="margin-bottom: 20px; max-height: 300px; overflow-y: auto;">
                    ${SPECIES_OPTIONS.map(
                      (species) => `
                        <div style="margin: 5px 0;">
                            <label style="display: flex; align-items: center; cursor: pointer; padding: 8px; border-radius: 5px; transition: background-color 0.2s;" 
                                onmouseover="this.style.backgroundColor='rgba(255,255,255,0.1)'" 
                                onmouseout="this.style.backgroundColor='transparent'">
                                <input type="radio" name="species" value="${species}" style="margin-right: 10px;">
                                <span>${species}</span>
                            </label>
                        </div>
                    `
                    ).join("")}
                </div>
                <div style="text-align: center;">
                    <button id="species-confirm" style="margin: 5px; padding: 10px 20px; font-size: 14px; background: white; color: #ff4500; border: none; border-radius: 5px; cursor: pointer;">Start Collecting</button>
                    <button id="species-cancel" style="margin: 5px; padding: 10px 20px; font-size: 14px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                </div>
            `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Handle confirm button
      document.getElementById("species-confirm").onclick = () => {
        const selectedRadio = document.querySelector(
          'input[name="species"]:checked'
        );
        if (selectedRadio) {
          const species = selectedRadio.value;
          setSelectedSpecies(species);
          setImageCount(0);
          sessionStorage.setItem(RUN_KEY, "true");

          log(`Selected species: ${species}`);

          // Remove modal
          overlay.remove();

          // Start the collection process
          startCollectionLoop();
        } else {
          alert("Please select a species first!");
        }
      };

      // Handle cancel button
      document.getElementById("species-cancel").onclick = () => {
        overlay.remove();
        log("Species selection cancelled");
      };

      // Handle ESC key
      document.addEventListener("keydown", function escHandler(event) {
        if (event.key === "Escape") {
          overlay.remove();
          document.removeEventListener("keydown", escHandler);
          log("Species selection cancelled");
        }
      });
    }

    function startCollectionLoop() {
      if (!isRunning()) return;

      const species = getSelectedSpecies();
      log(`🔄 Starting collection loop for ${species}...`);

      // Start the main collection process
      setTimeout(() => {
        if (isRunning()) {
          collectCurrentImage();
        }
      }, 100);
    }

    function collectCurrentImage() {
      if (!isRunning()) return;

      const species = getSelectedSpecies();
      const currentCount = incrementImageCount();
      const paddedCount = String(currentCount).padStart(4, "0");
      const filename = `${species}_${paddedCount}`;

      log(`📸 Collecting image ${currentCount} for ${species}...`);

      // Find the image element
      const imageElement = document.querySelector(
        "#visualizer > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.display > div > img"
      );

      if (!imageElement) {
        log(
          "❌ Image element not found. Make sure you are on the visualizer page."
        );
        stopBot();
        return;
      }

      // Get the image URL and download it
      const imageUrl = imageElement.src;
      if (imageUrl) {
        downloadImage(imageUrl, filename)
          .then(() => {
            log(`✅ Image saved as ${filename}`);

            // Wait a moment then click randomize button
            setTimeout(() => {
              if (isRunning()) {
                clickRandomizeButton();
              }
            }, 100);
          })
          .catch((error) => {
            log(`❌ Failed to save image: ${error}`);

            // Continue anyway
            setTimeout(() => {
              if (isRunning()) {
                clickRandomizeButton();
              }
            }, 100);
          });
      } else {
        log("❌ No image URL found");
        setTimeout(() => {
          if (isRunning()) {
            clickRandomizeButton();
          }
        }, 100);
      }
    }

    function downloadImage(url, filename) {
      return new Promise((resolve, reject) => {
        // Convert relative URL to absolute if needed
        const imageUrl = url.startsWith("//") ? `https:${url}` : url;

        GM_xmlhttpRequest({
          method: "GET",
          url: imageUrl,
          responseType: "blob",
          onload: function (response) {
            try {
              // Create blob URL
              const blob = response.response;
              const blobUrl = URL.createObjectURL(blob);

              // Create download link
              const downloadLink = document.createElement("a");
              downloadLink.href = blobUrl;
              downloadLink.download = `${filename}.jpg`;
              downloadLink.style.display = "none";

              // Add to document and click
              document.body.appendChild(downloadLink);
              downloadLink.click();

              // Clean up
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(blobUrl);

              resolve();
            } catch (error) {
              reject(error);
            }
          },
          onerror: function (error) {
            reject(error);
          },
        });
      });
    }

    function clickRandomizeButton() {
      if (!isRunning()) return;

      log("🎲 Clicking randomize button...");

      // Find the randomize button
      const randomizeButton = document.querySelector(
        "#visualizer > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.actions > div > div:nth-child(2) > button"
      );

      if (randomizeButton) {
        randomizeButton.click();
        log("✅ Randomize button clicked");

        // Wait for the new image to load, then collect it
        setTimeout(() => {
          if (isRunning()) {
            collectCurrentImage();
          }
        }, 100); // Wait for image to update
      } else {
        log(
          "❌ Randomize button not found. Make sure you are on the visualizer page."
        );
        stopBot();
      }
    }

    function main() {
      if (!isRunning()) return;

      // This module doesn't need URL-based navigation
      // It works on the current page where the user starts it
      log("🚀 Image Collector running...");
    }

    return { startBot, stopBot, main };
  })();
  // --- Genetic Profiler Module ---
  const GeneticProfiler = (function () {
    const RUN_KEY = "genetic_profiler_running";
    const PETS_KEY = "genetic_profiler_pets";
    const IDX_KEY = "genetic_profiler_index";
    const BASE_KEY = "genetic_profiler_base_href";
    const UL_KEY = "genetic_profiler_selected_ul";
    const COLORS_KEY = "genetic_profiler_target_colors";

    function log(...args) {
      console.log(
        "%c[GENETIC-PROFILER]",
        "background:#4b0082;color:#fff;",
        ...args
      );
    }

    function startBot() {
      log(
        "Starting Genetic Profiler - First, please enter target color values"
      );

      // Show color input modal
      showColorInputModal();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      sessionStorage.removeItem(COLORS_KEY);
      disableULSelection();
      log("Stopped Genetic Profiler");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function getTargetColors() {
      try {
        return JSON.parse(sessionStorage.getItem(COLORS_KEY)) || {};
      } catch {
        return {};
      }
    }

    function setTargetColors(colors) {
      sessionStorage.setItem(COLORS_KEY, JSON.stringify(colors));
    }

    function showColorInputModal() {
      // Create modal overlay
      const overlay = document.createElement("div");
      overlay.id = "genetic-profiler-color-overlay";
      overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.8);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;

      // Create modal content
      const modal = document.createElement("div");
      modal.style.cssText = `
                background: #4b0082;
                color: white;
                padding: 30px;
                border-radius: 10px;
                font-family: monospace;
                max-width: 500px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            `;

      modal.innerHTML = `
                <div style="margin-bottom: 20px; text-align: center;">
                    <h2 style="margin: 0 0 10px 0;">🧬 Genetic Profiler Setup</h2>
                    <p style="margin: 0; font-size: 14px;">Enter target hex color values (without #):</p>
                </div>
                <div style="margin-bottom: 20px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Eyes:</label>
                        <input type="text" id="target-eyes" placeholder="538EA2" style="width: 100%; padding: 8px; border: none; border-radius: 4px; font-family: monospace;" maxlength="6">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Body1:</label>
                        <input type="text" id="target-body1" placeholder="8C1C2C" style="width: 100%; padding: 8px; border: none; border-radius: 4px; font-family: monospace;" maxlength="6">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Body2:</label>
                        <input type="text" id="target-body2" placeholder="A4D9E5" style="width: 100%; padding: 8px; border: none; border-radius: 4px; font-family: monospace;" maxlength="6">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Extra1:</label>
                        <input type="text" id="target-extra1" placeholder="196F52" style="width: 100%; padding: 8px; border: none; border-radius: 4px; font-family: monospace;" maxlength="6">
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 5px;">Extra2:</label>
                        <input type="text" id="target-extra2" placeholder="383F7E" style="width: 100%; padding: 8px; border: none; border-radius: 4px; font-family: monospace;" maxlength="6">
                    </div>
                </div>
                <div style="text-align: center;">
                    <button id="colors-confirm" style="margin: 5px; padding: 10px 20px; font-size: 14px; background: white; color: #4b0082; border: none; border-radius: 5px; cursor: pointer;">Next: Select Pets</button>
                    <button id="colors-cancel" style="margin: 5px; padding: 10px 20px; font-size: 14px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">Cancel</button>
                </div>
            `;

      overlay.appendChild(modal);
      document.body.appendChild(overlay);

      // Handle confirm button
      document.getElementById("colors-confirm").onclick = () => {
        const eyes = document
          .getElementById("target-eyes")
          .value.trim()
          .replace("#", "");
        const body1 = document
          .getElementById("target-body1")
          .value.trim()
          .replace("#", "");
        const body2 = document
          .getElementById("target-body2")
          .value.trim()
          .replace("#", "");
        const extra1 = document
          .getElementById("target-extra1")
          .value.trim()
          .replace("#", "");
        const extra2 = document
          .getElementById("target-extra2")
          .value.trim()
          .replace("#", "");

        // Validate hex colors
        const hexPattern = /^[0-9A-Fa-f]{6}$/;
        if (
          !hexPattern.test(eyes) ||
          !hexPattern.test(body1) ||
          !hexPattern.test(body2) ||
          !hexPattern.test(extra1) ||
          !hexPattern.test(extra2)
        ) {
          alert(
            "Please enter valid 6-character hex color codes (e.g., 538EA2)"
          );
          return;
        }

        const colors = {
          eyes: eyes.toUpperCase(),
          body1: body1.toUpperCase(),
          body2: body2.toUpperCase(),
          extra1: extra1.toUpperCase(),
          extra2: extra2.toUpperCase(),
        };

        setTargetColors(colors);
        log("Target colors saved:", colors);

        // Store the current location as base
        sessionStorage.setItem(BASE_KEY, location.href);
        sessionStorage.setItem(RUN_KEY, "true");
        sessionStorage.setItem(IDX_KEY, "0");
        sessionStorage.removeItem(PETS_KEY);
        sessionStorage.removeItem(UL_KEY);

        // Remove modal
        overlay.remove();

        // Enable UL selection mode
        enableULSelection();
      };

      // Handle cancel button
      document.getElementById("colors-cancel").onclick = () => {
        overlay.remove();
        log("Color input cancelled");
      };

      // Handle ESC key
      document.addEventListener("keydown", function escHandler(event) {
        if (event.key === "Escape") {
          overlay.remove();
          document.removeEventListener("keydown", escHandler);
          log("Color input cancelled");
        }
      });
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "genetic-profiler-ul-selection-style";
      style.textContent = `
                .genetic-profiler-ul-highlight {
                    outline: 3px solid #4b0082 !important;
                    outline-offset: 2px !important;
                    cursor: pointer !important;
                    position: relative !important;
                }
                .genetic-profiler-ul-highlight::before {
                    content: "Click to select this list for genetic profiling";
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #4b0082;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 3px;
                    white-space: nowrap;
                    z-index: 10000;
                }
                .genetic-profiler-selection-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 9999;
                    pointer-events: none;
                }
                .genetic-profiler-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #4b0082;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
            `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "genetic-profiler-selection-overlay";
      overlay.id = "genetic-profiler-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "genetic-profiler-instruction";
      instruction.id = "genetic-profiler-instruction";
      instruction.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>🧬 Genetic Profiler</strong></div>
                <div>Hover over UL elements and click the one containing the pets you want to profile</div>
                <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
            `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById(
        "genetic-profiler-ul-selection-style"
      );
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("genetic-profiler-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById(
        "genetic-profiler-instruction"
      );
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("genetic-profiler-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      const ul = event.target;
      ul.classList.add("genetic-profiler-ul-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "genetic-profiler-debug-info";
      debugInfo.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #4b0082;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10002;
                max-width: 300px;
            `;

      const petLinks = ul.querySelectorAll('a.pet[href*="pet="]').length;
      const totalLis = ul.querySelectorAll("li").length;

      debugInfo.innerHTML = `
                <strong>🔍 UL Preview</strong><br>
                Total LIs: ${totalLis}<br>
                Pet Links: ${petLinks}<br>
                ${
                  petLinks > 0
                    ? "✅ Contains pet links!"
                    : "❌ No pet links found"
                }
            `;

      document.body.appendChild(debugInfo);
    }

    function handleULLeave(event) {
      event.target.classList.remove("genetic-profiler-ul-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("genetic-profiler-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class
      ul.classList.remove("genetic-profiler-ul-highlight");

      log(`Selected UL with ${ul.children.length} children`);

      // Clean up selection mode first
      disableULSelection();

      // Collect pets immediately from the selected UL
      collectPetsFromElement(ul);
    }

    function collectPetsFromElement(ul) {
      if (!isRunning()) return;

      log("Collecting pet links from selected UL");

      if (!ul) {
        log("No UL element provided");
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract pet links specifically
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        // Look for pet links
        var petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          const href = petLink.href;

          // Check if it's a pet profile link (not a user link)
          const isPetLink =
            href.includes("pet=") && href.includes("sub=profile");

          if (isPetLink) {
            petLinks.push(href);
            log(`Found pet link ${index + 1}: ${href}`);
          }
        }
      });

      if (!petLinks.length) {
        log("No pet links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Debug what we actually found
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${petLinks.length} pets to profile`);
      // reverse petLinks to profile in reverse order
      petLinks.reverse();
      savePets(petLinks);
      goToPet();
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets profiled! Genetic profiling complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`🧬 Going to profile pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    function hexToRgb(hex) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return { r, g, b };
    }

    function parseColorFromElement(element) {
      if (!element) return null;

      // Look for hex color in the text content
      const text = element.textContent || "";
      const hexMatch = text.match(/#([0-9A-Fa-f]{6})/);

      if (hexMatch) {
        return hexMatch[1].toUpperCase();
      }

      return null;
    }

    function calculateColorDifferences(targetColors, actualColors) {
      const differences = {};

      for (const [colorName, targetHex] of Object.entries(targetColors)) {
        const actualHex = actualColors[colorName];

        if (!actualHex) {
          differences[colorName] = "N/A";
          continue;
        }

        const targetRgb = hexToRgb(targetHex);
        const actualRgb = hexToRgb(actualHex);

        const rDiff = actualRgb.r - targetRgb.r;
        const gDiff = actualRgb.g - targetRgb.g;
        const bDiff = actualRgb.b - targetRgb.b;

        const formatDiff = (diff) => {
          if (diff > 0) return `+${diff}`;
          if (diff < 0) return `${diff}`;
          return "0";
        };

        differences[colorName] = `${formatDiff(rDiff)}, ${formatDiff(
          gDiff
        )}, ${formatDiff(bDiff)}`;
      }

      return differences;
    }

    function handlePetProfile() {
      if (!isRunning()) return;

      log("🔍 Analyzing pet colors...");

      setTimeout(() => {
        if (!isRunning()) return;

        // Find the colors fieldset
        const colorsFieldset = document.querySelector(
          "#profile > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.colors"
        );

        if (!colorsFieldset) {
          log("❌ Colors fieldset not found, skipping this pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
          return;
        }

        // Extract actual colors from the pet
        const actualColors = {};

        // Eyes color
        const eyesRow = colorsFieldset.querySelector("#Eyes");
        if (eyesRow) {
          const eyesColor = parseColorFromElement(
            eyesRow.querySelector("td.c1 var")
          );
          if (eyesColor) actualColors.eyes = eyesColor;
        }

        // Body colors
        const bodyRow = colorsFieldset.querySelector("#Body");
        if (bodyRow) {
          const body1Color = parseColorFromElement(
            bodyRow.querySelector("td.c1 var")
          );
          const body2Color = parseColorFromElement(
            bodyRow.querySelector("td.c2 var")
          );
          if (body1Color) actualColors.body1 = body1Color;
          if (body2Color) actualColors.body2 = body2Color;
        }

        // Extra colors
        const extraRow = colorsFieldset.querySelector("#Extra");
        if (extraRow) {
          const extra1Color = parseColorFromElement(
            extraRow.querySelector("td.c1 var")
          );
          const extra2Color = parseColorFromElement(
            extraRow.querySelector("td.c2 var")
          );
          if (extra1Color) actualColors.extra1 = extra1Color;
          if (extra2Color) actualColors.extra2 = extra2Color;
        }

        log("Actual colors found:", actualColors);

        // Calculate differences
        const targetColors = getTargetColors();
        const differences = calculateColorDifferences(
          targetColors,
          actualColors
        );

        log("Color differences:", differences);

        var sum_of_absolute_value_of_differences_per_color = [];
        // we want to make a sum row that shows the sum of the absolute value of the differences per color
        // example data:
        // Eyes: 1, -2, 3
        // Body1: -4, 5, 6
        // Body2: 7, -8, 9
        // Extra1: 0, 0, 0
        // Extra2: 0, 0, 0
        // example sum row of example data: Sum: 12, 15, 18
        // explanation of sum row:
        // 12 = 1 + |-4| + 7
        // 15 = |-2| + 5 + |-8|
        // 18 = 3 + 6 + 9
        // example is sum of the rgb columns of the below summaryLines
        for (const color in differences) {
          const diff = differences[color];
          if (diff === "N/A") {
            sum_of_absolute_value_of_differences_per_color.push("N/A");
            continue;
          }
          const rgbValues = diff
            .split(",")
            .map((v) => Math.abs(parseInt(v.trim(), 10)));
          if (sum_of_absolute_value_of_differences_per_color.length === 0) {
            sum_of_absolute_value_of_differences_per_color = rgbValues;
          } else {
            sum_of_absolute_value_of_differences_per_color =
              sum_of_absolute_value_of_differences_per_color.map(
                (sum, index) => {
                  return sum === "N/A" ? "N/A" : sum + rgbValues[index];
                }
              );
          }
        }
        log(
          "Sum of absolute value of differences per color:",
          sum_of_absolute_value_of_differences_per_color
        );
        // Add sum row to differences
        differences.sum = sum_of_absolute_value_of_differences_per_color
          .map((v) => (v === "N/A" ? "N/A" : v.toString()))
          .join(", ");
        // Create the summary text
        const summaryLines = [
          `Eyes: ${differences.eyes || "N/A"}`,
          `Body1: ${differences.body1 || "N/A"}`,
          `Body2: ${differences.body2 || "N/A"}`,
          `Extra1: ${differences.extra1 || "N/A"}`,
          `Extra2: ${differences.extra2 || "N/A"}`,
          "",
          `Sum: ${differences.sum || "N/A"}`,
        ];

        const summaryText = summaryLines.join("\n");

        log("Generated summary:", summaryText);

        // Now write this to the pet's description
        writeToDescription(summaryText);
      }, 500); // Wait for page to load
    }

    function writeToDescription(text) {
      if (!isRunning()) return;

      log("🖊️ Writing genetic profile to description...");

      // Try to find the description div (either regular or empty)
      let descDiv = document.querySelector(
        "#overview > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.presentation.edit_txt > div > div.parsed_txt"
      );

      if (!descDiv) {
        descDiv = document.querySelector(
          "#overview > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.presentation.edit_txt > div > div.parsed_txt.empty"
        );
      }

      if (!descDiv) {
        log("❌ Description div not found, skipping this pet");
        setIndex(getIndex() + 1);
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 300);
        return;
      }

      log("✅ Found description div, clicking to enable editing...");
      descDiv.click();

      // Wait for textarea to appear
      setTimeout(() => {
        if (!isRunning()) return;

        const textarea = document.querySelector(
          "#overview > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.presentation.edit_txt > div > div.ui-input.are > textarea"
        );

        if (!textarea) {
          log("❌ Textarea not found after clicking description div");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
          return;
        }

        log("✅ Found textarea, writing genetic profile...");

        // Get existing text and append our analysis
        const existingText = textarea.value || "";
        const newText = existingText
          ? `${existingText}\n\n--- Genetic Profile ---\n${text}`
          : `--- Genetic Profile ---\n${text}`;

        // Clear and write new text
        textarea.value = "";
        textarea.focus();
        textarea.value = newText;

        // Trigger events to ensure change is registered
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
        textarea.dispatchEvent(new Event("change", { bubbles: true }));

        log("📝 Genetic profile written to description");

        // Wait a moment then save the description
        setTimeout(() => {
          if (isRunning()) {
            saveDescription();
          }
        }, 300);
      }, 500);
    }

    function saveDescription() {
      if (!isRunning()) return;

      log("💾 Saving description...");

      // Find the save UL
      const saveUL = document.querySelector(
        "#overview > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.overview > div > ul"
      );

      if (!saveUL) {
        log("❌ Save UL not found");
        setIndex(getIndex() + 1);
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 300);
        return;
      }

      log("✅ Found save UL, clicking to save...");
      saveUL.click();

      log("🎉 Pet genetic profile saved! Moving to next pet...");

      // Move to next pet
      setTimeout(() => {
        if (isRunning()) {
          setIndex(getIndex() + 1);
          goToPet();
        }
      }, 500);
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Genetic Profiler main executing...", href);

      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        log("📍 On pet profile, analyzing genetic data");
        setTimeout(() => {
          if (isRunning()) {
            handlePetProfile();
          }
        }, 300);
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        setTimeout(() => {
          if (isRunning()) {
            // Re-enable UL selection
            enableULSelection();
          }
        }, 300);
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 300);
      }
      // If we're on a different page
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to next pet");
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 300);
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // --- Feeder Module ---
  const Feeder = (function () {
    const RUN_KEY = "feeder_running";
    const PETS_KEY = "feeder_pets";
    const IDX_KEY = "feeder_index";
    const BASE_KEY = "feeder_base_href";
    const UL_KEY = "feeder_selected_ul";

    function log(...args) {
      console.log("%c[FEEDER]", "background:#32cd32;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Feeder - Please click on the UL element containing the pets to feed"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.removeItem(PETS_KEY);
      sessionStorage.removeItem(UL_KEY);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      disableULSelection();
      log("Stopped Feeder");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "feeder-ul-selection-style";
      style.textContent = `
                .feeder-ul-highlight {
                    outline: 3px solid #32cd32 !important;
                    outline-offset: 2px !important;
                    cursor: pointer !important;
                    position: relative !important;
                }
                .feeder-ul-highlight::before {
                    content: "Click to select this list for feeding";
                    position: absolute;
                    top: -25px;
                    left: 0;
                    background: #32cd32;
                    color: white;
                    padding: 2px 8px;
                    font-size: 12px;
                    border-radius: 3px;
                    white-space: nowrap;
                    z-index: 10000;
                }
                .feeder-selection-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.3);
                    z-index: 9999;
                    pointer-events: none;
                }
                .feeder-instruction {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #32cd32;
                    color: white;
                    padding: 20px;
                    border-radius: 8px;
                    font-family: monospace;
                    font-size: 16px;
                    z-index: 10001;
                    text-align: center;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
                }
            `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "feeder-selection-overlay";
      overlay.id = "feeder-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "feeder-instruction";
      instruction.id = "feeder-instruction";
      instruction.innerHTML = `
                <div style="margin-bottom: 10px;"><strong>🍖 Feeder Setup</strong></div>
                <div>Hover over UL elements and click the one containing the pets you want to feed</div>
                <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
            `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("feeder-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("feeder-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("feeder-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("feeder-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      const ul = event.target;
      ul.classList.add("feeder-ul-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "feeder-debug-info";
      debugInfo.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #32cd32;
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 10002;
                max-width: 300px;
            `;

      const petLinks = ul.querySelectorAll('a.pet[href*="pet="]').length;
      const totalLis = ul.querySelectorAll("li").length;

      debugInfo.innerHTML = `
                <strong>🔍 UL Preview</strong><br>
                Total LIs: ${totalLis}<br>
                Pet Links: ${petLinks}<br>
                ${
                  petLinks > 0
                    ? "✅ Contains pet links!"
                    : "❌ No pet links found"
                }
            `;

      document.body.appendChild(debugInfo);
    }

    function handleULLeave(event) {
      event.target.classList.remove("feeder-ul-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("feeder-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class
      ul.classList.remove("feeder-ul-highlight");

      log(`Selected UL with ${ul.children.length} children`);

      // Clean up selection mode first
      disableULSelection();

      // Collect pets immediately from the selected UL
      collectPetsFromElement(ul);
    }

    function collectPetsFromElement(ul) {
      if (!isRunning()) return;

      log("Collecting pet links from selected UL");

      if (!ul) {
        log("No UL element provided");
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract pet links specifically
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        // Look for pet links
        const petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          const href = petLink.href;

          // Check if it's a pet profile link (not a user link)
          const isPetLink =
            href.includes("pet=") && href.includes("sub=profile");

          if (isPetLink) {
            petLinks.push(href);
            log(`Found pet link ${index + 1}: ${href}`);
          }
        }
      });

      if (!petLinks.length) {
        log("No pet links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Debug what we actually found
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${petLinks.length} pets to feed`);
      savePets(petLinks);
      goToPet();
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets fed! Feeding complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`🍖 Going to feed pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    function handlePetProfile() {
      if (!isRunning()) return;

      log("🔍 Looking for feeding button on pet profile...");
      let tries = 0;
      const maxTries = 5;

      const tryFeedButton = () => {
        // Look for feeding button with the specific onclick pattern
        const feedBtn = document.querySelector('button[onclick*="pet_feed"]');

        if (feedBtn) {
          log("✅ Found feeding button, clicking...");
          feedBtn.click();
          log("🍖 Pet fed successfully! Moving to next pet...");

          // Move to next pet with minimal delay
          setTimeout(() => {
            if (isRunning()) {
              setIndex(getIndex() + 1);
              goToPet();
            }
          }, 250);
        } else if (tries++ < maxTries) {
          log(
            `⏳ Feeding button not found, retrying... (${tries}/${maxTries})`
          );
          setTimeout(tryFeedButton, 50);
        } else {
          log("❌ No feeding button found, moving to next pet");
          setIndex(getIndex() + 1);
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 50);
        }
      };

      // Start looking for button with minimal delay
      setTimeout(tryFeedButton, 100);
    }

    function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Feeder main executing...", href);

      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        log("📍 On pet profile, looking for feeding button");
        setTimeout(() => {
          if (isRunning()) {
            handlePetProfile();
          }
        }, 50);
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        setTimeout(() => {
          if (isRunning()) {
            // Re-enable UL selection
            enableULSelection();
          }
        }, 50);
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        setTimeout(() => {
          if (isRunning()) {
            goToPet();
          }
        }, 50);
      }
      // If we're on a different page
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to next pet");
          setTimeout(() => {
            if (isRunning()) {
              goToPet();
            }
          }, 50);
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // ...existing code...

  // --- Hatcher Module ---
  const Hatcher = (function () {
    const RUN_KEY = "hatcher_running";
    const PETS_KEY = "hatcher_pets";
    const IDX_KEY = "hatcher_index";
    const BASE_KEY = "hatcher_base_href";
    const UL_KEY = "hatcher_selected_ul";

    function log(...args) {
      console.log("%c[HATCHER]", "background:#ffa500;color:#fff;", ...args);
    }

    async function waitForPageLoad() {
      // Initial short wait for DOM
      await new Promise((r) => setTimeout(r, 100));

      // Wait until loading div disappears
      while (document.querySelector("div.loading")) {
        log("⏳ Waiting for page to load...");
        await new Promise((r) => setTimeout(r, 100));
      }
    }

    function startBot() {
      log(
        "Starting Hatcher - Please click on the UL element containing the pets to hatch"
      );

      // Store the current location as base
      sessionStorage.setItem(BASE_KEY, location.href);
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(IDX_KEY, "0");
      sessionStorage.removeItem(PETS_KEY);
      sessionStorage.removeItem(UL_KEY);

      // Enable UL selection mode
      enableULSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(UL_KEY);
      disableULSelection();
      log("Stopped Hatcher");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBase() {
      return sessionStorage.getItem(BASE_KEY);
    }

    function getPets() {
      try {
        return JSON.parse(sessionStorage.getItem(PETS_KEY)) || [];
      } catch {
        return [];
      }
    }

    function savePets(pets) {
      sessionStorage.setItem(PETS_KEY, JSON.stringify(pets));
    }

    function getIndex() {
      return parseInt(sessionStorage.getItem(IDX_KEY) || "0", 10);
    }

    function setIndex(i) {
      sessionStorage.setItem(IDX_KEY, String(i));
    }

    function getSelectedUL() {
      return sessionStorage.getItem(UL_KEY);
    }

    function setSelectedUL(selector) {
      sessionStorage.setItem(UL_KEY, selector);
    }

    function enableULSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "hatcher-ul-selection-style";
      style.textContent = `
      .hatcher-ul-highlight {
        outline: 3px solid #ffa500 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
        position: relative !important;
      }
      .hatcher-ul-highlight::before {
        content: "Click to select this list for hatching";
        position: absolute;
        top: -25px;
        left: 0;
        background: #ffa500;
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 3px;
        white-space: nowrap;
        z-index: 10000;
      }
      .hatcher-selection-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 9999;
        pointer-events: none;
      }
      .hatcher-instruction {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ffa500;
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 16px;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      }
    `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "hatcher-selection-overlay";
      overlay.id = "hatcher-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "hatcher-instruction";
      instruction.id = "hatcher-instruction";
      instruction.innerHTML = `
      <div style="margin-bottom: 10px;"><strong>🥚 Hatcher Setup</strong></div>
      <div>Hover over UL elements and click the one containing the pets you want to hatch</div>
      <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
    `;
      document.body.appendChild(instruction);

      // Find all UL elements and add hover effects
      const uls = document.querySelectorAll("ul");

      uls.forEach((ul) => {
        ul.addEventListener("mouseenter", handleULHover);
        ul.addEventListener("mouseleave", handleULLeave);
        ul.addEventListener("click", handleULClick);
      });

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);

      log(
        `Found ${uls.length} UL elements - hover to highlight, click to select`
      );
    }

    function disableULSelection() {
      // Remove style
      const style = document.getElementById("hatcher-ul-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("hatcher-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("hatcher-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all ULs
      const uls = document.querySelectorAll("ul");
      uls.forEach((ul) => {
        ul.removeEventListener("mouseenter", handleULHover);
        ul.removeEventListener("mouseleave", handleULLeave);
        ul.removeEventListener("click", handleULClick);
        ul.classList.remove("hatcher-ul-highlight");
      });

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleULHover(event) {
      const ul = event.target;
      ul.classList.add("hatcher-ul-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "hatcher-debug-info";
      debugInfo.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ffa500;
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10002;
      max-width: 300px;
    `;

      const petLinks = ul.querySelectorAll('a.pet[href*="pet="]').length;
      const totalLis = ul.querySelectorAll("li").length;

      debugInfo.innerHTML = `
      <strong>🔍 UL Preview</strong><br>
      Total LIs: ${totalLis}<br>
      Pet Links: ${petLinks}<br>
      ${petLinks > 0 ? "✅ Contains pet links!" : "❌ No pet links found"}
    `;

      document.body.appendChild(debugInfo);
    }

    function handleULLeave(event) {
      event.target.classList.remove("hatcher-ul-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("hatcher-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    function handleULClick(event) {
      event.preventDefault();
      event.stopPropagation();

      const ul = event.target;

      // Remove highlight class
      ul.classList.remove("hatcher-ul-highlight");

      log(`Selected UL with ${ul.children.length} children`);

      // Clean up selection mode first
      disableULSelection();

      // Collect pets immediately from the selected UL
      collectPetsFromElement(ul);
    }

    function collectPetsFromElement(ul) {
      if (!isRunning()) return;

      log("Collecting pet links from selected UL");

      if (!ul) {
        log("No UL element provided");
        stopBot();
        return;
      }

      log(`Found UL element with ${ul.children.length} child elements`);

      // Extract pet links specifically
      const petLinks = [];
      const lis = ul.querySelectorAll("li");

      log(`Scanning ${lis.length} li elements for pet links...`);

      lis.forEach((li, index) => {
        // Look for pet links
        const petLink =
          li.querySelector('a.pet[href*="pet="]') ||
          li.querySelector('a[href*="pet="]') ||
          li.querySelector('a[href*="sub=profile"]');

        if (petLink && petLink.href) {
          const href = petLink.href;

          // Check if it's a pet profile link (not a user link)
          const isPetLink =
            href.includes("pet=") && href.includes("sub=profile");

          if (isPetLink) {
            petLinks.push(href);
            log(`Found pet link ${index + 1}: ${href}`);
          }
        }
      });

      if (!petLinks.length) {
        log("No pet links found in selected UL");
        log("UL HTML preview:", ul.innerHTML.substring(0, 500));

        // Debug what we actually found
        log("Debug: Found links in UL:");
        const allLinks = ul.querySelectorAll("a");
        allLinks.forEach((link, i) => {
          log(`  Link ${i + 1}: href="${link.href}" class="${link.className}"`);
        });

        stopBot();
        return;
      }

      log(`Found ${petLinks.length} pets to hatch`);
      savePets(petLinks);
      goToPet();
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Selection cancelled");
        stopBot();
      }
    }

    async function goToPet() {
      if (!isRunning()) return;

      const pets = getPets();
      const idx = getIndex();

      if (idx >= pets.length) {
        log("All pets processed! Hatching complete!");
        stopBot();
        location.href = getBase();
        return;
      }

      log(`🥚 Going to hatch pet ${idx + 1}/${pets.length}...`);
      location.href = pets[idx];
    }

    async function handlePetProfile() {
      if (!isRunning()) return;

      log("🔍 Looking for hatch egg button on pet profile...");

      // Wait for page to fully load
      await waitForPageLoad();

      let tries = 0;
      const maxTries = 0;

      const tryHatchButton = async () => {
        if (!isRunning()) return;

        // Look for button with "Hatch Egg" text using the base selector
        const buttons = document.querySelectorAll(
          "#profile > div > form > fieldset.ui-fieldset.ui-widget-content.ui-corner-all.actions > div > div > button"
        );

        let hatchBtn = null;
        for (let btn of buttons) {
          if (btn.textContent.trim().includes("Hatch Egg")) {
            hatchBtn = btn;
            break;
          }
        }

        if (hatchBtn) {
          log("✅ Found hatch egg button, clicking...");
          hatchBtn.click();
          log("🥚 Egg hatched successfully! Moving to next pet...");

          // Wait for any page updates
          await waitForPageLoad();

          // Move to next pet
          setIndex(getIndex() + 1);
          await new Promise((r) => setTimeout(r, 100));
          if (isRunning()) {
            goToPet();
          }
        } else if (tries++ < maxTries) {
          log(
            `⏳ Hatch egg button not found, retrying... (${tries}/${maxTries})`
          );
          await new Promise((r) => setTimeout(r, 100));
          return await tryHatchButton();
        } else {
          log("❌ No hatch egg button found, moving to next pet");
          setIndex(getIndex() + 1);
          await new Promise((r) => setTimeout(r, 100));
          if (isRunning()) {
            goToPet();
          }
        }
      };

      // Start looking for button
      await tryHatchButton();
    }

    async function main() {
      if (!isRunning()) return;

      const href = location.href;
      const base = getBase();

      log("🚀 Hatcher main executing...", href);

      // If we're on a pet profile page
      if (href.includes("sub=profile") && href.includes("pet=")) {
        log("📍 On pet profile, looking for hatch egg button");
        await handlePetProfile();
      }
      // If we're back at the base page and haven't collected pets yet
      else if (href === base && !sessionStorage.getItem(PETS_KEY)) {
        log("📍 At base, need to collect pets");
        await new Promise((r) => setTimeout(r, 100));
        if (isRunning()) {
          // Re-enable UL selection
          enableULSelection();
        }
      }
      // If we're back at the base page and have pets collected
      else if (href === base) {
        log("📍 At base, have pets, continuing...");
        await new Promise((r) => setTimeout(r, 100));
        if (isRunning()) {
          goToPet();
        }
      }
      // If we're on a different page
      else {
        const pets = getPets();
        if (pets.length > 0) {
          log("📍 On different page, going to next pet");
          await new Promise((r) => setTimeout(r, 100));
          if (isRunning()) {
            goToPet();
          }
        } else {
          log("📍 No pets collected, returning to base");
          location.href = base;
        }
      }
    }

    return { startBot, stopBot, main };
  })();
  // Add this after the other modules (before createControls function)

  // --- Bidder Module ---
  // Replace the existing Bidder module with this updated version:

  // --- Bidder Module ---
  // --- Bidder Module ---
  const Bidder = (function () {
    const RUN_KEY = "bidder_running";
    const BID_COUNT_KEY = "bidder_bid_count";
    const SELECTED_BUTTON_KEY = "bidder_selected_button";

    let retryTimeout = null;

    function log(...args) {
      console.log("%c[BIDDER]", "background:#ff6b35;color:#fff;", ...args);
    }

    function startBot() {
      log(
        "Starting Bidder - Please click on the Place Bid button you want to use"
      );
      sessionStorage.setItem(RUN_KEY, "true");
      sessionStorage.setItem(BID_COUNT_KEY, "0");
      sessionStorage.removeItem(SELECTED_BUTTON_KEY);
      clearTimeout(retryTimeout);

      // Enable button selection mode
      enableButtonSelection();
    }

    function stopBot() {
      sessionStorage.removeItem(RUN_KEY);
      sessionStorage.removeItem(BID_COUNT_KEY);
      sessionStorage.removeItem(SELECTED_BUTTON_KEY);
      clearTimeout(retryTimeout);
      disableButtonSelection();
      log("Stopped Bidder");
    }

    function isRunning() {
      return sessionStorage.getItem(RUN_KEY) === "true";
    }

    function getBidCount() {
      return parseInt(sessionStorage.getItem(BID_COUNT_KEY) || "0", 10);
    }

    function incrementBidCount() {
      const count = getBidCount() + 1;
      sessionStorage.setItem(BID_COUNT_KEY, String(count));
      return count;
    }

    function getSelectedButton() {
      return sessionStorage.getItem(SELECTED_BUTTON_KEY);
    }

    function setSelectedButton(selector) {
      sessionStorage.setItem(SELECTED_BUTTON_KEY, selector);
    }
    function findSelectedBidButton() {
      const buttonSelector = getSelectedButton();
      if (!buttonSelector) return null;

      let bidButton = null;

      // Handle text-based selectors
      if (buttonSelector.startsWith("TEXT:")) {
        const targetText = buttonSelector.substring(5); // Remove "TEXT:" prefix
        const allButtons = document.querySelectorAll("button");
        bidButton = Array.from(allButtons).find(
          (btn) => btn.textContent.trim() === targetText
        );
        log(`Looking for button with text: "${targetText}"`);
      } else {
        // Handle regular CSS selectors
        const selectedElement = document.querySelector(buttonSelector);

        if (selectedElement) {
          // If we selected a span inside a button, get the button
          if (
            selectedElement.tagName === "SPAN" &&
            selectedElement.parentElement &&
            selectedElement.parentElement.tagName === "BUTTON"
          ) {
            bidButton = selectedElement.parentElement;
            log("Found span inside button, using parent button");
          } else if (selectedElement.tagName === "BUTTON") {
            bidButton = selectedElement;
            log("Found button directly");
          } else {
            // Look for a button within the selected element
            bidButton = selectedElement.querySelector("button");
            if (bidButton) {
              log("Found button within selected element");
            }
          }
        }
      }

      return bidButton;
    }

    function enableButtonSelection() {
      // Create visual indicators
      const style = document.createElement("style");
      style.id = "bidder-button-selection-style";
      style.textContent = `
      .bidder-button-highlight {
        outline: 3px solid #ff6b35 !important;
        outline-offset: 2px !important;
        cursor: pointer !important;
        position: relative !important;
        z-index: 10001 !important;
      }
      .bidder-button-highlight::before {
        content: "Click to select this bid button";
        position: absolute;
        top: -25px;
        left: 0;
        background: #ff6b35;
        color: white;
        padding: 2px 8px;
        font-size: 12px;
        border-radius: 3px;
        white-space: nowrap;
        z-index: 10002;
        pointer-events: none;
      }
      .bidder-selection-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.3);
        z-index: 9999;
        pointer-events: none;
      }
      .bidder-instruction {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff6b35;
        color: white;
        padding: 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 16px;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5);
      }
    `;
      document.head.appendChild(style);

      // Create overlay
      const overlay = document.createElement("div");
      overlay.className = "bidder-selection-overlay";
      overlay.id = "bidder-overlay";
      document.body.appendChild(overlay);

      // Create instruction
      const instruction = document.createElement("div");
      instruction.className = "bidder-instruction";
      instruction.id = "bidder-instruction";
      instruction.innerHTML = `
      <div style="margin-bottom: 10px;"><strong>🔨 Bidder Setup</strong></div>
      <div>Hover over buttons and click the "Place Bid" button you want to use</div>
      <div style="margin-top: 10px; font-size: 12px;">Press ESC to cancel</div>
    `;
      document.body.appendChild(instruction);

      // Find all potential bid buttons using proper CSS selectors
      const allButtons = document.querySelectorAll("button");
      const potentialBidButtons = Array.from(allButtons).filter((btn) => {
        const text = btn.textContent.toLowerCase();
        const onclick = btn.onclick?.toString() || "";

        return (
          text.includes("bid") ||
          text.includes("place bid") ||
          onclick.includes("bid") ||
          onclick.includes("auction")
        );
      });

      log(
        `Found ${potentialBidButtons.length} potential bid buttons - hover to highlight, click to select`
      );

      // Store original handlers for all buttons
      const originalHandlers = new Map();

      potentialBidButtons.forEach((button) => {
        // Store original onclick handler
        if (button.onclick) {
          originalHandlers.set(button, button.onclick);
          button.onclick = null;
        }

        // Add our event listeners
        button.addEventListener("mouseenter", handleButtonHover);
        button.addEventListener("mouseleave", handleButtonLeave);
        button.addEventListener("click", function (event) {
          handleButtonClick(event, originalHandlers);
        });
      });

      // Store handlers map globally for cleanup
      window.bidderOriginalHandlers = originalHandlers;

      // ESC to cancel
      document.addEventListener("keydown", handleEscapeKey);
    }

    function handleButtonHover(event) {
      const button = event.target;
      button.classList.add("bidder-button-highlight");

      // Add debug info overlay
      const debugInfo = document.createElement("div");
      debugInfo.id = "bidder-debug-info";
      debugInfo.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: #ff6b35;
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-family: monospace;
      font-size: 12px;
      z-index: 10002;
      max-width: 300px;
    `;

      const buttonText = button.textContent.trim();
      const hasOnclick = button.onclick ? "Yes" : "No";
      const onclickText = button.onclick?.toString().substring(0, 50) || "None";

      debugInfo.innerHTML = `
      <strong>🔍 Button Preview</strong><br>
      Text: "${buttonText}"<br>
      Has onclick: ${hasOnclick}<br>
      Onclick: ${onclickText}...<br>
      ${
        buttonText.toLowerCase().includes("bid")
          ? "✅ Contains 'bid'!"
          : "❓ Check if this is correct"
      }
    `;

      document.body.appendChild(debugInfo);
    }

    function handleButtonLeave(event) {
      event.target.classList.remove("bidder-button-highlight");

      // Remove debug info
      const debugInfo = document.getElementById("bidder-debug-info");
      if (debugInfo) debugInfo.remove();
    }

    function handleButtonClick(event, originalHandlers) {
      // Prevent the original button action
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      const button = event.target;

      // Remove highlight class
      button.classList.remove("bidder-button-highlight");

      log(`Selected button: "${button.textContent.trim()}"`);

      // Generate a unique selector for this button
      const selector = generateUniqueSelector(button);
      log(`Generated selector: ${selector}`);

      setSelectedButton(selector);

      // Clean up selection mode IMMEDIATELY
      disableButtonSelection();

      // Start the bidding process after a short delay
      setTimeout(() => {
        if (isRunning()) {
          attemptBid();
        }
      }, 100);

      return false;
    }

    function disableButtonSelection() {
      // Remove style
      const style = document.getElementById("bidder-button-selection-style");
      if (style) style.remove();

      // Remove overlay and instruction
      const overlay = document.getElementById("bidder-overlay");
      if (overlay) overlay.remove();

      const instruction = document.getElementById("bidder-instruction");
      if (instruction) instruction.remove();

      // Remove event listeners from all buttons and restore original handlers
      const allButtons = document.querySelectorAll("button");
      const originalHandlers = window.bidderOriginalHandlers;

      allButtons.forEach((button) => {
        button.removeEventListener("mouseenter", handleButtonHover);
        button.removeEventListener("mouseleave", handleButtonLeave);
        button.classList.remove("bidder-button-highlight");

        // Restore original onclick handler if we stored one
        if (originalHandlers && originalHandlers.has(button)) {
          button.onclick = originalHandlers.get(button);
        }
      });

      // Clean up global storage
      if (window.bidderOriginalHandlers) {
        delete window.bidderOriginalHandlers;
      }

      document.removeEventListener("keydown", handleEscapeKey);
    }

    function handleEscapeKey(event) {
      if (event.key === "Escape") {
        log("Button selection cancelled");
        stopBot();
      }
    }

    function generateUniqueSelector(element) {
      // If we clicked on a span inside a button, get the button instead
      let targetElement = element;
      if (
        element.tagName === "SPAN" &&
        element.parentElement &&
        element.parentElement.tagName === "BUTTON"
      ) {
        targetElement = element.parentElement;
        log("Adjusted target from span to parent button");
      }

      // Try ID first - but validate it's a proper CSS ID
      if (targetElement.id) {
        // Check if ID starts with a digit (invalid CSS selector)
        if (!/^[a-zA-Z_]/.test(targetElement.id)) {
          // Use attribute selector instead for numeric IDs
          const escapedId = targetElement.id.replace(
            /[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,
            "\\$&"
          );
          const selector = `[id="${escapedId}"]`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        } else {
          return `#${targetElement.id}`;
        }
      }

      // Try class combination
      if (targetElement.className) {
        const classes = targetElement.className
          .split(" ")
          .filter((c) => c.trim() && c !== "bidder-button-highlight");
        if (classes.length > 0) {
          let selector = `button.${classes.join(".")}`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        }
      }

      // Try parent-child relationship
      let parent = targetElement.parentElement;
      if (parent) {
        let parentSelector = "";

        // Handle parent ID (with same validation)
        if (parent.id) {
          if (!/^[a-zA-Z_]/.test(parent.id)) {
            const escapedId = parent.id.replace(
              /[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,
              "\\$&"
            );
            parentSelector = `[id="${escapedId}"]`;
          } else {
            parentSelector = `#${parent.id}`;
          }

          const selector = `${parentSelector} > button`;
          if (document.querySelectorAll(selector).length === 1) {
            return selector;
          }
        }

        // Try parent class
        if (parent.className) {
          const classes = parent.className.split(" ").filter((c) => c.trim());
          if (classes.length > 0) {
            let selector = `.${classes.join(".")} > button`;
            if (document.querySelectorAll(selector).length === 1) {
              return selector;
            }
          }
        }
      }

      // Try onclick attribute matching
      if (targetElement.onclick) {
        const onclickStr = targetElement.onclick.toString();
        if (onclickStr.includes("auction_bid")) {
          return 'button[onclick*="auction_bid"]';
        }
      }

      // Text content-based selector (store text, not CSS selector)
      const buttonText = targetElement.textContent.trim();
      if (buttonText) {
        const buttonsWithSameText = Array.from(
          document.querySelectorAll("button")
        ).filter((btn) => btn.textContent.trim() === buttonText);

        if (buttonsWithSameText.length === 1) {
          // Return a special text-based identifier
          return `TEXT:${buttonText}`;
        }
      }

      // Position-based selector as fallback
      const siblings = Array.from(targetElement.parentElement?.children || []);
      const buttonSiblings = siblings.filter((el) => el.tagName === "BUTTON");

      if (buttonSiblings.length > 1) {
        const index = buttonSiblings.indexOf(targetElement) + 1;
        if (parent) {
          let parentSelector = "";

          if (parent.id) {
            if (!/^[a-zA-Z_]/.test(parent.id)) {
              const escapedId = parent.id.replace(
                /[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,
                "\\$&"
              );
              parentSelector = `[id="${escapedId}"]`;
            } else {
              parentSelector = `#${parent.id}`;
            }
            return `${parentSelector} button:nth-of-type(${index})`;
          }

          if (parent.className) {
            const classes = parent.className.split(" ").filter((c) => c.trim());
            if (classes.length > 0) {
              return `.${classes.join(".")} button:nth-of-type(${index})`;
            }
          }
        }
      }

      // Final fallback: XPath-like approach but ensure we target the button
      function getElementPath(el) {
        if (el.id) {
          if (!/^[a-zA-Z_]/.test(el.id)) {
            const escapedId = el.id.replace(
              /[!"#$%&'()*+,.\/:;<=>?@[\\\]^`{|}~]/g,
              "\\$&"
            );
            return `[id="${escapedId}"]`;
          } else {
            return `#${el.id}`;
          }
        }
        if (el === document.body) return "body";

        const parent = el.parentElement;
        if (!parent) return el.tagName.toLowerCase();

        const siblings = Array.from(parent.children);
        const sameTagSiblings = siblings.filter(
          (sibling) => sibling.tagName === el.tagName
        );

        if (sameTagSiblings.length === 1) {
          return `${getElementPath(parent)} > ${el.tagName.toLowerCase()}`;
        } else {
          const index = sameTagSiblings.indexOf(el) + 1;
          return `${getElementPath(
            parent
          )} > ${el.tagName.toLowerCase()}:nth-of-type(${index})`;
        }
      }

      return getElementPath(targetElement);
    }

    function attemptBid() {
      if (!isRunning()) return;

      const bidCount = getBidCount();
      const buttonSelector = getSelectedButton();

      if (!buttonSelector) {
        log("❌ No button selected");
        stopBot();
        return;
      }

      log(`Bid attempt #${bidCount + 1} - Looking for selected bid button...`);

      const bidButton = findSelectedBidButton();

      if (!bidButton) {
        log(
          `❌ Selected bid button not found with selector: ${buttonSelector}`
        );
        stopBot();
        return;
      }

      log("✅ Found selected bid button, clicking...");

      // Make sure we're clicking the actual button element
      if (bidButton.tagName === "BUTTON") {
        bidButton.click();
      } else {
        log("❌ Found element is not a button");
        stopBot();
        return;
      }

      incrementBidCount();

      // Wait for confirmation dialog
      setTimeout(() => {
        if (isRunning()) {
          handleBidConfirmation();
        }
      }, 100);
    }

    function handleBidConfirmation() {
      if (!isRunning()) return;

      log("🔍 Looking for bid confirmation dialog...");

      // Look for the Ok button in the confirmation dialog
      const okButton = document.querySelector(
        ".ui-dialog-buttonset button.ui-button"
      );

      if (!okButton) {
        log("❌ No confirmation dialog found, retrying bid...");
        setTimeout(() => {
          if (isRunning()) {
            attemptBid();
          }
        }, 250);
        return;
      }

      log("✅ Found confirmation dialog, clicking Ok...");
      okButton.click();

      // Wait for result dialog
      setTimeout(() => {
        if (isRunning()) {
          handleBidResult();
        }
      }, 250);
    }

    function handleBidResult() {
      if (!isRunning()) return;

      log("🔍 Checking bid result...");

      // Look for the result dialog
      const dialogContent = document.querySelector("#dialog.ui-dialog-content");

      if (!dialogContent) {
        log("❌ No result dialog found, retrying bid...");
        setTimeout(() => {
          if (isRunning()) {
            attemptBid();
          }
        }, 250);
        return;
      }

      const dialogText = dialogContent.textContent.trim();
      log(`Dialog text: "${dialogText}"`);

      // Check what type of result we got
      if (dialogText.includes("You were outbid")) {
        log("🔄 Outbid! Closing dialog and trying again...");
        handleOutbid();
      } else if (dialogText.includes("You don't have enough Credits")) {
        log("💰 Out of credits! Waiting 30 seconds before retry...");
        handleOutOfCredits();
      } else {
        log(`❓ Unknown dialog result: "${dialogText}"`);
        // Try to close any dialog and retry
        closeDialog();
        setTimeout(() => {
          if (isRunning()) {
            attemptBid();
          }
        }, 1000);
      }
    }

    function handleOutbid() {
      if (!isRunning()) return;

      // Close the outbid dialog
      closeDialog();

      // Immediate retry
      setTimeout(() => {
        if (isRunning()) {
          attemptBid();
        }
      }, 250);
    }

    function handleOutOfCredits() {
      if (!isRunning()) return;

      // Close the credits dialog
      closeDialog();

      // Wait 30 seconds before retry
      log("⏰ Waiting 30 seconds for more credits...");
      retryTimeout = setTimeout(() => {
        if (isRunning()) {
          log("🔄 Retrying after credit wait...");
          attemptBid();
        }
      }, 30000);
    }

    function closeDialog() {
      // Try multiple selectors to find and click the Ok button
      const okSelectors = [
        ".ui-dialog-buttonset button.ui-button",
        ".ui-dialog-buttonpane button.ui-button",
        '.ui-dialog button[type="button"]:last-child',
      ];

      for (const selector of okSelectors) {
        const okButton = document.querySelector(selector);
        if (okButton && okButton.textContent.trim() === "Ok") {
          log("✅ Closing dialog...");
          okButton.click();
          return true;
        }
      }

      // Fallback: try to find any Ok button
      const allButtons = document.querySelectorAll("button.ui-button");
      for (const button of allButtons) {
        if (button.textContent.trim() === "Ok") {
          log("✅ Found Ok button, closing dialog...");
          button.click();
          return true;
        }
      }

      log("❌ Could not find Ok button to close dialog");
      return false;
    }

    function main() {
      if (!isRunning()) return;

      log("🚀 Bidder main executing...");

      // Check if we're on an auction page
      if (!location.href.includes("auction=")) {
        log("❌ Not on auction page, stopping bidder");
        stopBot();
        return;
      }

      // Check if we have a selected button
      const selectedButton = getSelectedButton();
      if (!selectedButton) {
        log("📍 No button selected, please select a bid button");
        return;
      }

      // If we don't have any pending operations, start bidding
      const hasDialog = document.querySelector(".ui-dialog");
      if (!hasDialog) {
        log("📍 No active dialogs, starting bid attempt...");
        setTimeout(() => {
          if (isRunning()) {
            attemptBid();
          }
        }, 100);
      } else {
        log("📍 Dialog detected, handling result...");
        setTimeout(() => {
          if (isRunning()) {
            handleBidResult();
          }
        }, 100);
      }
    }

    function getStatus() {
      if (!isRunning()) {
        return "Stopped";
      }

      const bidCount = getBidCount();
      const hasButton = getSelectedButton() ? "✅" : "❌";
      return `Running - ${bidCount} bids placed ${hasButton}`;
    }

    return {
      startBot,
      stopBot,
      main,
      getStatus,
      isRunning: isRunning,
    };
  })();
  function createControls() {
    // 1) If the panel already exists, do nothing
    if (document.getElementById("bot-controls")) return;

    // 2) Inject a <style> block with modern/tabbed styles
    const css = `
            /* Container panel */
            #bot-controls {
            position: fixed;
            bottom: 20px;
            left: 20px;
            width: 250px;
            background: rgba(0, 0, 0, 0.8);
            color: #fff;
            border-radius: 8px;
            font-family: "Segoe UI", Tahoma, sans-serif;
            font-size: 13px;
            z-index: 9999;
            user-select: none;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            }

            /* Header bar (drag handle + title + toggle) */
            #bot-header {
            padding: 8px 12px;
            border-bottom: 1px solid #444;
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            }
            #bot-header span {
            display: inline-flex;
            align-items: center;
            }
            #status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #e74c3c; /* softer red */
            margin-right: 6px;
            flex-shrink: 0;
            }

            /* Collapse / Expand toggle */
            #collapse-toggle {
            cursor: pointer;
            font-size: 12px;
            transition: transform 0.2s ease, color 0.2s ease;
            }
            #collapse-toggle:hover {
            color: #ddd;
            }

            /* Main content area */
            #bot-content {
            padding: 10px;
            }

            /* “Progress” text */
            #friend-progress {
            display: block;
            margin-bottom: 6px;
            font-size: 12px;
            color: #ccc;
            }

            /* Queue visualizer box */
            #queue-visualizer {
            margin: 6px 0;
            padding: 6px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            }
            .queue-counter {
            font-size: 12px;
            color: #ccc;
            transition: transform 0.15s ease;
            }
            #queue-visualizer span:last-child {
            font-size: 10px;
            color: #999;
            }

            /* Generic button style */
            .bot-button {
            margin: 2px;
            padding: 5px 10px;
            font-size: 12px;
            background: #333;
            border: none;
            border-radius: 4px;
            color: #fff;
            cursor: pointer;
            transition: background 0.2s ease;
            }
            .bot-button:hover {
            background: #444;
            }

            /* Section wrapper style */
            .bot-section {
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px solid #444;
            }
            .bot-section-header {
            margin-bottom: 5px;
            font-weight: bold;
            }

            /* Tab bar */
            #tab-bar {
            display: flex;
            margin-top: 10px;
            border-bottom: 1px solid #444;
            }
            .tab-button {
            flex: 1;
            text-align: center;
            padding: 6px 0;
            cursor: pointer;
            font-size: 12px;
            background: #2c2c2c;
            transition: background 0.2s ease;
            user-select: none;
            }
            .tab-button:hover {
            background: #3a3a3a;
            }
            .tab-button.active {
            background: #444;
            border-bottom: 2px solid #e74c3c;
            }

            /* Tab panels (only one visible at a time) */
            .tab-panel {
            display: none;
            }
            .tab-panel.active {
            display: block;
            }
            /* add an ios style switch to toggle evil mode with the id evil-mode-toggle it has some margin left and the text is on the right side of the switch that says "evil mode" and the switch is a circle in a rectangular "track" where off is having the circle at the right with a green background and "on" is the circle on the right with a red background */
            .switch {
            position: relative;
            display: inline-block;
            width: 34px;
            height: 20px;
            }
            .switch input {
            opacity: 0;
            width: 0;
            height: 0;
            }
            .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 34px;
            }
            .slider:before {
            position: absolute;
            content: "";
            height: 20px;
            width: 20px;
            left: 0;
            bottom: 0;
            background-color: #fff;
            transition: .4s;
            border-radius: 34px;
            }
            input:checked + .slider {
            background-color: #e74c3c;
            }
            input:checked + .slider:before {
            transform: translateX(14px);
            }
        `;
    const styleTag = document.createElement("style");
    styleTag.textContent = css;
    document.head.appendChild(styleTag);

    // 3) Create the panel container
    const panel = document.createElement("div");
    panel.id = "bot-controls";
    document.body.appendChild(panel);

    // 4) Build out the inner HTML with tabs
    panel.innerHTML = `
            <div id="bot-header">
            <span>
                <div id="status-dot"></div>
                <span>🤖 Ovipets Bot</span>
                <label class="switch" style="margin-left: 10px;">
                    <input type="checkbox" id="evil-mode-toggle">
                    <span class="slider"></span>
                    <span style="color: #ccc; float: left; white-space: nowrap; margin-left: 40px; margin-bottom: 20px; margin-top: -20px;">Evil Mode</span>
                </label>
            </span>
            <div id="collapse-toggle" title="Collapse panel">▼</div>
            </div>

            <div id="bot-content">
            <!-- Progress + Queue -->
            <div id="friend-progress">👥 0/0</div>
            <div id="queue-visualizer">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
                <span class="queue-counter">🥚 0</span>
                <span>Egg Queue</span>
                </div>
                <!-- Bars inserted dynamically by updateQueueVisualizer() -->
            </div>

            <!-- Main Bot Controls (always visible) -->
            <div id="main-controls" style="margin-bottom: 8px;">
                <button id="start-bot" class="bot-button">▶️ START</button>
                <button id="stop-bot" class="bot-button">⏹️ STOP</button>
                <!-- peaceful mode checkbox -->
                <label style="margin-left: 10px;">
                    <input type="checkbox" style="margin-bottom: -50px;padding-top: 50px;float: inline-end;"id="peaceful-mode">
                    <span style="color: #ccc; margin-left: 10px;">Peaceful Mode</span>
                </label>
            </div>

            <!-- Tab Bar -->
            <div id="tab-bar">
                <div class="tab-button active" data-tab="old-bots">Old Bots</div>
                <div class="tab-button" data-tab="my-pets">My Pets</div>
                <div class="tab-button" data-tab="other">Other</div>
            </div>

            <!-- Tab Panels -->
            <div id="tab-content">
                <!-- Old Bots Panel -->
                <div id="tab-old-bots" class="tab-panel active">
                <div class="bot-section">
                    <div class="bot-section-header">🔄 Old Across</div>
                    <button id="old-across-start" class="bot-button">▶️ Start</button>
                    <button id="old-across-stop" class="bot-button">⏹️ Stop</button>
                    <button id="ovipets-old-across-resume" class="bot-button" style="display: none;">⏯️ Resume</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🔍 Old Thorough</div>
                    <button id="old-thorough-start" class="bot-button">▶️ Start</button>
                    <button id="old-thorough-stop" class="bot-button">⏹️ Stop</button>
                    <button id="ovipets-old-thorough-resume" class="bot-button" style="display: none;">⏯️ Resume</button>
                </div>
                </div>

                <!-- My Pets Panel -->
                <div id="tab-my-pets" class="tab-panel">
                <div class="bot-section">
                    <div class="bot-section-header">💕 Breeder</div>
                    <button id="breeder-start" class="bot-button">▶️ Start</button>
                    <button id="breeder-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🍖 Feeder</div>
                    <button id="feeder-start" class="bot-button">▶️ Start</button>
                    <button id="feeder-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🧬 Genetic Profiler</div>
                    <button id="genetic-profiler-start" class="bot-button">▶️ Start</button>
                    <button id="genetic-profiler-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">📝 Namer</div>
                    <button id="namer-start" class="bot-button">▶️ Start</button>
                    <button id="namer-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🥚 Hatcher</div>
                    <button id="hatcher-start" class="bot-button">▶️ Start</button>
                    <button id="hatcher-stop" class="bot-button">⏹️ Stop</button>
                </div>
                </div>

                <!-- Other Panel -->
                <div id="tab-other" class="tab-panel">
                <div class="bot-section">
                    <div class="bot-section-header">📨 Befriender</div>
                    <button id="befriender-start" class="bot-button">▶️ Start</button>
                    <button id="befriender-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🏠 Adopter</div>
                    <button id="adopter-start" class="bot-button">▶️ Start</button>
                    <button id="adopter-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">📸 Image Collector</div>
                    <button id="image-collector-start" class="bot-button">▶️ Start</button>
                    <button id="image-collector-stop" class="bot-button">⏹️ Stop</button>
                </div>
                <div class="bot-section">
                    <div class="bot-section-header">🔨 Bidder</div>
                    <button id="bidder-start" class="bot-button">▶️ Start</button>
                    <button id="bidder-stop" class="bot-button">⏹️ Stop</button>
                </div>
                </div>
            </div>
            </div>
        `;

    // 5) Add collapse/expand functionality
    let isCollapsed = false;
    const collapseToggle = document.getElementById("collapse-toggle");
    const botContent = document.getElementById("bot-content");
    const evilModeToggle = document.getElementById("evil-mode-toggle");
    const peacefulModeToggle = document.getElementById("peaceful-mode");

    collapseToggle.onclick = (e) => {
      e.stopPropagation(); // Don’t trigger drag when clicking toggle
      isCollapsed = !isCollapsed;

      if (isCollapsed) {
        botContent.style.display = "none";
        collapseToggle.textContent = "▲";
        collapseToggle.title = "Expand panel";
      } else {
        botContent.style.display = "block";
        collapseToggle.textContent = "▼";
        collapseToggle.title = "Collapse panel";
      }
    };

    // 6) Add drag functionality (header acts as grab handle)
    let isDragging = false;
    let dragStartX = 0,
      dragStartY = 0;
    let panelStartX = 0,
      panelStartY = 0;
    const header = document.getElementById("bot-header");

    header.onmousedown = (e) => {
      // Don’t start if user clicked the collapse toggle
      if (e.target.id === "collapse-toggle") return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      const rect = panel.getBoundingClientRect();
      panelStartX = rect.left;
      panelStartY = rect.top;

      // Show grabbing cursor
      document.body.style.cursor = "grabbing";
      header.style.cursor = "grabbing";
      e.preventDefault();
    };

    document.onmousemove = (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      const deltaY = e.clientY - dragStartY;
      let newX = panelStartX + deltaX;
      let newY = panelStartY + deltaY;

      // Keep panel within viewport
      const maxX = window.innerWidth - panel.offsetWidth;
      const maxY = window.innerHeight - panel.offsetHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));

      panel.style.left = newX + "px";
      panel.style.top = newY + "px";
      panel.style.bottom = "auto"; // Clear bottom when dragging
    };

    document.onmouseup = () => {
      if (isDragging) {
        isDragging = false;
        document.body.style.cursor = "";
        header.style.cursor = "move";
      }
    };

    evilModeToggle.onclick = () => {
      isEvil = evilModeToggle.classList.toggle("active");
      log(`Evil mode is now ${isEvil ? "ON" : "OFF"}`);
      // make the panel have a deep red background when evil mode is on, with the same transparency though
      panel.style.background = isEvil
        ? "rgba(139, 0, 0, 0.8)" // Dark red with transparency
        : "rgba(0, 0, 0, 0.8)"; // Default black with transparency
    };

    peacefulModeToggle.onclick = () => {
      isPeaceful = peacefulModeToggle.checked;
      log(`Peaceful mode is now ${isPeaceful ? "ON" : "OFF"}`);
    };

    // 7) Wire up all button event listeners exactly as before

    // Main bot controls
    document.getElementById("start-bot").onclick = startBot;
    document.getElementById("stop-bot").onclick = stopBot;

    // Old Across
    document.getElementById("old-across-start").onclick =
      OvipetsOldAcross.startBot;
    document.getElementById("old-across-stop").onclick =
      OvipetsOldAcross.stopBot;
    document.getElementById("ovipets-old-across-resume").onclick =
      OvipetsOldAcross.resumeBot;

    // Old Thorough
    document.getElementById("old-thorough-start").onclick =
      OvipetsOldThorough.startBot;
    document.getElementById("old-thorough-stop").onclick =
      OvipetsOldThorough.stopBot;
    document.getElementById("ovipets-old-thorough-resume").onclick =
      OvipetsOldThorough.resumeBot;

    // Breeder
    document.getElementById("breeder-start").onclick = Breeder.startBot;
    document.getElementById("breeder-stop").onclick = Breeder.stopBot;

    // Feeder
    document.getElementById("feeder-start").onclick = Feeder.startBot;
    document.getElementById("feeder-stop").onclick = Feeder.stopBot;

    // Genetic Profiler
    document.getElementById("genetic-profiler-start").onclick =
      GeneticProfiler.startBot;
    document.getElementById("genetic-profiler-stop").onclick =
      GeneticProfiler.stopBot;

    // Namer
    document.getElementById("namer-start").onclick = Namer.startBot;
    document.getElementById("namer-stop").onclick = Namer.stopBot;

    // Befriender
    document.getElementById("befriender-start").onclick = Befriender.startBot;
    document.getElementById("befriender-stop").onclick = Befriender.stopBot;

    // Adopter
    document.getElementById("adopter-start").onclick = Adopter.startBot;
    document.getElementById("adopter-stop").onclick = Adopter.stopBot;

    document.getElementById("hatcher-start").onclick = Hatcher.startBot;
    document.getElementById("hatcher-stop").onclick = Hatcher.stopBot;

    // In the createControls function, add these event listeners:

    // Bidder
    document.getElementById("bidder-start").onclick = Bidder.startBot;
    document.getElementById("bidder-stop").onclick = Bidder.stopBot;

    // Image Collector
    document.getElementById("image-collector-start").onclick =
      ImageCollector.startBot;
    document.getElementById("image-collector-stop").onclick =
      ImageCollector.stopBot;

    // 8) Tab‐switching logic
    const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
    const tabPanels = {
      "old-bots": document.getElementById("tab-old-bots"),
      "my-pets": document.getElementById("tab-my-pets"),
      other: document.getElementById("tab-other"),
    };

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab");

        // 1. Toggle active class on buttons
        tabButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        // 2. Show/hide panels
        Object.keys(tabPanels).forEach((key) => {
          if (key === target) {
            tabPanels[key].classList.add("active");
          } else {
            tabPanels[key].classList.remove("active");
          }
        });
      });
    });

    // 9) Initialize status indicator & queue, and resume progress if running
    log("Controls created successfully");
    updateStatusIndicator();
    updateQueueVisualizer();

    if (isRunning()) {
      log("Bot already running, resuming progress updates");
      updateProgress();
      pollInterval = setInterval(() => {
        pollForEggs();
        updateProgress();
      }, 3000);
    }
  }
  // Make sure controls are created when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      createControls();
      restoreState(); // Restore state after controls are created
    });
  } else {
    createControls();
    restoreState(); // Restore state immediately if DOM is already ready
  }

  // Also try on window load as backup
  window.addEventListener("load", () => {
    createControls();
    Befriender.main();
    Adopter.main();
    Breeder.main();
    Namer.main(); // Add this line
    Hatcher.main();
    Bidder.main();
    Feeder.main();
    GeneticProfiler.main();
    OvipetsOldAcross.main();
    OvipetsOldThorough.main();
  });

  window.addEventListener("hashchange", () => {
    Befriender.main();
    Adopter.main();
    Breeder.main();
    Namer.main(); // Add this line
    Hatcher.main();
    Bidder.main();
    Feeder.main();
    GeneticProfiler.main();
    OvipetsOldAcross.main();
    OvipetsOldThorough.main();
  });
})();