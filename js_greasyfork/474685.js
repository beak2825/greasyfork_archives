// ==UserScript==
// @name         解決缺字問題和改善Emoji顯示效果
// @namespace    https://greasyfork.org/scripts/474685
// @version      0.9
// @description  使用天珩全字庫和Noto Color Emoji改善缺字和Emoji顯示效果
// @author       fmnijk
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=unicode.org
// @icon         https://www.google.com/s2/favicons?domain=getemoji.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474685/%E8%A7%A3%E6%B1%BA%E7%BC%BA%E5%AD%97%E5%95%8F%E9%A1%8C%E5%92%8C%E6%94%B9%E5%96%84Emoji%E9%A1%AF%E7%A4%BA%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/474685/%E8%A7%A3%E6%B1%BA%E7%BC%BA%E5%AD%97%E5%95%8F%E9%A1%8C%E5%92%8C%E6%94%B9%E5%96%84Emoji%E9%A1%AF%E7%A4%BA%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

function main() {
    'use strict'

    changeFontFace();

    // Define the font you want to add
    const frontFont = '';
    const beforeSansSerifFont = '"FZZhunYuan-M02", "Segoe UI Symbol", "Segoe UI Emoji", "Segoe UI Symbol Original", "Segoe UI Emoji Original", "EmojiTwo COLRv0 Regular", "OpenMoji Color", "Javanese Text", TH-Times, TH-Tshyn-P0, TH-Tshyn-P1, TH-Tshyn-P2, TH-Tshyn-P16';
    const backFont = '';

    updateFontFamily(frontFont, "front");
    updateFontFamily(beforeSansSerifFont, "before-sans-serif");
    updateFontFamily(backFont, "back");
}

function changeFontFace() {
    var styles = `
        @font-face{font-family:'SegoeUI';src:url('https://fmnijk.github.io/font/NotoColorEmoji.woff2') format('woff2');}
        @font-face{font-family:'Segoe UI';src:url('https://fmnijk.github.io/font/NotoColorEmoji.woff2') format('woff2');}
        @font-face{font-family:'Segoe UI Symbol';src:url('https://fmnijk.github.io/font/NotoColorEmoji.woff2') format('woff2');}
        @font-face{font-family:'Segoe UI Symbol Original';src:url('https://fmnijk.github.io/font/seguisym.ttf') format('truetype');}
        @font-face{font-family:'Segoe UI Emoji';src:url('https://fmnijk.github.io/font/NotoColorEmoji.woff2') format('woff2');}
        @font-face{font-family:'Segoe UI Emoji Original';src:url('https://fmnijk.github.io/font/seguiemj.ttf') format('truetype');}
        @font-face{font-family:'EmojiTwo COLRv0 Regular';src:url('https://fmnijk.github.io/font/EmojiTwo.woff2') format('woff2');}
        /*@font-face{font-family:'OpenMoji Black';src:url('https://fmnijk.github.io/font/OpenMoji-Black.woff2') format('woff2');}*/
        @font-face{font-family:'OpenMoji Color';src:url('https://fmnijk.github.io/font/OpenMoji-Regular.woff2') format('woff2');}
        @font-face{font-family:TH-Times;src:local('TH-Times'),url('https://fmnijk.github.io/font/TH-Times.ttf') format('truetype');}
        @font-face{font-family:TH-Tshyn-P0;src:local('TH-Tshyn-P0'),url('https://fmnijk.github.io/font/TH-Tshyn-P0.ttf') format('truetype');}
        @font-face{font-family:TH-Tshyn-P1;src:local('TH-Tshyn-P1'),url('https://fmnijk.github.io/font/TH-Tshyn-P1.ttf') format('truetype');}
        @font-face{font-family:TH-Tshyn-P2;src:local('TH-Tshyn-P2'),url('https://fmnijk.github.io/font/TH-Tshyn-P2.ttf') format('truetype');}
        @font-face{font-family:TH-Tshyn-P16;src:local('TH-Tshyn-P16'),url('https://fmnijk.github.io/font/TH-Tshyn-P16.ttf') format('truetype');}
        `;

    GM_addStyle(styles);
}

// Define a function to find and update all style sheets with font family
function updateFontFamily(newFont, position) {

    // Check if newFont is empty or only has whitespace characters
    if (!newFont || !newFont.trim()) {
        // If so, return without doing anything
        return;
    }

    // Loop through all the style sheets in the document
    for (let i = 0; i < document.styleSheets.length; i++) {
        // Get the current style sheet
        const styleSheet = document.styleSheets[i];

        // Try to access its rules
        try {
            // Loop through all the rules in the style sheet
            for (let j = 0; j < styleSheet.cssRules.length; j++) {

                // Get the current rule
                const rule = styleSheet.cssRules[j];

                // Check if the rule has a style property
                if (rule.style) {
                    // Check if the rule has a font-family property
                    if (rule.style.getPropertyValue("font-family")) {
                        // Get the current value of the font-family property
                        const currentValue = rule.style.getPropertyValue("font-family");

                        // Declare a newValue variable with let
                        let newValue;

                        // Check the position parameter
                        if (position === "front") {
                            // Prepend the new font to the beginning of the font-family value
                            newValue = newFont + ", " + currentValue;
                        } else if (position === "back") {
                            // Append the new font to the end of the font-family value
                            newValue = currentValue + ", " + newFont;
                        } else if (position === "before-sans-serif") {
                            // Insert the new font before sans-serif in the font-family value

                            // Check if the current value contains sans-serif
                            if (currentValue.includes("sans-serif")) {
                                // If so, replace sans-serif with new font and sans-serif
                                newValue = currentValue.replace("sans-serif", newFont + ", sans-serif");
                            } else {
                                // If not, append new font to the end of the current value
                                newValue = currentValue + ", " + newFont;
                            }
                        } else {
                            // If the position is invalid, throw an error
                            throw new Error("Invalid position: " + position);
                        }

                        // Set the new value for the font-family property
                        rule.style.setProperty("font-family", newValue);
                    }
                }
            }
        } catch (error) {
            // If there is an error, log it and continue
            console.log(error);
            continue;
        }
    }

    // Add a new line of code to get the computed style of the body element
    let computedStyle = window.getComputedStyle(document.body);

    // Get the value of the font-family property
    let bodyFontFamily = computedStyle.getPropertyValue("font-family");

    // Declare a bodyNewValue variable with let
    let bodyNewValue;

    // Check the position parameter
    if (position === "front") {
        // Prepend the new font to the beginning of the body's font family value
        bodyNewValue = newFont + ", " + bodyFontFamily;
    } else if (position === "back") {
        // Append the new font to the end of the body's font family value
        bodyNewValue = bodyFontFamily + ", " + newFont;
    } else if (position === "before-sans-serif") {
        // Insert the new font before sans-serif in the body's font family value

        // Check if the body's font family value contains sans-serif
        if (bodyFontFamily.includes("sans-serif")) {
            // If so, replace sans-serif with new font and sans-serif
            bodyNewValue = bodyFontFamily.replace("sans-serif", newFont + ", sans-serif");
        } else {
            // If not, append new font to the end of the body's font family value
            bodyNewValue = bodyFontFamily + ", " + newFont;
        }
    } else {
        // If the position is invalid, throw an error
        throw new Error("Invalid position: " + position);
    }

    // Add a new line of code to use GM_addStyle to add a new style rule for the body's font family
    GM_addStyle(`body { font-family: ${bodyNewValue} !important; }`);
}

main();










