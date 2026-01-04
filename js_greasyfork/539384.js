// ==UserScript==
// @name         AutoScroll to Selected Element (Pixels Every Frames) with Progress Bar
// @description  Click to pick an element, then auto-scroll by exact pixels every specified frames, with a visual progress bar for remaining frames.
// @match        *://*/*
// @version 0.0.1.20250614211616
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/539384/AutoScroll%20to%20Selected%20Element%20%28Pixels%20Every%20Frames%29%20with%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/539384/AutoScroll%20to%20Selected%20Element%20%28Pixels%20Every%20Frames%29%20with%20Progress%20Bar.meta.js
// ==/UserScript==

(function () {
  let pixelsPerStep = 1;
  let framesPerStep = 1;
  let isScrollingActive = false;
  let previousFrameTimestamp = null;
  let selectedTargetElement = null;
  let targetScrollPositionY = null;
  let frameCountSinceLastScroll = 0;
  let averageFrameTimeMilliseconds = 16.67;
  let frameTimeSampleCount = 0;
  let frameTimeSumMilliseconds = 0;
  let previousScrollPositionY = 0;
  let pixelsScrolledLastFrame = 0;
  let initialRemainingFrames = 0;

  const controlPanel = document.createElement("div");
  Object.assign(controlPanel.style, {
    position: "fixed",
    top: "10px",
    right: "10px",
    background: "#333",
    color: "#fff",
    padding: "10px",
    zIndex: 10000,
    fontFamily: "monospace",
    borderRadius: "5px",
    lineHeight: "1.5",
    width: "260px",
    boxSizing: "border-box"
  });
  document.body.appendChild(controlPanel);

  const statusDisplay = document.createElement("div");
  statusDisplay.textContent = "No target selected";
  Object.assign(statusDisplay.style, { height: "20px", whiteSpace: "nowrap", overflow: "hidden" });
  controlPanel.appendChild(statusDisplay);

  const scrollSpeedDisplay = document.createElement("div");
  scrollSpeedDisplay.textContent = `Speed: ${pixelsPerStep} pixels every ${framesPerStep} frames`;
  Object.assign(scrollSpeedDisplay.style, { marginTop: "10px", height: "20px", whiteSpace: "nowrap", overflow: "hidden" });
  controlPanel.appendChild(scrollSpeedDisplay);

  const pixelsInputLabel = document.createElement("label");
  pixelsInputLabel.textContent = "Pixels per step:";
  controlPanel.appendChild(pixelsInputLabel);
  const pixelsInput = document.createElement("input");
  pixelsInput.type = "number";
  pixelsInput.min = "1";
  pixelsInput.value = pixelsPerStep;
  Object.assign(pixelsInput.style, { width: "100%", boxSizing: "border-box", height: "25px" });
  controlPanel.appendChild(pixelsInput);

  const pixelsScrolledLabel = document.createElement("label");
  pixelsScrolledLabel.textContent = "Actual px scrolled last frame:";
  controlPanel.appendChild(pixelsScrolledLabel);
  const pixelsScrolledInput = document.createElement("input");
  pixelsScrolledInput.type = "number";
  pixelsScrolledInput.readOnly = true;
  pixelsScrolledInput.value = "0";
  Object.assign(pixelsScrolledInput.style, { width: "100%", boxSizing: "border-box", height: "25px", backgroundColor: "#555" });
  controlPanel.appendChild(pixelsScrolledInput);

  const framesInputLabel = document.createElement("label");
  framesInputLabel.textContent = "Frames per step:";
  controlPanel.appendChild(framesInputLabel);
  const framesInput = document.createElement("input");
  framesInput.type = "number";
  framesInput.min = "1";
  framesInput.value = framesPerStep;
  Object.assign(framesInput.style, { width: "100%", boxSizing: "border-box", height: "25px" });
  controlPanel.appendChild(framesInput);

  const framesRemainingLabel = document.createElement("label");
  framesRemainingLabel.textContent = "Frames remaining:";
  controlPanel.appendChild(framesRemainingLabel);
  const framesRemainingInput = document.createElement("input");
  framesRemainingInput.type = "number";
  framesRemainingInput.readOnly = true;
  framesRemainingInput.value = "0";
  Object.assign(framesRemainingInput.style, { width: "100%", boxSizing: "border-box", height: "25px", backgroundColor: "#555" });
  controlPanel.appendChild(framesRemainingInput);

  const progressBar = document.createElement("progress");
  progressBar.value = 0;
  progressBar.max = 0;
  Object.assign(progressBar.style, { width: "100%", height: "10px", marginTop: "5px", boxSizing: "border-box" });
  controlPanel.appendChild(progressBar);

  const buttonSelectTarget = document.createElement("button");
  buttonSelectTarget.textContent = "Select Target";
  Object.assign(buttonSelectTarget.style, { display: "block", marginTop: "10px", width: "100%", height: "30px" });
  controlPanel.appendChild(buttonSelectTarget);

  const buttonStartScrolling = document.createElement("button");
  buttonStartScrolling.textContent = "Start Scrolling";
  Object.assign(buttonStartScrolling.style, { display: "block", marginTop: "10px", width: "100%", height: "30px" });
  buttonStartScrolling.disabled = true;
  controlPanel.appendChild(buttonStartScrolling);

  const buttonStopScrolling = document.createElement("button");
  buttonStopScrolling.textContent = "Stop Scrolling";
  Object.assign(buttonStopScrolling.style, { display: "block", marginTop: "10px", width: "100%", height: "30px" });
  buttonStopScrolling.disabled = true;
  controlPanel.appendChild(buttonStopScrolling);

  function updateScrollSpeed() {
    pixelsPerStep = Math.max(1, Number(pixelsInput.value));
    framesPerStep = Math.max(1, Number(framesInput.value));
    scrollSpeedDisplay.textContent = `Speed: ${pixelsPerStep} pixels every ${framesPerStep} frames`;
    updateTimeEstimateDisplay();
  }

  pixelsInput.addEventListener("input", updateScrollSpeed);
  framesInput.addEventListener("input", updateScrollSpeed);

  function getFormattedTimeFromNow(seconds) {
    const now = new Date();
    now.setSeconds(now.getSeconds() + seconds);
    return now.toTimeString().split(" ")[0];
  }

  function computeRemainingFrames() {
    if (targetScrollPositionY === null || pixelsPerStep === 0) return 0;
    const remainingPixels = targetScrollPositionY - window.scrollY;
    return Math.max(0, remainingPixels / pixelsPerStep);
  }

  function computeRemainingTimeInSeconds() {
    const remainingFrames = computeRemainingFrames();
    return (remainingFrames * averageFrameTimeMilliseconds) / 1000;
  }

  function updateTimeEstimateDisplay() {
    if (!selectedTargetElement) {
      statusDisplay.textContent = "No target selected";
      framesRemainingInput.value = "0";
      progressBar.value = 0;
    } else {
      const remainingFrames = computeRemainingFrames();
      const secondsRemaining = computeRemainingTimeInSeconds();
      framesRemainingInput.value = remainingFrames.toFixed(0);
      progressBar.value = remainingFrames;
      const eta = getFormattedTimeFromNow(secondsRemaining);
      const timeLabel = Math.ceil(secondsRemaining);
      statusDisplay.textContent = isScrollingActive ?
        `Time left: ${timeLabel} s (ETA: ${eta})` :
        `Ready: ${timeLabel} s (ETA: ${eta})`;
    }
  }

  function animationStep(timestamp) {
    if (!isScrollingActive) return;
    if (!previousFrameTimestamp) previousFrameTimestamp = timestamp;

    const delta = timestamp - previousFrameTimestamp;
    frameTimeSumMilliseconds += delta;
    frameTimeSampleCount++;
    averageFrameTimeMilliseconds = frameTimeSumMilliseconds / frameTimeSampleCount;

    const currentY = window.scrollY;
    pixelsScrolledLastFrame = currentY - previousScrollPositionY;
    previousScrollPositionY = currentY;
    pixelsScrolledInput.value = pixelsScrolledLastFrame.toFixed(2);

    frameCountSinceLastScroll++;
    if (frameCountSinceLastScroll >= framesPerStep) {
      window.scrollBy(0, pixelsPerStep);
      frameCountSinceLastScroll = 0;
    }

    previousFrameTimestamp = timestamp;
    updateTimeEstimateDisplay();

    if (window.scrollY + 0.5 >= targetScrollPositionY) {
      isScrollingActive = false;
      const arrivalTime = new Date().toTimeString().split(" ")[0];
      statusDisplay.textContent = `Target reached: <${selectedTargetElement.tagName.toLowerCase()}> at ${arrivalTime}`;
      buttonStartScrolling.disabled = false;
      buttonStopScrolling.disabled = true;
      framesRemainingInput.value = "0";
      progressBar.value = 0;
      return;
    }

    requestAnimationFrame(animationStep);
  }

  function startSmoothScrolling() {
    if (!selectedTargetElement) return;
    isScrollingActive = true;
    previousFrameTimestamp = null;
    frameCountSinceLastScroll = 0;
    previousScrollPositionY = window.scrollY;
    pixelsScrolledInput.value = "0";

    initialRemainingFrames = computeRemainingFrames();
    progressBar.max = initialRemainingFrames;
    progressBar.value = initialRemainingFrames;

    buttonStartScrolling.disabled = true;
    buttonStopScrolling.disabled = false;
    updateTimeEstimateDisplay();
    requestAnimationFrame(animationStep);
  }

  function stopSmoothScrolling() {
    isScrollingActive = false;
    previousFrameTimestamp = null;
    frameCountSinceLastScroll = 0;
    pixelsScrolledInput.value = "0";
    framesRemainingInput.value = "0";
    progressBar.value = 0;
    buttonStartScrolling.disabled = false;
    buttonStopScrolling.disabled = true;
    statusDisplay.textContent = "Scrolling stopped";
  }

  function initiateTargetElementSelection() {
    statusDisplay.textContent = "Click on target element";
    document.body.style.cursor = "crosshair";

    function handleClick(event) {
      event.preventDefault();
      event.stopPropagation();

      selectedTargetElement = event.target;
      const rect = selectedTargetElement.getBoundingClientRect();
      const absoluteTop = rect.top + window.pageYOffset;
      const bottomVisibleY = absoluteTop - window.innerHeight + selectedTargetElement.offsetHeight;
      targetScrollPositionY = Math.max(0, bottomVisibleY);

      document.body.style.cursor = "";
      document.removeEventListener("click", handleClick, true);

      buttonSelectTarget.disabled = false;
      buttonStartScrolling.disabled = false;
      buttonStopScrolling.disabled = true;

      statusDisplay.textContent = `Target set: <${selectedTargetElement.tagName.toLowerCase()}> at Y=${targetScrollPositionY.toFixed(2)}`;
      framesRemainingInput.value = computeRemainingFrames().toFixed(0);
      progressBar.max = computeRemainingFrames();
      progressBar.value = computeRemainingFrames();
    }

    document.addEventListener("click", handleClick, true);
    buttonSelectTarget.disabled = true;
  }

  buttonSelectTarget.addEventListener("click", initiateTargetElementSelection);
  buttonStartScrolling.addEventListener("click", startSmoothScrolling);
  buttonStopScrolling.addEventListener("click", stopSmoothScrolling);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") stopSmoothScrolling();
  });
})();
