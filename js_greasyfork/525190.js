// ==UserScript==
// @name         Skip half-chapters
// @namespace    http://tampermonkey.net/
// @description  Changes "Next chapter" button to the next full chapter if present
// @author       You
// @match        https://chapmanganato.to/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chapmanganato.to
// @grant        none
// @version      1.3
// @downloadURL https://update.greasyfork.org/scripts/525190/Skip%20half-chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/525190/Skip%20half-chapters.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const buttons = document.querySelectorAll(".navi-change-chapter-btn-next");
    console.log(buttons);
    const fullChapterName = document.querySelector(
        ".navi-change-chapter",
    ).value;
    const num = fullChapterName.includes(":")
        ? fullChapterName.split(":")[0].replace("Chapter ", "")
        : fullChapterName.replace("Chapter ", "");

    if (num.includes("-") || num.includes(".")) {
        console.warn("Current chapter is half chapter, skipping");
        return;
    }

    const currentChapter = parseInt(num);
    const chapters = [
        ...document.querySelectorAll(".navi-change-chapter option"),
    ];
    let nextChapterExists = false;
    for (const option of chapters) {
        if (option.getAttribute("data-c") !== (currentChapter + 1).toString())
            continue;
        const fullNextChapterName = option.value;
        const nextNum = fullNextChapterName.includes(":")
            ? fullNextChapterName.split(":")[0].replace("Chapter ", "")
            : fullNextChapterName.replace("Chapter ", "");
        if (nextNum.includes(".") || nextNum.includes("-")) continue;
        nextChapterExists = true;
        break;
    }
    if (!nextChapterExists) {
        console.warn("No next chapter, exiting");
        return;
    }

    const nextUrl = location.href.replace(
        /\/chapter-(.+)/,
        `/chapter-${currentChapter + 1}`,
    );
    console.log("Next chapter url", nextUrl);

    for (const button of buttons) {
        button.href = nextUrl;
        button.innerHTML = "NEXT CHAPTER (FULL) <i></i>";
    }
})();
