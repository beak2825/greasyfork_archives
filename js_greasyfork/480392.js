// ==UserScript==
// @name         updateContent
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Smoothly updates the content of an HTML element with an erase and write effect.
// @author       IgnaV
// @grant        none
// ==/UserScript==

const updateContent = (element, newContent, forceUpdate = false, totalTime = 2000) => {
    const currentContent = element.innerText;
    if (forceUpdate || currentContent !== newContent) {
        const intervalTime = totalTime / (currentContent.length + newContent.length);
        let i = currentContent.length - 1;
        const eraseInterval = setInterval(() => {
            element.innerText = currentContent.substring(0, i--);
            if (i < 0) {
                clearInterval(eraseInterval);
                let j = 0;
                const writeInterval = setInterval(() => {
                    element.innerText = newContent.substring(0, ++j);
                    if (j === newContent.length) {
                        clearInterval(writeInterval);
                    }
                }, intervalTime);
            }
        }, intervalTime);
    }
};
