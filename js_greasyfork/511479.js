// ==UserScript==
// @name         Tự động referrals
// @version      1.0.7
// @namespace    http://tampermonkey.net/
// @description  Tự động referrals cho plutonodes.net
// @author       DinoVN
// @license      MIT
// @match        https://client.plutonodes.net/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=plutonodes.net
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/511479/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20referrals.user.js
// @updateURL https://update.greasyfork.org/scripts/511479/T%E1%BB%B1%20%C4%91%E1%BB%99ng%20referrals.meta.js
// ==/UserScript==

let gmc = new GM_config(
    {
        "id": "Config", // The id used for this instance of GM_config
        "title": "Script Settings", // Panel Title
        "fields": // Fields object
            {
                "referrals": // This is the id of the field
                    {
                        "label": "Referrals", // Appears next to field
                        "type": "text", // Makes this setting a text field
                        "default": "dino", // Default value if user doesn't change it
                    },
                "userID": // This is the id of the field
                    {
                        "label": "User ID", // Appears next to field
                        "type": "text", // Makes this setting a text field
                        "default": "1", // Default value if user doesn't change it
                    },
                "notification_affter_done": {
                    "label": "Notification after done",
                    "type": "checkbox",
                    "default": true,
                },
            },
        "events": {
            "save": function () { // runs after initialization completes
                this.close();
            },
        },
    },
);

const duoi = "@plutonodes.net";

function generatePassword() {
    const length = 12;
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const number = "0123456789";
    let password = "";

    for (let i = 0; i < length; i++) {
        let randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }

    for (let i = 0; i < 5; i++) {
        let randomIndex = Math.floor(Math.random() * number.length);
        password += number[randomIndex];
    }

    return password;
}

let onInit = (config) =>
    new Promise((resolve) => {
        let isInit = () =>
            setTimeout(() => config.isInit ? resolve() : isInit(), 0);
        isInit();
    });

(async function () {
    "use strict";

    if (window.location.href.includes("client.plutonodes.net/register")) {
        const grecaptcha = document.querySelector(".g-recaptcha");
        grecaptcha.setAttribute("data-callback", "captraOnSubmit");
    }

    let init = onInit(gmc);
    init.then(async () => {
        unsafeWindow.openConfig = function () {
            gmc.open();
        };

        let referrals = await gmc.get("referrals");
        let userID = await gmc.get("userID");

        console.log(referrals, userID)


        console.log(window.location.href);
        if (window.location.href.includes("client.plutonodes.net/register")) {
            const random = generatePassword();
            const username = document.getElementById("username");
            const email = document.getElementById("email");
            const password = document.getElementById("password");
            const confirmPassword = document.getElementById("confirmPassword");

            const div = document.querySelector(".mt-6");
            const p = document.createElement("p");
            p.innerHTML =
                `Settings: <a class="text-orange-400 hover:underline" onClick="openConfig()" >Click here</a>`;
            p.className = "text-sm text-gray-400";
            div.appendChild(p);

            username.value = random;
            email.value = `${random}${duoi}`;
            password.value = random + "*";
            confirmPassword.value = random + "*";

            unsafeWindow.captraOnSubmit = function (response) {
                document.querySelector('button[type="submit"]').click();
            };

            GM_setValue("random", random);
        } else if (window.location.href == "https://client.plutonodes.net/") {
            const random = GM_getValue("random");

            console.log("random", random);

            if (!random || random == "") {
                window.location.href = "https://client.plutonodes.net/register";
                return;
            }

            const email = document.getElementById("email");
            const password = document.getElementById("password");

            email.value = random + duoi;
            password.value = random + "*";

            let loginButton = document.querySelector('button[type="submit"]');
            loginButton.click();
            GM_setValue("random", "");
        } else if (
            window.location.href == "https://client.plutonodes.net/dashboard"
        ) {
            window.location.href = "https://client.plutonodes.net/daily-coins";
        } else if (
            window.location.href ==
                "https://client.plutonodes.net/account?err=none"
        ) {
            window.location.href =
                `https://client.plutonodes.net/giftcoins?id=${userID}&coins=400`;
        } else if (
            window.location.href ==
                "https://client.plutonodes.net/dashboard?err=none"
        ) {
            window.location.href =
                `https://client.plutonodes.net/claim?code=${referrals}`;
        } else if (
            window.location.href ==
                "https://client.plutonodes.net/transfer?err=none"
        ) {
            let notifi = await gmc.get("notification_affter_done");
            if (notifi) alert("Đã referrals và chuyển tiền thành công");
            window.location.href = "https://client.plutonodes.net/logout";
        }
    });
})();
