// ==UserScript==
// @name         Fumen Emoji Export
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Emoji Export
// @author       MonkeyBoy
// @match        https://fumen.zui.jp/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542312/Fumen%20Emoji%20Export.user.js
// @updateURL https://update.greasyfork.org/scripts/542312/Fumen%20Emoji%20Export.meta.js
// ==/UserScript==

(function () {
    "use strict";

    let emoji_map = {
        "1": "📘",
        "6": "🟦",
        "2": "🟧",
        "3": "🟨",
        "7": "🟩",
        "5": "🟪",
        "4": "🟥",
        "8": "⬜",
        "0": "⬛",
        "\n": "                                       ",
    };

    const get_field = () => {
        const width = 10;
        const matrix = [];
        let trim = true;
        for (let i = 0; i < f.length; i += width) {
            const row = f.slice(i, i + width);
            if (trim && row.every((e) => e === 0)) {
                continue;
            }
            trim = false;
            matrix.push(row.join(""));
        }
        if (matrix.len != 0 && matrix.at(-1) === "0".repeat(width)) {
            matrix.pop();
        }
        return matrix.join("\n");
    };

    const fumen_export = (event) => {
        let field = get_field();

        if (event.ctrlKey) {
            let height = (field.match(/$/gm) || []).length;
            while ((field.match(/0$/gm) || []).length == height) {
                field = field.replaceAll(/0$/gm, "");
            }
            while ((field.match(/^0/gm) || []).length == height) {
                field = field.replaceAll(/^0/gm, "");
            }
        }
        for (const [mino, emoji] of Object.entries(emoji_map)) {
            field = field.replaceAll(mino, emoji);
        }

        navigator.clipboard.writeText(field);
    };

    const button = document.createElement("input");
    button.onclick = fumen_export;
    button.type = "button";
    button.value = "Copy as emoji";

    document.querySelector("body").appendChild(
        document.createElement("br"),
    );
    document.querySelector("body").appendChild(button);
})();
