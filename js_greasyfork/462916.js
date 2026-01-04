// ==UserScript==
// @name        Copiable Operation ID For Swagger UI API Docs
// @name:fr     ID opération copiable pour docs API Swagger UI
// @namespace   tomchen.org
// @include     https://*
// @include     http://*
// @grant       GM_setClipboard
// @version     1.1
// @author      Tom Chen (tomchen.org)
// @license     MIT
// @description Add operation ID, as well as an icon to copy the operation ID, to all API operations on any Swagger UI page
// @description:fr Ajoutez l'ID opération, ainsi qu'une icône pour copier l'ID opération, à toutes les opérations d'API sur une page de Swagger UI
// @downloadURL https://update.greasyfork.org/scripts/462916/Copiable%20Operation%20ID%20For%20Swagger%20UI%20API%20Docs.user.js
// @updateURL https://update.greasyfork.org/scripts/462916/Copiable%20Operation%20ID%20For%20Swagger%20UI%20API%20Docs.meta.js
// ==/UserScript==

const swaggerUi = document.getElementById("swagger-ui");
if (swaggerUi) {
  const opElId2opId = (opElId) => {
    const slices = opElId.split("-");
    return slices[slices.length - 1];
  };

  const addCopiableOpIdToOpBlock = (opBlock) => {
    const summary = opBlock.querySelector("div.opblock-summary");
    const arrow = opBlock.querySelector("button.opblock-control-arrow");
    const opId = opElId2opId(opBlock.id);
    if (!summary.querySelector(".opblock-summary-operation-id")) {
      const span = document.createElement("span");
      span.innerHTML = opId;
      span.className = "opblock-summary-operation-id";
      summary.insertBefore(span, arrow);
    }
    const span = opBlock.querySelector("span.opblock-summary-operation-id");
    if (!span.querySelector("div.copy-to-clipboard")) {
      const div = document.createElement("div");
      div.className = "view-line-link copy-to-clipboard";
      div.innerHTML =
        '<svg width="15" height="16"><use href="#copy" xlink:href="#copy"></use></svg>';
      div.addEventListener("click", (e) => {
        e.stopPropagation();
        GM_setClipboard(opId);
      });
      span.appendChild(div, arrow);
    }
  };

  const observeOptions = {
    subtree: true,
    childList: true,
    attributes: true,
  };

  const observeCallback = () => {
    const opBlocks = document.querySelectorAll(".opblock");
    if (opBlocks.length === 0) {
      return;
    }
    [...opBlocks].forEach(addCopiableOpIdToOpBlock);
  };
  const observer = new MutationObserver(observeCallback);
  observer.observe(swaggerUi, observeOptions);
}
