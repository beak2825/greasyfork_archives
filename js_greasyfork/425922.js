// ==UserScript==
// @name        Number Replacer
// @namespace   imagine censoring numbers lmao
// @match       https://sketchful.io/
// @grant       none
// @version     1.0
// @author      fffffffff
// @license     MIT
// @copyright   2021, me
// @description I can't believe I had to do this
// @downloadURL https://update.greasyfork.org/scripts/425922/Number%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/425922/Number%20Replacer.meta.js
// ==/UserScript==
/* jshint esversion: 8 */

const words = true;

const chat = document.querySelector("#gameChatInput");

chat.addEventListener('keydown', (e) => {
  if (e.code === 'Enter') {
    chat.value = words ? replaceWithWords(chat.value) : replaceWithDigits(chat.value);
  }
});

const digits = [ '𝟢', '𝟣', '𝟤', '𝟥', '𝟦', '𝟧', '𝟨', '𝟩', '𝟪', '𝟫' ];
const a = ['', 'one ', 'two ', 'three ', 'four ', 'five ', 'six ', 'seven ', 'eight ', 'nine ', 'ten ', 'eleven ', 'twelve ', 'thirteen ', 'fourteen ', 'fifteen ', 'sixteen ', 'seventeen ', 'eighteen ', 'nineteen '];
const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

const regex = /^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/;

const getLT20 = (n) => a[Number(n)];
const getGT20 = (n) => b[n[0]] + ' ' + a[n[1]];

function replaceWithDigits(input) {
  return input.replace(/\d/g, d => digits[d]);
}

function replaceWithWords(input) {
  return input.replace(/\d+/g, d => numWords(d));
}

function numWords (input) {
  const num = Number(input);
  
  if (isNaN(num)) return '';
  if (num === 0) return 'zero';

  const numStr = num.toString();

  if (numStr.length > 6) {
    return replaceWithDigits(input); // Fallback for numbers larger than 6 digits
  }

  const [, n1, n2, n3, n4, n5] = ('000000000' + numStr).substr(-9).match(regex);

  let str = '';
  str += n2 != 0 ? (getLT20(n2) || getGT20(n2)) + 'hundred thousand ' : '';
  str += n3 != 0 ? (getLT20(n3) || getGT20(n3)) + 'thousand ' : '';
  str += n4 != 0 ? getLT20(n4) + 'hundred ' : '';
  str += n5 != 0 && str != '' ? 'and ' : '';
  str += n5 != 0 ? (getLT20(n5) || getGT20(n5)) : '';

  return str.trim();
}