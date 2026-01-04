// ==UserScript==
// @name         Generate X-Client-Transaction-ID
// @version      2025-05-20
// @description  JS code to generate required X-Client-Transaction-ID Header for X API requests
// @author       You
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @namespace https://greasyfork.org/users/1466972
// @downloadURL https://update.greasyfork.org/scripts/536593/Generate%20X-Client-Transaction-ID.user.js
// @updateURL https://update.greasyfork.org/scripts/536593/Generate%20X-Client-Transaction-ID.meta.js
// ==/UserScript==

(function() {
    'use strict';
const savedFrames = [];
const ADDITIONAL_RANDOM_NUMBER = 3;
const DEFAULT_KEYWORD = "obfiowerehiring";
let defaultRowIndex = null;
let defaultKeyBytesIndices = null;



generateTID()


async function generateTID() {
  if (!defaultRowIndex || !defaultKeyBytesIndices) {
    const { firstIndex, remainingIndices } = await getIndices();
    defaultRowIndex = firstIndex;
    defaultKeyBytesIndices = remainingIndices;
  }

  const method = "GET"
  const path = fetchApiURL()
  const key = await getKey();
  const keyBytes = getKeyBytes(key);
  const animationKey = getAnimationKey(keyBytes);
  const xTID = await getTransactionID(method, path, key, keyBytes, animationKey)
  console.log("Generated Transaction ID: ", xTID)
}


function fetchApiURL() { // This can be made dynamic using message passing
 return "/i/api/graphql/xd_EMdYvB9hfZsZ6Idri0w/TweetDetail"
}

const getFramesInterval = setInterval(() => {
  const nodes = document.querySelectorAll('[id^="loading-x-anim"]');

  if (nodes.length === 0 && savedFrames.length !== 0) {
    clearInterval(getFramesInterval);
    const serialized = savedFrames.map(node => node.outerHTML);
    localStorage.setItem("savedFrames", JSON.stringify(serialized));
    return;
  }

  nodes.forEach(removedNode => {
    if (!savedFrames.includes(removedNode)) {
      savedFrames.push(removedNode);
    }
  });
}, 10);


async function getIndices() {
  let url = null;
  const keyByteIndices = [];
  const targetFileMatch = document.documentElement.innerHTML.match(/"ondemand\.s":"([0-9a-f]+)"/);

  if (targetFileMatch) {
    const hexString = targetFileMatch[1];
    url = `https://abs.twimg.com/responsive-web/client-web/ondemand.s.${hexString}a.js`;
  } else {
    throw new Error("Transaction ID generator needs an update.");
   }

  const INDICES_REGEX = /\(\w{1}\[(\d{1,2})\],\s*16\)/g;

    try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch indices file: ${response.statusText}`);
    }

    const jsContent = await response.text();
    const keyByteIndicesMatch = [...jsContent.matchAll(INDICES_REGEX)];

    keyByteIndicesMatch.forEach(item => {
      keyByteIndices.push(item[1]);
    });

    if (keyByteIndices.length === 0) {
      throw new Error("Couldn't get KEY_BYTE indices from file content");
    }

    const keyByteIndicesInt = keyByteIndices.map(Number);
    return {
      firstIndex: keyByteIndicesInt[0],
      remainingIndices: keyByteIndicesInt.slice(1),
    };
  } catch (error) {
    showError(error.message);
    return null;
  }
}

async function getKey() {
  return new Promise(resolve => {
    const meta = document.querySelector('meta[name="twitter-site-verification"]');
    if (meta) resolve(meta.getAttribute("content"));
  });
}

function getKeyBytes(key) {
  return Array.from(atob(key).split("").map(c => c.charCodeAt(0)));
}

function getFrames() {
  const stored = localStorage.getItem("savedFrames");
  if (stored) {
    const frames = JSON.parse(stored);
    const parser = new DOMParser();

    return frames.map(frame =>
      parser.parseFromString(frame, "text/html").body.firstChild
    );
  }
  return [];
}

function get2DArray(keyBytes) {
  const frames = getFrames();
  const array = Array.from(
    frames[keyBytes[5] % 4].children[0].children[1]
      .getAttribute("d")
      .slice(9)
      .split("C")
  ).map(item =>
    item
      .replace(/[^\d]+/g, " ")
      .trim()
      .split(" ")
      .map(Number)
  );
  return array;
}

function solve(value, minVal, maxVal, rounding) {
  const result = (value * (maxVal - minVal)) / 255 + minVal;
  return rounding ? Math.floor(result) : Math.round(result * 100) / 100;
}

function animate(frames, targetTime) {
  const fromColor = frames.slice(0, 3).concat(1).map(Number);
  const toColor = frames.slice(3, 6).concat(1).map(Number);
  const fromRotation = [0.0];
  const toRotation = [solve(frames[6], 60.0, 360.0, true)];
  const remainingFrames = frames.slice(7);
  const curves = remainingFrames.map((item, index) =>
    solve(item, isOdd(index), 1.0, false)
  );
  const cubic = new Cubic(curves);
  const val = cubic.getValue(targetTime);
  const color = interpolate(fromColor, toColor, val).map(value =>
    value > 0 ? value : 0
  );
  const rotation = interpolate(fromRotation, toRotation, val);
  const matrix = convertRotationToMatrix(rotation[0]);
  const strArr = color.slice(0, -1).map(value =>
    Math.round(value).toString(16)
  );

  for (const value of matrix) {
    let rounded = Math.round(value * 100) / 100;
    if (rounded < 0) {
      rounded = -rounded;
    }
    const hexValue = floatToHex(rounded);
    strArr.push(
      hexValue.startsWith(".")
        ? `0${hexValue}`.toLowerCase()
        : hexValue || "0"
    );
  }

  const animationKey = strArr.join("").replace(/[.-]/g, "");
  return animationKey;
}

function isOdd(num) {
  return num % 2 !== 0 ? -1.0 : 0.0;
}

function getAnimationKey(keyBytes) {
  const totalTime = 4096;

  if (typeof defaultRowIndex === "undefined" || typeof defaultKeyBytesIndices === "undefined") {
    throw new Error("Indices not initialized");
  }

  const rowIndex = keyBytes[defaultRowIndex] % 16;

  const frameTime = defaultKeyBytesIndices.reduce((acc, index) => {
    return acc * (keyBytes[index] % 16);
  }, 1);

  const arr = get2DArray(keyBytes);
  if (!arr || !arr[rowIndex]) {
    throw new Error("Invalid frame data");
  }

  const frameRow = arr[rowIndex];
  const targetTime = frameTime / totalTime;
  const animationKey = animate(frameRow, targetTime);

  return animationKey;
}

async function getTransactionID(method, path, key, keyBytes, animationKey) {
  if(!method || !path || !key || !animationKey) {
    return console.log("Invalid call.")
  }
  const timeNow = Math.floor((Date.now() - 1682924400 * 1000) / 1000);
  const timeNowBytes = [
    timeNow & 0xff,
    (timeNow >> 8) & 0xff,
    (timeNow >> 16) & 0xff,
    (timeNow >> 24) & 0xff,
  ];

  const inputString = `${method}!${path}!${timeNow}${DEFAULT_KEYWORD}${animationKey}`;
  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(inputString));
  const hashBytes = Array.from(new Uint8Array(hashBuffer));
  const randomNum = Math.floor(Math.random() * 256);
  const bytesArr = [
    ...keyBytes,
    ...timeNowBytes,
    ...hashBytes.slice(0, 16),
    ADDITIONAL_RANDOM_NUMBER,
  ];
  const out = new Uint8Array(bytesArr.length + 1);
  out[0] = randomNum;
  bytesArr.forEach((item, index) => {
    out[index + 1] = item ^ randomNum;
  });
  const transactionId = btoa(String.fromCharCode(...out)).replace(/=+$/, "");
  return transactionId;
}

class Cubic {
  constructor(curves) {
    this.curves = curves;
  }

  getValue(time) {
    let startGradient = 0;
    let endGradient = 0;
    let start = 0.0;
    let mid = 0.0;
    let end = 1.0;

    if (time <= 0.0) {
      if (this.curves[0] > 0.0) {
        startGradient = this.curves[1] / this.curves[0];
      } else if (this.curves[1] === 0.0 && this.curves[2] > 0.0) {
        startGradient = this.curves[3] / this.curves[2];
      }
      return startGradient * time;
    }

    if (time >= 1.0) {
      if (this.curves[2] < 1.0) {
        endGradient = (this.curves[3] - 1.0) / (this.curves[2] - 1.0);
      } else if (this.curves[2] === 1.0 && this.curves[0] < 1.0) {
        endGradient = (this.curves[1] - 1.0) / (this.curves[0] - 1.0);
      }
      return 1.0 + endGradient * (time - 1.0);
    }

    while (start < end) {
      mid = (start + end) / 2;
      const xEst = this.calculate(this.curves[0], this.curves[2], mid);
      if (Math.abs(time - xEst) < 0.00001) {
        return this.calculate(this.curves[1], this.curves[3], mid);
      }
      if (xEst < time) {
        start = mid;
      } else {
        end = mid;
      }
    }
    return this.calculate(this.curves[1], this.curves[3], mid);
  }

  calculate(a, b, m) {
    return (
      3.0 * a * (1 - m) * (1 - m) * m +
      3.0 * b * (1 - m) * m * m +
      m * m * m
    );
  }
}

function interpolate(fromList, toList, f) {
  if (fromList.length !== toList.length) {
    throw new Error("Invalid list");
  }
  const out = [];
  for (let i = 0; i < fromList.length; i++) {
    out.push(interpolateNum(fromList[i], toList[i], f));
  }
  return out;
}

function interpolateNum(fromVal, toVal, f) {
  if (typeof fromVal === "number" && typeof toVal === "number") {
    return fromVal * (1 - f) + toVal * f;
  }
  if (typeof fromVal === "boolean" && typeof toVal === "boolean") {
    return f < 0.5 ? fromVal : toVal;
  }
}

function convertRotationToMatrix(degrees) {
  const radians = (degrees * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  return [cos, sin, -sin, cos, 0, 0];
}

function floatToHex(x) {
  const result = [];
  let quotient = Math.floor(x);
  let fraction = x - quotient;

  while (quotient > 0) {
    quotient = Math.floor(x / 16);
    const remainder = Math.floor(x - quotient * 16);
    if (remainder > 9) {
      result.unshift(String.fromCharCode(remainder + 55));
    } else {
      result.unshift(remainder.toString());
    }
    x = quotient;
  }

  if (fraction === 0) {
    return result.join("");
  }

  result.push(".");

  while (fraction > 0) {
    fraction *= 16;
    const integer = Math.floor(fraction);
    fraction -= integer;
    if (integer > 9) {
      result.push(String.fromCharCode(integer + 55));
    } else {
      result.push(integer.toString());
    }
  }

  return result.join("");
}

function base64Encode(array) {
  return btoa(String.fromCharCode.apply(null, array));
}



})();