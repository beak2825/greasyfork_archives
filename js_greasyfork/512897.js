// ==UserScript==
// @name        Universal Dark Mode 3 (Gray-Blue)
// @match       *://*/*
// @grant       none
// @version     2
// @author      almahmud & gpt
// @homepageURL    https://github.com/almahmudbd/universal-dark-mode
// @description Gray-Blue dark mode with adjusted colors for better readability.
// @license     GPL-2.0 - Modified for lighter dark mode
// @run-at      document-start
// @namespace https://greasyfork.org/users/1238578
// @downloadURL https://update.greasyfork.org/scripts/512897/Universal%20Dark%20Mode%203%20%28Gray-Blue%29.user.js
// @updateURL https://update.greasyfork.org/scripts/512897/Universal%20Dark%20Mode%203%20%28Gray-Blue%29.meta.js
// ==/UserScript==

const calculateBrightness = ([r, g, b]) => {
  return Math.round((r * 0.2126 + g * 0.7152 + b * 0.0722) * 100) / 100;
};

const modifyBrightness = ([r, g, b], brightness) => {
  const [h, s, _] = rgbToHsl([r, g, b]);
  return `hsl(${h} ${s}% ${(brightness / 255) * 100}%)`;
};

const rgbToHsl = ([red, green, blue]) => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const lightness = (max + min) / 2;

  if (max === min) return [0, 0, Math.round(lightness * 100)];

  let hue, saturation;
  const delta = max - min;
  saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);

  switch (max) {
    case r:
      hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
      break;
    case g:
      hue = ((b - r) / delta + 2) * 60;
      break;
    case b:
      hue = ((r - g) / delta + 4) * 60;
      break;
    default:
      hue = 0;
  }

  if (hue < 0) hue += 360;
  return [
    Math.round(hue),
    Math.round(saturation * 100),
    Math.round(lightness * 100),
  ];
};

const getColors = (styleName) => {
  const elements = document.querySelectorAll("*");
  const colors = [];

  elements.forEach((element) => {
    const computedStyle = window.getComputedStyle(element);
    const color = computedStyle[styleName];

    if (
      color &&
      !["transparent", "rgba(0, 0, 0, 0)"].includes(color.toString())
    ) {
      colors.push({ element, [styleName]: color });
    }
  });

  return colors;
};

const camelToLispCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
};

const setColors = (styleName, direction, brightness, adjustmentThreshold) => {
  const elementsWithBorder = getColors(styleName);

  elementsWithBorder.forEach((item) => {
    if (!item[styleName]) return;

    const itemBrightness = calculateBrightness(
      item[styleName].match(/\d+/g).map(Number)
    );

    const invert = (() => {
      let currentElement = item.element;
      while (currentElement !== null) {
        if (currentElement.classList.contains("mw-no-invert")) return false;
        currentElement = currentElement.parentElement;
      }
      return true;
    })();

    const targetBrightness = (() => {
      if (adjustmentThreshold > 127) {
        return brightness - 30;
      }
      return brightness;
    })();

    const condition =
      invert &&
      ((direction === ">" && itemBrightness > adjustmentThreshold) ||
        (direction === "<" && itemBrightness < adjustmentThreshold));

    if (condition) {
      const newColor = modifyBrightness(
        item[styleName].match(/\d+/g).map(Number),
        targetBrightness
      );
      item.element.style.setProperty(
        camelToLispCase(styleName),
        newColor,
        "important"
      );
    }
  });
};

const adjustColors = () => {
  const html = document.querySelector("html");
  const backgroundColor = window
    .getComputedStyle(document.body, null)
    .getPropertyValue("background-color");
  if (!html.style.backgroundColor) {
    if (!backgroundColor.includes("rgba")) {
      html.style.backgroundColor = backgroundColor;
    } else {
      html.style.backgroundColor = "#757575"; // Adjusted to a lighter shade
    }
  }

  setColors("backgroundColor", ">", 120, 50); // Background color adjustments for better readability
  setColors("color", "<", 245, 200); // Text color adjustment for contrast
  setColors("borderColor", ">", 100, 127); // Adjusted for better borders

  const elements = document.querySelectorAll("*");
  elements.forEach((element) => {
    element.style.setProperty("box-shadow", "unset", "important");
    element.style.setProperty("text-shadow", "unset", "important");
  });
};

document.onreadystatechange = () => {
  adjustColors();
};

new MutationObserver(adjustColors).observe(document.body, {
  subtree: true,
  childList: true,
});
