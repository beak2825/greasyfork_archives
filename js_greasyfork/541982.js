// ==UserScript==
// @name        Замена sizeLimit в orch.so
// @namespace   Violentmonkey Scripts
// @match       https://app.orch.so/QwuGuIA2rxuvsuXTGGFQ/*
// @version     1.0
// @author      -
// @run-at       document-start
// @grant        none
// @description Замена значения sizeLimit
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541982/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20sizeLimit%20%D0%B2%20orchso.user.js
// @updateURL https://update.greasyfork.org/scripts/541982/%D0%97%D0%B0%D0%BC%D0%B5%D0%BD%D0%B0%20sizeLimit%20%D0%B2%20orchso.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const originalFetch = window.fetch;

  window.fetch = async function(...args) {
    const url = typeof args[0] === "string" ? args[0] : args[0]?.url;

    if (url && url.includes("google.firestore.v1.Firestore/Listen/channel")) {
      const response = await originalFetch.apply(this, args);
      const clonedResponse = response.clone();

      try {
        let dataText = await clonedResponse.text();
        //console.log("Исходные данные:", dataText);

        if (dataText.includes("262144000")) {
         dataText = dataText.replace(/262144000/g, "268435456000");

          let newlineIndex = dataText.indexOf("\n");
          let firstLine = newlineIndex !== -1 ? dataText.slice(0, newlineIndex) : dataText;

          let digitsStr = "";
          for (let i = 0; i < firstLine.length; i++) {
            const char = firstLine[i];
            if (char >= "0" && char <= "9") {
              digitsStr += char;
            } else {
              break;
            }
          }

          if (digitsStr.length > 0) {
            const originalNumber = parseInt(digitsStr, 10);
            const newNumber = originalNumber + 3;
            console.log(originalNumber, newNumber)

            firstLine = newNumber + firstLine.slice(digitsStr.length);

            if (newlineIndex !== -1) {
              dataText = firstLine + dataText.slice(newlineIndex);
            } else {
              dataText = firstLine;
            }
          }
        }

        const modifiedResponse = new Response(dataText, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
        return modifiedResponse;
      } catch (e) {
        console.error("Ошибка обработки ответа:", e);
        return response;
      }
    }

    return originalFetch.apply(this, args);
  };
})();