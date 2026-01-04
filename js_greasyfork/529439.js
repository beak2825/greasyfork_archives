// ==UserScript==
// @name         Google Auto Translate
// @namespace    https://greasyfork.org/en/users/1030895-universedev
// @author      UniverseDev
// @license     GPL-3.0-or-later
// @version      1.7
// @description  Uses Google Translate widget first, only loading iframe if necessary.
// @match        *://*/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/529439/Google%20Auto%20Translate.user.js
// @updateURL https://update.greasyfork.org/scripts/529439/Google%20Auto%20Translate.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const STORAGE_KEY = "userTranslateLang";
    const DEFAULT_LANG = "en";

    const getUserLanguage = () => localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

    const detectPageLanguage = () =>
        document.documentElement.lang || document.querySelector("html")?.getAttribute("lang") || null;

    const isAlreadyTranslated = () =>
        document.body.classList.contains("translated-ltr") || document.body.classList.contains("translated-rtl");

    const insertGoogleTranslateWidget = () => {
        if (document.getElementById("google_translate_element")) return;

        const translateDiv = document.createElement("div");
        translateDiv.id = "google_translate_element";
        translateDiv.style = "position: fixed; bottom: 10px; right: 10px; z-index: 100000;";
        document.body.appendChild(translateDiv);

        const script = document.createElement("script");
        script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateInit";
        document.body.appendChild(script);
    };

    unsafeWindow.googleTranslateInit = () => {
        new google.translate.TranslateElement(
            { pageLanguage: "auto", includedLanguages: getUserLanguage(), autoDisplay: true, multilanguagePage: true },
            "google_translate_element"
        );

        const translateWidget = document.querySelector(".goog-te-combo");
        if (translateWidget) {
            translateWidget.value = getUserLanguage();
            translateWidget.dispatchEvent(new Event("change"));
        }

        setTimeout(async () => {
            if (!isAlreadyTranslated() && (await shouldFallbackToIframe())) {
                createTranslateOverlay(getUserLanguage());
            }
        }, 5000); // Give time for widget translation
    };

    const shouldFallbackToIframe = async () => {
        const pageLang = detectPageLanguage();
        const targetLang = getUserLanguage();

        if (pageLang && pageLang.toLowerCase() === targetLang.toLowerCase()) return false;
        if (isAlreadyTranslated()) return false;

        return await canEmbedIframe();
    };

    const canEmbedIframe = () => {
        return new Promise((resolve) => {
            const testIframe = document.createElement("iframe");
            testIframe.style.display = "none";
            testIframe.src = "https://www.google.com"; // Safe test URL

            testIframe.onload = () => {
                document.body.removeChild(testIframe);
                resolve(true);
            };

            testIframe.onerror = () => {
                document.body.removeChild(testIframe);
                resolve(false);
            };

            document.body.appendChild(testIframe);
            setTimeout(() => {
                if (document.body.contains(testIframe)) {
                    document.body.removeChild(testIframe);
                    resolve(false);
                }
            }, 2000);
        });
    };

    const createTranslateOverlay = (targetLang) => {
        if (document.getElementById("googleTranslateIframe")) return;

        const translateUrl = `https://translate.google.com/translate?hl=${targetLang}&sl=auto&tl=${targetLang}&u=${encodeURIComponent(location.href)}`;

        const iframe = document.createElement("iframe");
        Object.assign(iframe, {
            id: "googleTranslateIframe",
            src: translateUrl,
            style: "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; border: none; z-index: 99999; background-color: #fff;",
        });

        document.body.appendChild(iframe);
    };

    window.addEventListener("load", () => {
        if (!isAlreadyTranslated()) {
            insertGoogleTranslateWidget();
        }
    });
})();
