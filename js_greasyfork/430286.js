// ==UserScript==
// @name         新しい放置ゲームでポイント毎秒とポイント毎分を表示する
// @namespace    https://dem08656775.github.io/newincrementalgame/
// @version      0.8
// @description  秒、分、時間ごとのポイント増加を表示します。
// @author       magurofly
// @match        https://dem08656775.github.io/newincrementalgame/
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/430286/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E6%AF%8E%E7%A7%92%E3%81%A8%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E6%AF%8E%E5%88%86%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/430286/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E6%AF%8E%E7%A7%92%E3%81%A8%E3%83%9D%E3%82%A4%E3%83%B3%E3%83%88%E6%AF%8E%E5%88%86%E3%82%92%E8%A1%A8%E7%A4%BA%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = unsafeWindow.document.getElementById("app");
    const app = container.__vue_app__;
    const ctx = app._instance.ctx;
    const Decimal = unsafeWindow.Decimal;
    const pl = ctx.player;

    const eGenerators = document.getElementsByClassName("generator");

    const el = document.createElement("div");
    Object.assign(el.style, {
        textAlign: "center",
        fontFamily: "monospace",
        fontSize: "1.25rem",
    });
    el.innerHTML =
`<span style="color: orange" class="pps">0.00e+0</span> ポイント毎秒,
<span style="color: orange" class="ppm">0.00e+0</span> ポイント毎分,
<span style="color: orange" class="pph">0.00e+0</span> ポイント毎時`;
    const pps = el.querySelector(".pps");
    const ppm = el.querySelector(".ppm");
    const pph = el.querySelector(".pph");
    const before = document.getElementById("tickspeed");
    before.parentElement.insertBefore(el, before.nextSibling);

    const _update = ctx.update.bind(ctx);
    let prevTime = Date.now();
    let prevCounts = new Array(9).fill(new Decimal(0));
    let prevDiffs = new Array(9).fill(new Decimal(0));
    let count = 0;
    const objectDuration = 200;
    let Count = 1;
    const update = () => {
        _update();
        count = (count + 1) % Count;
        if (count == 0) {
            const nextTime = Date.now();
            if (Count > 1 && nextTime - prevTime > objectDuration) {
                Count--;
            } else if (nextTime - prevTime < objectDuration) {
                Count++;
            }
            prevDiffs[0] = prevDiffs[0].mul(0.5).add(pl.money.sub(prevCounts[0]).div(nextTime - prevTime).mul(0.5));
            prevCounts[0] = pl.money;
            for (let i = 0; i < 8; i++) {
                prevDiffs[i + 1] = prevDiffs[i + 1].mul(0.5).add(pl.generators[i].sub(prevCounts[i + 1]).div(nextTime - prevTime).mul(0.5));
                prevCounts[i + 1] = pl.generators[i];
            }
            prevTime = nextTime;
            const ppt = prevDiffs[0];
            const tickSec = 1000;
            const tickMin = 60 * tickSec;
            const tickHour = 60 * tickMin;
            pps.textContent = (ppt * tickSec).toExponential(2);
            ppm.textContent = (ppt * tickMin).toExponential(2);
            pph.textContent = (ppt * tickHour).toExponential(2);
            for (let i = 0; i < 8; i++) {
                eGenerators[i].children[0].title = `${prevDiffs[i + 1].mul(1000).toExponential(2)} /sec`;
            }
        }
    };

    ctx.update = update;
})();