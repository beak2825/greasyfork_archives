// ==UserScript==
// @name         Fuolah
// @namespace    http://tuculito.com
// @version      1.2.1
// @description  Fucking wuolah with sstyle
// @author       Alejandro12120 & Taxalo
// @match        https://wuolah.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wuolah.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @require      https://cdn.jsdelivr.net/npm/js-cookie@3.0.5/dist/js.cookie.min.js
// @downloadURL https://update.greasyfork.org/scripts/491278/Fuolah.user.js
// @updateURL https://update.greasyfork.org/scripts/491278/Fuolah.meta.js
// ==/UserScript==

(function () {
    "use strict";

    $(document).ready(() => {
        const alreadyDownloadedDocs = [];
        const downloadUrl = "https://api.wuolah.com/v2/download";

        const tokenCookie = Cookies.get("token");
        const machineCookie = Cookies.get("segMachineId");
        const referralCookie = Cookies.get("invitationCode");

        console.log("Loaded downloader with token: ", tokenCookie);

        setInterval(() => {
            const parent = document.querySelector("div.css-tm6h1a");

            if (!parent) return sendFileStatus(false); // If no parent found return

            let identificator;

            for (let i = 0; i < parent.childNodes.length; i++) {
                const file = parent.childNodes[i];

                if (!file.href) continue;
                if (!file.href.match(/(https:\/\/wuolah\.com\/apuntes\/)(?<=\/)(.*?)(?=\/).*/gm)) continue;

                try {
                    identificator = file.href.split("-").at(-1);
                    console.log(identificator)

                    if (identificator) break;
                } catch (error) {
                    continue;
                }
            }

            if (alreadyDownloadedDocs.includes(identificator)) return;
            const xhr = new XMLHttpRequest();
            xhr.open("POST", downloadUrl, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", `Bearer ${tokenCookie}`);

            const jsonData = JSON.stringify({
                "adblockDetected": false,
                "ads": [],
                "fileId": parseInt(identificator),
                "machineId": machineCookie,
                "noAdsWithCoins": false,
                "referralCode": (referralCookie ? referralCookie : ""),
                "ubication17ExpectedPubs": 1,
                "ubication17RequestedPubs": 1,
                "ubication1ExpectedPubs": 1,
                "ubication1RequestedPubs": 1,
                "ubication2ExpectedPubs": 5,
                "ubication2RequestedPubs": 5,
                "ubication3ExpectedPubs": 15,
                "ubication3RequestedPubs": 15
            });

            xhr.onload = function () {
                const response = JSON.parse(this.response);
                if (!response.url) return;

                window.open(response.url);

                /* 
                Big L to Wuolah.
                
                Thanks to Taxalo for reversing the algorithm.
                (https://github.com/taxalo)
                */
            };

            xhr.send(jsonData);
            alreadyDownloadedDocs.push(identificator);
        }, 2000); // 2 seconds
    });
})();
