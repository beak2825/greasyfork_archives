// ==UserScript==
// @name         Replace Links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allow user to replace all uptobox links at once
// @author       Maxou
// @match        https://www2.darkino.ink/*/view
// @icon         https://www.google.com/s2/favicons?sz=64&domain=darkino.ink
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471070/Replace%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/471070/Replace%20Links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!window.location.pathname.match(/\/panel\/mylinks\/\d+\/view/gi)) return;

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const container = document.querySelector(".filament-main-content");
    if (!container) return;
    const qualities = {
        "Web-Dl": [/web/gi],
        "Blu-ray": [/bd/gi, /blu-?ray/gi],
    };
    const languages = {
        french: [],
        original: [/vostfr/gi, /fre/gi],
        multilanguage: [],
        other: [],
    };
    const getEpisode = (name) => {
        var _a, _b, _c, _d, _e, _f, _g;
        const extension =
              (_b =
               (_a = name.match(/(?<=\.)[a-z0-9]{2,4}$/g)) === null || _a === void 0
               ? void 0
               : _a[0]) !== null && _b !== void 0
        ? _b
        : null;
        const heightString =
              (_c = name.match(/(?<=( |\.|\[))\d+(?=(p( |\.|\])))/gi)) === null ||
              _c === void 0
        ? void 0
        : _c[0];
        const height = heightString ? parseInt(heightString) : null;
        const quality =
              (_d = Object.keys(qualities)
               .map((key) => {
                  const regexr = qualities[key];
                  if (regexr.find((r) => name.match(r))) return key;
                  return null;
              })
               .find((q) => !!q)) !== null && _d !== void 0
        ? _d
        : null;
        const language =
              (_e = Object.keys(languages)
               .map((lang) => {
                  const language = lang;
                  const regexr = languages[language];
                  if (regexr.find((r) => name.match(r))) return language;
                  return null;
              })
               .find((q) => !!q)) !== null && _e !== void 0
        ? _e
        : "other";
        const seasonString =
              (_f = name.match(
                  /(?<=(( |\.)s))\d+(?=( |\.|e))|(?<= |\.)\d+(?=x\d+)/gi,
              )) === null || _f === void 0
        ? void 0
        : _f[0];
        const season = seasonString ? parseInt(seasonString) : null;
        let parsedName = name
        .replace(/ *\[[^\]]*\] */gi, "")
        .replace(/ *\([^)]*\) */gi, "")
        .replace(`.${extension}`, "")
        .replace(/(?<=(( |\.)s))\d+(?=( |\.|e))|(?<= |\.)\d+(?=x\d+)/gi, "")
        .replace(/[^\w ]+/gi, "")
        .split(" ")
        .map((part) => part.trim())
        .filter((part) => !!part.length)
        .join(" ");
        Object.values(languages)
            .reduce((r, l) => [...r, ...l], [])
            .map((r) => (parsedName = parsedName.replace(r, "")));
        const episodeString =
              (_g = parsedName
               .replace(/^\d+/g, "")
               .match(/((?!\.)e?\d+)|(?<=x)\d+/gi)) === null || _g === void 0
        ? void 0
        : _g[0];
        const episode = episodeString
        ? parseInt(episodeString.replace(/e/gi, ""))
        : null;
        parsedName = parsedName.replace(/((?!\.)e?\d+)|(?<=x)\d+/gi, "");
        return episode;
    };
    const formClasses = ["flex", "flex-col", "items-start", "gap-y-2", "my-8"];
    const textareaClasses = [
        "filament-forms-textarea-component",
        "filament-forms-input",
        "block",
        "w-full",
        "transition",
        "duration-75",
        "rounded-lg",
        "shadow-sm",
        "outline-none",
        "focus:border-primary-500",
        "focus:ring-1",
        "focus:ring-inset",
        "focus:ring-primary-500",
        "disabled:opacity-70",
        "dark:bg-gray-700",
        "dark:border-gray-600",
        "dark:text-white",
        "dark:focus:border-primary-500",
        "border-gray-300",
    ];
    const buttonClasses = [
        "filament-button",
        "filament-button-size-md",
        "inline-flex",
        "items-center",
        "justify-center",
        "py-1",
        "gap-1",
        "font-medium",
        "rounded-lg",
        "border",
        "transition-colors",
        "outline-none",
        "focus:ring-offset-2",
        "focus:ring-2",
        "focus:ring-inset",
        "dark:focus:ring-offset-0",
        "min-h-[2.25rem]",
        "px-4",
        "text-sm",
        "text-white",
        "shadow",
        "focus:ring-white",
        "border-transparent",
        "bg-primary-600",
        "hover:bg-primary-500",
        "focus:bg-primary-700",
        "focus:ring-offset-primary-700",
    ];
    const form = document.createElement("form");
    form.classList.add(...formClasses);
    const textarea = document.createElement("textarea");
    textarea.placeholder = `Veuillez rentrer le contenu de "Exporter" ici. (le 2ème)`;
    textarea.rows = 8;
    textarea.classList.add(...textareaClasses);
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Modifier les liens";
    submitButton.classList.add(...buttonClasses);
    form.addEventListener("submit", async (event) => {
        var _a;
        event.preventDefault();
        const table = document.querySelector("table");
        const elements = Array.from(
            (_a =
             table === null || table === void 0
             ? void 0
             : table.querySelectorAll("tbody tr")) !== null && _a !== void 0
            ? _a
            : [],
        );
        if (!elements.length) return;
        const content = textarea.value;
        const lines = content.split("\n");
        const episodes = lines
        .map((line) => {
            var _a;
            const url =
                  (_a = line.match(/https:\/\/uptobox.(eu|com)\/[a-zA-Z0-9]+/g)) ===
                  null || _a === void 0
            ? void 0
            : _a[0];
            if (!url) return null;
            const fileName = line.replace(url, "");
            const episode = getEpisode(fileName);
            if (!episode) return null;
            return { episode, url: url.replace(".eu", ".com") };
        })
        .filter(Boolean);
        if (!episodes.length) return;
        submitButton.classList.add("opacity-70");
        submitButton.disabled = true;
        submitButton.textContent = "Modification des liens...";
        for (const element of elements) {
            const [linkInput, episodeInput] = Array.from(
                element.querySelectorAll("input[x-model='state']"),
            );
            if (!linkInput.value.includes("uptobox")) continue;
            const episode = parseInt(episodeInput.value);
            const toReplace = episodes.find((x) => x.episode === episode);
            if (!toReplace || linkInput.value === toReplace.url) continue;
            linkInput.value = toReplace.url;
            const event = new Event("change", { bubbles: true });
            linkInput.dispatchEvent(event);
            await sleep(1000);
        }
        submitButton.textContent = "Modifier les liens";
        submitButton.classList.remove("opacity-70");
        submitButton.disabled = false;
        textarea.value = "";
    });
    form.appendChild(textarea);
    form.appendChild(submitButton);
    container.appendChild(form);
})();