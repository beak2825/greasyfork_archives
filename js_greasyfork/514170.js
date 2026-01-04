// ==UserScript==
// @name         McDonalds Food for Thoughts
// @namespace    https://www.mcdfoodforthoughts.com
// @version      1.1
// @grant        none
// @include      https://www.mcdfoodforthoughts.com/*
// @description  McDonalds Food for Thoughts survey filler
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/514170/McDonalds%20Food%20for%20Thoughts.user.js
// @updateURL https://update.greasyfork.org/scripts/514170/McDonalds%20Food%20for%20Thoughts.meta.js
// ==/UserScript==

const CHAR_MAP = "CM7WD6N4RHF9ZL3XKQGVPBTJY";
const BASE = CHAR_MAP.length;
const EPOCH = new Date("2016-02-01");

function encode(num) {
    let encoded = "";
    while (num >= BASE) {
        encoded = CHAR_MAP[num % BASE] + encoded;
        num = Math.floor(num / BASE);
    }
    return CHAR_MAP[num] + encoded;
}

function decode(encoded) {
    let num = 0;
    for (let i = 0; i < encoded.length; i++) {
        const char = encoded[i];
        const exp = encoded.length - i - 1;
        num += Math.pow(BASE, exp) * CHAR_MAP.indexOf(char);
    }
    return num;
}

function getCheckDigit(code) {
    const chars = code.split("").reverse();
    let checkDigit = 0;
    for (let i = 0; i < chars.length; i++) {
        let value = decode(chars[i]);
        if (i % 2 === 0) {
            value *= 2;
            const encoded = encode(value);
            if (encoded.length === 2) {
                value = [...encoded]
                    .map(decode)
                    .reduce((total, num) => total + num, 0);
            }
        }

        checkDigit += value;
    }
    checkDigit %= BASE;
    if (checkDigit > 0)
        checkDigit = BASE - checkDigit;
    return checkDigit;
}

function generateCode() {
    const storeId = 1524 + Math.floor(97 * Math.random());
    const encStoreId = encode(storeId).padStart(3, encode(0));
    const encOrderId = encode(125);
    const mse = Math.floor((new Date() - EPOCH) / 60000);
    const encMinutes = encode(mse).padStart(5, encode(0));
    let code = encStoreId + encode(3) + encOrderId + encMinutes;
    code += encode(getCheckDigit(code));
    return code.match(/.{4}/g);
}

///////////////////////////////////////////////////////////////////////////

const CN1 = document.getElementById("CN1");
const CN2 = document.getElementById("CN2");
const CN3 = document.getElementById("CN3");

if (CN1 && CN2 && CN3)
  [CN1.value, CN2.value, CN3.value] = generateCode();

const AmountSpent1 = document.getElementById("AmountSpent1");
const AmountSpent2 = document.getElementById("AmountSpent2");

if (AmountSpent1)
  AmountSpent1.value = "3"

if (AmountSpent2)
  AmountSpent2.value = "14"

const RadioButtons = document.querySelectorAll("input[type='radio']");

RadioButtons.forEach(r => r.checked = true);