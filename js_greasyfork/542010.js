// ==UserScript==
// @name         Naver Helper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add "Open on Series" and "Click to copy ID" buttons on Naver Comic/Series
// @description:ru  Добавляет "Open on Series" и "Click to copy ID" кнопки на Naver Comic/Series
// @match        https://comic.naver.com/*
// @match        https://series.naver.com/*
// @grant        GM_setClipboard
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542010/Naver%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/542010/Naver%20Helper.meta.js
// ==/UserScript==

(function () {
  const host = location.hostname;

  if (host.includes("comic.naver.com")) {
    const origOpen = XMLHttpRequest.prototype.open;
    const origSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      this._url = url;
      return origOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
      this.addEventListener("load", function () {
        if (this._url && this._url.includes("article/list/info")) {
          const contentsNo = JSON.parse(this.responseText)["contentsNo"];
          
          const waitForSpiButton = setInterval(() => {
            const spiButton = document.getElementById('spiButton');
            if (!spiButton) return;
            clearInterval(waitForSpiButton);
            const container = spiButton.parentElement;

            const newLink = document.createElement('a');
            newLink.href = `https://series.naver.com/comic/detail.series?originalProductId=${contentsNo}`;
            newLink.id = "goToSeries";
            newLink.innerText = "Open on Series";
            newLink.className = spiButton.className.split(" ")[0];

            container.appendChild(newLink);
          }, 100);
        }
      });
      return origSend.apply(this, arguments);
    };
  }

  if (host.includes("series.naver.com")) {
    const observeVolumeList = () => {
      const volumeList = document.getElementById("volumeList");
      if (!volumeList) return;

      const observer = new MutationObserver(() => {
        const viewers = document.querySelectorAll("a.btn_viewer");

        viewers.forEach(el => {
          el.classList.forEach(cls => {
            const match = cls.match(/_lanuchVolumnViewerAfterAction\(COMIC,(\d+),(\d+),(\d+),.*\)/);
            if (match) {
              const volumeId = match[1];
              const episodeId = match[2];

              let tr = el.closest("tr");
              if (!tr) return;

              const targetDiv = tr.querySelector("td.subj > div");
              if (!targetDiv) return;

              if (targetDiv.querySelector(".click-to-copy")) return;

              const copyBtn = document.createElement("a");
              copyBtn.className = "_root_1l6ee_1 click-to-copy";
              copyBtn.innerText = "Click to copy ID";
              copyBtn.href = "#";
              copyBtn.style.marginLeft = "15px";

              copyBtn.onclick = (e) => {
                e.preventDefault();
                const text = `${volumeId} ${episodeId}`;
                GM_setClipboard ? GM_setClipboard(text) : navigator.clipboard.writeText(text);
              };

              targetDiv.appendChild(copyBtn);
            }
          });
        });
      });

      observer.observe(volumeList, { childList: true, subtree: true });
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", observeVolumeList);
    } else {
      observeVolumeList();
    }
  }
})();
