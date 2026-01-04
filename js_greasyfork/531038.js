// ==UserScript==
// @name         Lokalizacja itp. Zwroty/Reklamacja | IAI
// @namespace    http://butosklep.pl/panel/
// @version      0.2
// @description  Button allegro, lokalizacja produktów
// @author       Marcin
// @match        https://butosklep.pl/panel/rma.php?action=edit&id_r=*
// @match        https://butosklep.iai-shop.com/panel/rma.php?action=edit&id_r=*
// @match        https://butosklep.pl/panel/returns.php?action=edit&id*
// @match        https://butosklep.iai-shop.com/panel/returns.php?action=edit&id*
// @icon         https://butosklep.pl/gfx/pol/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531038/Lokalizacja%20itp%20ZwrotyReklamacja%20%7C%20IAI.user.js
// @updateURL https://update.greasyfork.org/scripts/531038/Lokalizacja%20itp%20ZwrotyReklamacja%20%7C%20IAI.meta.js
// ==/UserScript==
function makeLocationHTML() {
  const parentElements = document.querySelectorAll("[id^='yui-rec']");
  const productCodes = new Set();

  parentElements.forEach((parentElement) => {
    const codeElement = parentElement.querySelector(".yui-dt0-col-code .yui-dt-liner");
    if (codeElement) {
      const productCodeElement = codeElement.querySelector("a.nohref");
      if (productCodeElement) {
        let productCode = productCodeElement.textContent.trim().split("\n")[0];
        productCode = productCode.replace(/\(.+\)$/, "").trim();
        if (productCode) {
          productCodes.add(productCode);
        }
      }
    }
  });


  if (productCodes.size > 0) {
    const barcodesArray = [...productCodes];

    fetch(`https://butosklep.cfolks.pl/descriptions_app/api/products/info/sizecode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ barcodes: barcodesArray }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (Object.keys(data).length > 0) {
          const productsInfo = data;

          productsInfo.forEach((productInfo) => {
            const { foundBy, stockLocations, delivererName } = productInfo;
            const parentElement = Array.from(parentElements).find(parent => {
              const productCodeElement = parent.querySelector(".yui-dt0-col-code .yui-dt-liner a.nohref");
              return productCodeElement && productCodeElement.textContent.includes(foundBy);
            });

            if (parentElement) {
              const codeElement = parentElement.querySelector(".yui-dt0-col-code .yui-dt-liner");
              if (codeElement) {
                const locationsText = stockLocations
                  .map((location) => `${location.location}`)
                  .join("<br>");

                const delivererInfo = delivererName ? `<br>Dostawca: ${delivererName}` : '';

                const newSpan = document.createElement("span");
                newSpan.innerHTML = `Lokalizacja:<br>${locationsText}${delivererInfo}`;

                const weightSpan = Array.from(codeElement.querySelectorAll("span")).find((span) => span.textContent.includes("Waga:"));
                if (weightSpan) {
                  const br1 = document.createElement("br");
                  const br2 = document.createElement("br");
                  weightSpan.insertAdjacentElement("afterend", newSpan);
                  newSpan.insertAdjacentElement("beforebegin", br2);
                  br2.insertAdjacentElement("beforebegin", br1);
                }
              }
            }
          });
        } else {
          console.error("Empty response data: ", data);
        }
      })
      .catch((error) => console.error("Error fetching product info:", error));
  }
}

function deferExecution() {
  setTimeout(() => {
    makeLocationHTML();
  }, 2000);
}

window.onload = function () {
  deferExecution();
};
