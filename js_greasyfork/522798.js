// ==UserScript==
// @name         custommamonts for lolz
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Custom mamonts falling from sky!
// @author       k3kzia
// @license      MIT
// @match        https://lolz.live/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      raw.githubusercontent.com
// @connect      githubraw.com
// @downloadURL https://update.greasyfork.org/scripts/522798/custommamonts%20for%20lolz.user.js
// @updateURL https://update.greasyfork.org/scripts/522798/custommamonts%20for%20lolz.meta.js
// ==/UserScript==

(function () {
  "use strict";

  console.log("Custommamonts init..");

  const defaultImageUrl =
    "https://raw.githubusercontent.com/quickyyy/lolzmamonti/refs/heads/main/ja438j6d0-javascript-logo-javascript-logo-vector-eps-136-86-kb-download.webp";

  let customImageUrl = GM_getValue("customImageUrl", defaultImageUrl);

  console.log("Ссылка на картинку:", customImageUrl);

  GM_registerMenuCommand("Поставить кастомную картинку", setCustomImageUrl);

  function setCustomImageUrl() {
    const userUrl = prompt("Введите ссылку на картинку:", customImageUrl);

    if (userUrl && userUrl.trim() !== "") {
      GM_setValue("customImageUrl", userUrl.trim());
      alert("Кастомная картинка обновлена.");

      location.reload();
    } else {
      alert("Неверная ссылка.");
    }
  }

  const githubScriptUrl =
    "https://githubraw.com/quickyyy/lolzmamonti/main/mamonts.js";

  GM_xmlhttpRequest({
    method: "GET",
    url: githubScriptUrl,
    onload: function (response) {
      if (response.status === 200) {
        console.log("Загрузил гитхаб скрипт.");

        let scriptContent = response.responseText.replace(
          /{{CUSTOM_IMAGE_URL}}/g,
          customImageUrl
        );

        console.log("Полученный скрипт:", scriptContent);

        const scriptElement = document.createElement("script");
        scriptElement.textContent = scriptContent;
        document.head.appendChild(scriptElement);
        console.log(
          "Загрузил скрипт с ссылкой:",
          customImageUrl
        );
      } else {
        console.error(
          "Ошибка загрузки скрипта с гитхаб. Статус:",
          response.status
        );
      }
    },
    onerror: function () {
      console.error("Ошибка загрузки скрипта с гитхаба.");
    },
  });
})();
