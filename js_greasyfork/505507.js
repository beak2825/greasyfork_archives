// ==UserScript==
// @name         Trello Colors
// @namespace    http://tampermonkey.net/
// @version      3.1.1
// @description  A userscript that allows for unlimited color options on Trello labels.
// @author       branbarh
// @match        *://*.trello.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505507/Trello%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/505507/Trello%20Colors.meta.js
// ==/UserScript==

/*

  Potential future updates:
   - Support for custom colors on "Cover" cards

*/

//  ======================================= MAIN UPDATE LOOP =======================================

window.addEventListener("load", () => {

  // Handle CSS rules:
  handleCSSRules();

  // Periodically check for new unchecked labels and tooltips, and handle label input changes:
  setInterval(() => {
    handleLabelInput();
    handleLabels();
    handleTooltips();
  }, 0);

});

// ===================================== CSS & LABEL FUNCTIONS =====================================

function handleCSSRules() {

  // Append a style element to the head of the document, to allow for pseudo elements and animations to be hidden later:
  const styleElm = document.createElement("style");
  document.head.appendChild(styleElm);

  const styleSheet = styleElm.sheet;

  // Increase the padding between the labels and the card contentent:
  styleSheet.insertRule(`div[data-testid=trello-card] > div > div:first-child { padding-top: 3px !important; padding-bottom: 4px !important; }`);
  styleSheet.insertRule(`div[data-testid=trello-card] > div > div:first-child:empty { padding-top: 2px !important; padding-bottom: 0px !important; }`);

}

function handleLabels() {

  // Get all unchecked labels:
  const labels = [
    // Card front labels (i.e., the labels shown on the front of each card):
    ...document.querySelectorAll("div[data-testid=trello-card] > div > div:first-child span[data-testid]:not(.trelloColors_checked)"),
    // Card quick-edit front labels (i.e., the labels shown when you right click a card):
    ...document.querySelectorAll("div[data-testid=quick-card-editor-card-front] > div > div:first-child span[data-testid]:not(.trelloColors_checked)"),
    // Card back labels (i.e., the labels shown on the back of each card when you click to open it, under the "Labels" section):
    ...document.querySelectorAll("div[data-testid=card-back-labels-container] > span[data-testid=card-label]:not(.trelloColors_checked):not([type])"),
    // Popover label selector and suggested labels (i.e., the labels shown in the popover menu that appears when you chose to select labels for a card):
    ...document.querySelectorAll("[data-testid=labels-popover-labels-screen] [data-testid=card-label]:not(.trelloColors_checked)")
  ];

  // Loop through the unchecked labels and update them to display their custom color (if any):
  labels.forEach(label => {

    // Get the label title from the aria text:
    const labelTitle = cleanQuotes(label.ariaLabel?.split(": ").slice(2).join(": ").slice(1, -1));

    // Mark this label as checked:
    label.classList.add("trelloColors_checked");
    
    // Return if the label is invalid; inform the user that they should open an issue on GitHub:
    if (labelTitle === undefined)
      return console.error("Invalid label. Please open an issue on GitHub (https://github.com/branbarh/Trello-Colors-Extension/issues) and outline the steps to reproduce this error.", label);

    // Return if the label does not have a custom color associated with it:
    if (labelTitle.trim().indexOf("#") !== 0 || labelTitle.indexOf(":") < labelTitle.indexOf("#")) {
      label.style.removeProperty("background-color");
      label.style.removeProperty("color");
      return;
    }

    // Get the custom color associated with the label:
    const hex = labelTitle.split(":")[0].split(" ").join("");
    const shadedHex = hexToMouseoverColor(hex);

    // Determine if the label has its text showing:
    const isBackLabel = label?.parentNode?.dataset?.testid === "card-back-labels-container";
    const isPopoverLabel = label?.parentNode?.parentNode?.parentNode.dataset.testid === "clickable-checkbox";
    const isSuggestedLabel = label?.parentNode?.parentNode?.parentNode.dataset.testid === "clickable-checkbox"; // Currently, popover and suggested labels are basically identical. This has not always been the case.
    const isFrontLabelTextShowing = document.getElementById("trello-root").classList.contains("body-card-label-text") || document.getElementById("trello-root").classList.contains("body-card-label-text-on");
    
    // Back labels, popover labels, and suggested labels always have their text showing; front labels will only have their text showing when expanded (i.e., when isFrontLabelTextShowing is true):
    const isLabelTextShowing = isBackLabel || isPopoverLabel || isSuggestedLabel || isFrontLabelTextShowing;

    // Get the label text color:
    const labelTextColor = hexToLabelTextColor(hex);

    // Update the relevant label styles and data:
    label.style.backgroundColor = hex;
    label.style.color = isLabelTextShowing ? labelTextColor : "#00000000";
    label.innerText = labelTitle.split(":").slice(1).join(":");

    // Update the "--label-text-color" CSS variable to color match the colorblind pattern with the label's inner text:
    label.style.setProperty("--label-text-color", labelTextColor);

    // Add mouseover/mouseout event listeners to shade the label color on hover:
    label.dataset.defaultcolor = hex;
    label.dataset.shadedcolor = shadedHex;
    label.addEventListener("mouseover", mouseoverLabel);
    label.addEventListener("mouseout", mouseoutLabel);

  });

}

