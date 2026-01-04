// ==UserScript==
// @name         AtCoder Judge Status to Title Bar
// @namespace    https://github.com/mihatsu-s/
// @version      1.0.0
// @description  Display AtCoder's judge status to a title bar
// @author       Mihatsu
// @match        https://atcoder.jp/contests/*/submissions/*
// @exclude      https://atcoder.jp/*/json
// @downloadURL https://update.greasyfork.org/scripts/424801/AtCoder%20Judge%20Status%20to%20Title%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/424801/AtCoder%20Judge%20Status%20to%20Title%20Bar.meta.js
// ==/UserScript==

(() => {
    const judgeStatusElement = document.getElementById("judge-status");
    if (!judgeStatusElement) return;

    const state = {
        rawTitle: document.title,

        _hasFocus: true,
        get hasFocus() {
            return this._hasFocus;
        },
        set hasFocus(val) {
            this._hasFocus = val;
            this._onUpdate();
        },

        _judgeStatus: "",
        _previousJudgeStatus: "",
        get judgeStatus() {
            return this._judgeStatus;
        },
        set judgeStatus(val) {
            this._previousJudgeStatus = this._judgeStatus;
            this._judgeStatus = val;
            this._onUpdate();
        },

        _onUpdate() {
            document.title = this.hasFocus ? this.rawTitle : this.judgeStatus;
        },
    };

    state.hasFocus = document.hasFocus();
    window.addEventListener("focus", () => {
        state.hasFocus = true;
    });
    window.addEventListener("blur", () => {
        state.hasFocus = false;
    });

    function readJudgeStatus() {
        return judgeStatusElement.textContent;
    }
    state.judgeStatus = readJudgeStatus();
    new MutationObserver(() => {
        state.judgeStatus = readJudgeStatus();
    }).observe(judgeStatusElement, {
        subtree: true,
        characterData: true,
    });
})();
