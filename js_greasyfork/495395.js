// ==UserScript==
// @name         RPGEN - マップ編集機能の修正
// @namespace    https://github.com/sqrtox/userscript-rpgen-map-editor-fix
// @version      1.0.3
// @description  RPGENのマップ編集に関する問題を修正します。
// @author       You
// @match        https://rpgen.site/dq/?map=*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABQklEQVQ4T3VTW47CMBBLwt8KwckKF+FxFKTehN5sBctfEzzPDKWbopI2E8ceu3m4PlqqyUfBrPKt4Zb7wnJWsAmFeTgDAMPKp3GbDpcnIfCWgotGxUVzfsvFFX8EcAIAHaQI0/gDgD89ncoFQMAMttNxBrZ6B4PjmRhgA4DpZN9aABHkUo0AFBw/oxo/kfBQBkJ+GndBlvEoqWFbZ8AqKjCUMsmi0xiUZL0SE1hlEAS6ToYXF3pju3abdQbcxDXrZgDsVYJIio2FC7+tZdgRwL+7LcD+nnpWZQcz8GeqmE235cGQ1Xd6DERdAoNssAaGGSmbbuj8Vez04Vnp4BykhlRtLGVabY37lhNtjTYuK+1Z3YjL0ZV8RA/Y2rWc/vP+A2D5MS2dRt44Xp+9kIxQsPxj8oBy2kKb9ctLjarVALetpjdO1bDQIClbewAAAABJRU5ErkJggg==
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495395/RPGEN%20-%20%E3%83%9E%E3%83%83%E3%83%97%E7%B7%A8%E9%9B%86%E6%A9%9F%E8%83%BD%E3%81%AE%E4%BF%AE%E6%AD%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/495395/RPGEN%20-%20%E3%83%9E%E3%83%83%E3%83%97%E7%B7%A8%E9%9B%86%E6%A9%9F%E8%83%BD%E3%81%AE%E4%BF%AE%E6%AD%A3.meta.js
// ==/UserScript==

"use strict";
{
    const nativeJQueryOn = $.prototype.on;

    let tileX, tileY;

    const setTilePos = () => {
        const hero = humans[0];

        if (!hero) {
            throw new Error("Unexpected hero");
        }

        tileX = dq.getTileXInMapSize(hero.oldTileX);
        tileY = dq.getTileYInMapSize(hero.oldTileY);
    };

    $.prototype.on = function (...args) {
        if (this.get(0) === document && args[0] === "click" && args[1] === "#idBtnDqEditEnd") {
            return nativeJQueryOn.call(
                this,
                args[0],
                args[1],
                function (...handlerArgs) {
                    if (tileX === undefined || tileY === undefined) {
                        setTilePos();
                    }

                    const e = rpgEG.ePoints.find(e => e.tileX === tileX && e.tileY === tileY);

                    if (e?.isEnable) {
                        dqOverwriteEPoint(tileX, tileY);
                    }

                    return args[2].call(this, ...handlerArgs);
                }
            );
        }

        return nativeJQueryOn.call(this, ...args);
    };

    const handler = () => {
        setTilePos();
    };

    const observer = new MutationObserver(() => {
        const elements = document.querySelectorAll("#idBtnLoadEPoint");

        for (const element of elements) {
            element.addEventListener("click", handler);
        }
    });

    observer.observe(document.getElementById("idDqEditArea"), {
        childList: true,
        subtree: true
    });
}