function handleTooltips() {

  // Get the current unchecked tooltip, if any:
  const tooltip = document.querySelector(".atlaskit-portal-container [role=tooltip]:not(.trelloColors_checked)");

  // Return if the tooltip does not exist or is not for a label:
  if (!tooltip || tooltip.innerText.split(": ")[0] !== "Color" || tooltip.innerText.split(": ")[1]?.split(", ")[1] !== "title")
    return;

  // Get the label title from the inner text:
  const tooltipTitle = cleanQuotes(tooltip.innerText?.split(": ").slice(2).join(": ").slice(1, -1));

  // Mark this tooltip as checked:
  tooltip.classList.add("trelloColors_checked");

  // Return if the tooltip is invalid; inform the user that they should open an issue on GitHub:
  if (tooltipTitle === undefined)
    return console.error("Invalid tooltip. Please open an issue on GitHub (https://github.com/branbarh/Trello-Colors-Extension/issues) and outline the steps to reproduce this error.", tooltip);

  // Return if the tooltip does not have a custom color associated with it:
  if (tooltipTitle.trim().indexOf("#") !== 0 || tooltipTitle.indexOf(":") < tooltipTitle.indexOf("#"))
    return;

  // Update the tooltip to hide the custom color:
  const hex = tooltipTitle.split(":")[0].split(" ").join("");
  const title = tooltipTitle.split(":").slice(1).join(":").trim();
  tooltip.innerText = `Custom color: ${hex}, title: “${title}”`;

}

function handleLabelInput() {

  // Get the label input and the save button:
  const input = document.querySelector("[data-testid=labels-popover-edit-label-screen] input:not(.trelloColors_eventAdded)");
  const saveButton = [...document.querySelectorAll("[data-testid=labels-popover-edit-label-screen] button")].at(-2);

  // Return if there is no label input currently being displayed to the user, or if the event handlers have already been added:
  if (!input)
    return;

  // Mark the label input as checked:
  input.classList.add("trelloColors_eventAdded");
  
  // Update the label preview when the input changes:
  input.addEventListener("input", () => {
    updateLabelPreview(input);
  });
  updateLabelPreview(input);

  // Uncheck all labels when the current label is saved, as all instances of this label will need to be updated in accordance with the new changes:
  input.addEventListener("keydown", (e) => {
    if (e.keyCode === 13)
      uncheckAllLabels();
  });
  saveButton.addEventListener("click", uncheckAllLabels);

}

function updateLabelPreview(input) {

  // Get the label preview element:
  const label = document.querySelector("[data-testid=labels-popover-edit-label-screen] [data-testid=card-label]");

  // If there is no custom color, remove any custom, previously set properties:
  if (input.value.trim().indexOf("#") !== 0 || input.value.indexOf(":") < input.value.indexOf("#")) {
    label.style.removeProperty("background-color");
    label.style.removeProperty("color");
    label.innerText = input.value;
    return;
  }

  // Otherwise, a custom color has been provided; update the label preview to display the custom color:
  const hex = input.value.split(":")[0].split(" ").join("");

  // Update the label preview properties:
  label.style.backgroundColor = hex;
  label.style.color = hexToLabelTextColor(hex);
  label.innerText = input.value.split(":").slice(1).join(":");

}

//  =================================== EVENT LISTENER FUNCTIONS ===================================

function mouseoverLabel() {

  // Get a reference to the label:
  const label = this;

  // Update the label's background color:
  label.style.backgroundColor = label.dataset.shadedcolor;

}

function mouseoutLabel() {

  // Get a reference to the label:
  const label = this;

  // Update the label's background color:
  label.style.backgroundColor = label.dataset.defaultcolor;

}

