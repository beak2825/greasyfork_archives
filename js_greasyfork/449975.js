// ==UserScript==
// @name         Fusion Kousu Keisan (Four Buttons)
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  All, +0.5, -0.5, Clearの4つのボタンで工数入力を効率化
// @author       mikada
// @match        https://exahrsrv.exa-corp.co.jp/fusionxp-webs/exa/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449975/Fusion%20Kousu%20Keisan%20%28Four%20Buttons%29.user.js
// @updateURL https://update.greasyfork.org/scripts/449975/Fusion%20Kousu%20Keisan%20%28Four%20Buttons%29.meta.js
// ==/UserScript==

let 工数th;
let totalMinutes;

// HH:MM 形式を分に変換
function parseTimeToMinutes(str) {
    if (!str || str.trim() === "") return 0;
    const match = str.match(/(\d+):(\d+)/);
    if (match) {
        return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
    }
    const num = parseInt(str, 10);
    return isNaN(num) ? 0 : num * 60;
}

// 分を HH:MM 形式に変換
function formatMinutesToTime(totalMin) {
    if (totalMin <= 0) return ""; // 0以下の場合は空文字にする（Clear時などのため）
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h}:${m < 10 ? '0' + m : m}`;
}

// 合計表示を更新
function updateDiffDisplay() {
    let kousuMinutes = 0;
    const kousuElems = document.getElementsByName("kousu");
    for (let elm of kousuElems) {
        if (elm.value !== "") {
            kousuMinutes += parseTimeToMinutes(elm.value);
        }
    }

    let d = totalMinutes - kousuMinutes;
    let flag = d < 0 ? "-" : "";
    let absD = Math.abs(d);
    let dHour = Math.floor(absD / 60);
    let dMin = absD % 60;

    if (工数th) {
        工数th.innerHTML = `工数<br/><span style="font-size:0.85em; font-weight:normal; color:#d00;">あと ${flag}${dHour}:${dMin < 10 ? "0" + dMin : dMin}</span>`;
    }
}

(function() {
    'use strict';

    const subtitleEl = document.getElementsByClassName("subtitle")[0];
    if (!subtitleEl || subtitleEl.innerText !== "就業実績入力（日別入力）") return;

    // 総労働時間の取得
    let thElems = Array.from(document.getElementsByTagName("th"));
    let 総労働時間テキスト = "0:00";

    thElems.forEach(th => {
        if (th.innerText === "総労働時間") {
            総労働時間テキスト = th.nextElementSibling.textContent;
        }
        if (th.innerText.startsWith("工数")) {
            工数th = th;
            const actionTh = document.createElement("th");
            actionTh.innerText = "一括操作";
            actionTh.style.width = "160px"; // 4ボタン用に幅を広げました
            th.after(actionTh);
        }
    });

    const timeMatch = 総労働時間テキスト.match(/\d+/g);
    totalMinutes = timeMatch ? (parseInt(timeMatch[0]) * 60 + parseInt(timeMatch[1] || 0)) : 0;

    const kousuInputs = document.getElementsByName("kousu");

    kousuInputs.forEach(input => {
        const inputTd = input.closest("td");
        const actionTd = document.createElement("td");
        actionTd.style.whiteSpace = "nowrap";
        actionTd.style.textAlign = "center";
        actionTd.style.padding = "2px 5px";
        inputTd.after(actionTd);

        if (input.readOnly) return;

        // コンテナ（4ボタン用に調整）
        const container = document.createElement("div");
        container.style.display = "flex";
        container.style.width = "160px";
        container.style.gap = "3px";

        const btnBaseStyle = "flex: 1; padding: 4px 0; font-size: 10px; cursor: pointer; text-align: center; border: 1px solid #999; border-radius: 3px; background: #f0f0f0; white-space: nowrap;";

        // All-in ボタン
        const btnAllIn = document.createElement("button");
        btnAllIn.type = "button";
        btnAllIn.innerText = "All";
        btnAllIn.style.cssText = btnBaseStyle;
        btnAllIn.onclick = () => {
            let otherTotal = 0;
            kousuInputs.forEach(other => {
                if (other !== input) otherTotal += parseTimeToMinutes(other.value);
            });
            input.value = formatMinutesToTime(totalMinutes - otherTotal);
            input.dispatchEvent(new Event('change'));
        };

        // +0.5 ボタン
        const btnPlus = document.createElement("button");
        btnPlus.type = "button";
        btnPlus.innerText = "+0.5";
        btnPlus.style.cssText = btnBaseStyle;
        btnPlus.onclick = () => {
            input.value = formatMinutesToTime(parseTimeToMinutes(input.value) + 30);
            input.dispatchEvent(new Event('change'));
        };

        // -0.5 ボタン
        const btnMinus = document.createElement("button");
        btnMinus.type = "button";
        btnMinus.innerText = "-0.5";
        btnMinus.style.cssText = btnBaseStyle;
        btnMinus.onclick = () => {
            let nextVal = parseTimeToMinutes(input.value) - 30;
            input.value = nextVal <= 0 ? "" : formatMinutesToTime(nextVal);
            input.dispatchEvent(new Event('change'));
        };

        // Clear ボタン
        const btnClear = document.createElement("button");
        btnClear.type = "button";
        btnClear.innerText = "Clear";
        btnClear.style.cssText = btnBaseStyle;
        btnClear.style.backgroundColor = "#ffebeb"; // 少し色を変えて分かりやすく
        btnClear.onclick = () => {
            input.value = "";
            input.dispatchEvent(new Event('change'));
        };

        container.appendChild(btnAllIn);
        container.appendChild(btnPlus);
        container.appendChild(btnMinus);
        container.appendChild(btnClear);
        actionTd.appendChild(container);

        input.addEventListener("change", updateDiffDisplay);
    });

    updateDiffDisplay();
})();