// ==UserScript==
// @name         hotpot.ia unlimited
// @namespace    https://tampermonkey.org
// @version      0.2
// @description  Removes the local cooldowns for hotpot.ai allowing you to generate multiple images at once!+ ad ft
// @author       wolftdb 
// @match      *://hotpot.ai/art-generator
// @icon https://www.google.com/s2/favicons?sz=64&domain=hotpot.ai
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471977/hotpotia%20unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/471977/hotpotia%20unlimited.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var css = ".disabled { pointer-events: all; opacity: 1; }";
    var js = "localStorage.setItem('ai.hotpot.helpers.requestCounter.8', '{\"lastRequestTime\":\"2023-03-12T03:24:37.586Z\",\"numRequests\":-69420}');";
 
    const style = document.createElement('style');
    style.textContent = css;
    document.head.append(style);
 
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.text = js;
    document.body.appendChild(script);
})();

(function() {
    'use strict';

    const downloadAllBtn = document.createElement("button");
    downloadAllBtn.textContent = "Download All";
    document.querySelector(".numImagesBox").appendChild(downloadAllBtn);

    const qualitySelect = document.createElement("select");
    const jpgOption = document.createElement("option");
    jpgOption.value = "jpg";
    jpgOption.textContent = "JPG (High Quality)";
    const pngOption = document.createElement("option");
    pngOption.value = "png";
    pngOption.textContent = "PNG (High Quality)";
    qualitySelect.appendChild(jpgOption);
    qualitySelect.appendChild(pngOption);

    downloadAllBtn.style.backgroundColor = "#007bff";
    downloadAllBtn.style.color = "#fff";
    downloadAllBtn.style.border = "none";
    downloadAllBtn.style.padding = "0.5rem 1rem";
    downloadAllBtn.style.borderRadius = "0.25rem";
    downloadAllBtn.style.cursor = "pointer";
    downloadAllBtn.style.marginLeft = "1rem";

    qualitySelect.style.marginLeft = "1rem";
    qualitySelect.style.padding = "0.5rem";
    qualitySelect.style.borderRadius = "0.25rem";
    qualitySelect.style.fontSize = "1rem";

    downloadAllBtn.addEventListener("click", async () => {
        const quality = qualitySelect.value;
        const extension = quality === "jpg" ? "jpg" : "png";

        const zip = new JSZip();
        const images = document.querySelectorAll("img");
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            const response = await fetch(img.src);
            const blob = await response.blob();
            const fileName = `image-${i}.${extension}`;
            zip.file(fileName, blob);
        }

        zip.generateAsync({ type: "blob" }).then((content) => {
            const url = URL.createObjectURL(content);
            const a = document.createElement("a");
            a.href = url;
            a.download = "images.zip";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    });

    document.querySelector(".numImagesBox").insertAdjacentElement("afterend", qualitySelect);
})();