// ======================================== COLOR FUNCTIONS ========================================

function hexToRGB(hex) {

  // Get the number of hex digits per RGB channel (should always be either 1 (e.g., #000) or 2 (e.g., #000000)):
  const digitsPerChannel = Math.floor((hex.length - 1) / 3);

  // Get the value for each RGB channel:
  const RGB = {
    r: parseInt(hex.substring(1 + 0 * digitsPerChannel, 1 + 1 * digitsPerChannel), 16),
    g: parseInt(hex.substring(1 + 1 * digitsPerChannel, 1 + 2 * digitsPerChannel), 16),
    b: parseInt(hex.substring(1 + 2 * digitsPerChannel, 1 + 3 * digitsPerChannel), 16)
  };

  // Fix the values for each RGB channel if only 1 hex digit was provided per channel:
  if (digitsPerChannel === 1) {
    RGB.r *= 17;
    RGB.g *= 17;
    RGB.b *= 17;
  }

  // Return the RGB values:
  return RGB;

}

function RGBToHex(RGB) {

  // Convert each RBG channel to hex:
  const hexChannels = {
    r: RGB.r.toString(16).padStart(2, "0"),
    g: RGB.g.toString(16).padStart(2, "0"),
    b: RGB.b.toString(16).padStart(2, "0")
  };

  // Form the hex string:
  const hex = `#${hexChannels.r}${hexChannels.g}${hexChannels.b}`;

  // Return the resulting hex:
  return hex;

}

function shadeDirection(hex) {

  // Convert the hex to RGB:
  const RGB = hexToRGB(hex);

  // Determine if the color is light or dark based on whether or not it exceeds the threshold (equal to ceil(2 * 16^2 / 3)):
  const threshold = 171;
  const hexShadeDirection = (RGB.r + RGB.g + RGB.b) / 3 >= threshold ? "light" : "dark";

  // Return the calculated shade direction:
  return hexShadeDirection;

}

function hexToLabelTextColor(hex) {

  // If the color is light, a dark text color should be used; if the color is dark, a light text color should be used:
  const hexShadeDirection = shadeDirection(hex);
  const labelTextColor = hexShadeDirection === "light" ? "#1d2125" : "#ffffffe0";

  // Return the calculated label text color:
  return labelTextColor;

}

function hexToMouseoverColor(hex) {

  // Note: I found "0" to be the best constant to use when calling shadeHex; this may change in the future, so I've left it in the code for now.

  // If the color is light, a light mouseover color should be used; if the color is dark, a dark mouseover color should be used:
  const hexShadeDirection = shadeDirection(hex);
  const mouseoverColor = hexShadeDirection === "light" ? shadeHex(hex, 0, 1.16) : shadeHex(hex, 0, 0.6);

  // Return the calculated mouseover color:
  return mouseoverColor;

}

function shadeHex(hex, constant, scalar) {

  // Convert the hex to RGB:
  const RGB = hexToRGB(hex);

  // Shade each color channel:
  const shadedRGB = {
    r: Math.min(Math.max(Math.round((RGB.r + constant) * scalar), 0), 255),
    g: Math.min(Math.max(Math.round((RGB.g + constant) * scalar), 0), 255),
    b: Math.min(Math.max(Math.round((RGB.b + constant) * scalar), 0), 255)
  };

  // Convert back to hex:
  const shadedHex = RGBToHex(shadedRGB);

  // Return the original hex if something went wrong:
  if (shadedHex.includes("NaN"))
    return hex;

  // Otherwise, return the shaded hex:
  return shadedHex;

}

// ======================================= UTILITY FUNCTIONS =======================================

function cleanQuotes(str) {

  // Remove any extraneous quotes:
  const quoteChars = "«»".split("");
  quoteChars.forEach(q => (str = str?.split(q).join("")));

  // Return the cleaned string:
  return str;

}

function uncheckAllLabels() {

  // Delay unchecking all labels by a frame to ensure that the card front labels have updated:
  setTimeout(() => {

    // Get all checked labels:
    const checkedLabels = [...document.getElementsByClassName("trelloColors_checked")];

    // Uncheck all checked labels and remove any event listeners:
    checkedLabels.forEach(label => {
      label.classList.remove("trelloColors_checked");
      delete label.dataset.defaultcolor;
      delete label.dataset.shadedcolor;
      label.style.removeProperty("--label-text-color");
      label.removeEventListener("mouseover", mouseoverLabel);
      label.removeEventListener("mouseout", mouseoutLabel);
    });

  }, 0);

}
