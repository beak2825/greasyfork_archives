/**
 * MIT License
 *
 * Copyright (c) 2021-2022 GreatWizard
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
// ==UserScript==
// @name            Softcobra Unadblocker and Decoder (2022)
// @namespace       https://greasyfork.org/en/users/781676-greatwizard
// @version         0.17
// @description     Disable adblocker on softcobra.net and decode links when possible
// @author          GreatWizard (based on butforme and GlumWoodpecker work)
// @copyright       2021-2022, GreatWizard (https://greasyfork.org/en/users/781676-greatwizard)
// @license         MIT
// @match           https://www.softcobra.net/*
// @match           https://www.nin10news.net/*
// @grant           none
// @run-at          document-end
// @require         https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/428587/Softcobra%20Unadblocker%20and%20Decoder%20%282022%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428587/Softcobra%20Unadblocker%20and%20Decoder%20%282022%29.meta.js
// ==/UserScript==

// ==OpenUserScript==
// @author          GreatWizard
// @collaborator    butforme
// @collaborator    GlumWoodpecker
// ==/OpenUserScript==

/* jshint esversion: 6 */
/* global CryptoJS */
setTimeout(function() {
  const message = document.getElementsByClassName("message")[0];
  const modal = document.getElementById("myModal");
  message.style.display = "none";
  modal.style.display = "none";
}, 1800);

const DEFAULT_STORE = {
  version: 1,
  resolved: []
};
const STORE_NAME = "__decoder__";

const base64RegExp = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=|[A-Za-z0-9+\/]{4})$/;
const aesStart = "U2FsdGVkX1";

const formBody = (body) => {
  let data = [];
  for (let k in body) {
    data.push(`${encodeURIComponent(k)}=${encodeURIComponent(body[k])}`);
  }
  data = data.join("&");
  return data;
}

let store = JSON.parse(localStorage.getItem(STORE_NAME)) || {};
if (store.version !== DEFAULT_STORE.version) {
  store = DEFAULT_STORE;
}

(async () => {
  const tableRows = document.getElementsByTagName("td");
  for (let j = 0; j < tableRows.length; j++) {
    const prevRow = j - 1 > 0 ? tableRows[j - 1].innerText : undefined;
    const currRow = tableRows[j].innerText;
    let decodedLink;
    let tryBase64 = currRow;
    try {
      let tryBase64Counter = 2;
      do {
        tryBase64 = atob(tryBase64);
        tryBase64Counter--;
      } while (!tryBase64.startsWith("http") && tryBase64Counter > 0);
    } catch (e) {}
    const findInStore = store.resolved.find(element => element.encoded === currRow);
    if (findInStore !== undefined) {
      decodedLink = findInStore.decoded;
    } else if (tryBase64.startsWith("http")) {
      decodedLink = tryBase64;
    } else if (currRow.startsWith(aesStart)) {
      decodedLink = CryptoJS.AES.decrypt(currRow, "/").toString(CryptoJS.enc.Utf8);
    } else if (currRow.match(base64RegExp)) {
      tableRows[j].innerHTML = `<a href="https://www.nin10news.net/decode/" target="_blank">${currRow}</a>`;
      // let response = await fetch("https://www.nin10news.net/wp-content/themes/twentysixteen/inc/decode.php", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/x-www-form-urlencoded"
      //   },
      //   body: formBody({
      //     data: currRow
      //   })
      // });
      // let body = await response.body;
      // let data = await body.getReader().read();
      // try {
      //   decodedLink = atob(new TextDecoder("utf-8").decode(data.value));
      // } catch (e) {
      //   console.log(`Impossible to decode ${currRow}`);
      // }
    }
    if (decodedLink !== undefined) {
      tableRows[j].innerHTML = `<a href="${decodedLink}" target="_blank">${decodedLink}</a>`;
      store.resolved.push({
        title: prevRow !== undefined && prevRow !== "" ? prevRow : undefined,
        encoded: currRow,
        decoded: decodedLink
      });
      localStorage.setItem(STORE_NAME, JSON.stringify(store));
    }
  }
})();
