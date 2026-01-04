// ==UserScript==
// @name         AtCoder Registration Autofill
// @namespace    https://github.com/Raclamusi
// @version      1.0.0
// @description  AtCoderの参加登録情報を保存し、自動入力します。
// @author       Raclamusi
// @supportURL   https://github.com/Raclamusi/atcoder-registration-autofill
// @match        https://atcoder.jp/contests/*/register
// @grant        none
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/467393/AtCoder%20Registration%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/467393/AtCoder%20Registration%20Autofill.meta.js
// ==/UserScript==

(function() {
    "use strict";

    const storageKey = "atcoder_registration_autofill__data";
    const getAutofillData = () => {
        return JSON.parse(localStorage.getItem(storageKey));
    };
    const setAutofillData = (name, type, value) => {
        const data = getAutofillData() ?? {};
        if (!(name in data)) {
            data[name] = {};
        }
        if (type === "radio") {
            if (!(type in data[name])) {
                data[name][type] = [];
            }
            data[name][type].unshift(value);
        }
        else {
            data[name][type] = value;
        }
        localStorage.setItem(storageKey, JSON.stringify(data));
    };

    const form = document.querySelector(".form-horizontal");
    if (getAutofillData() === null) {
        setAutofillData("日本国内在住か？", "radio", "Yes");
    }
    for (const [name, values] of Object.entries(getAutofillData())) {
        const input = form[name];
        if (input) {
            const type = (input instanceof RadioNodeList) ? "radio" : input.type;
            if (type in values) {
                const value = values[type];
                if (type === "radio") {
                    const radioButtons = [...input].map(e => e.value);
                    for (const v of value) {
                        if (radioButtons.includes(v)) {
                            input.value = v;
                            break;
                        }
                    }
                }
                else if (type === "checkbox") {
                    input.checked = value;
                }
                else {
                    input.value = value;
                }
            }
        }
    }

    for (const input of form) {
        if (input.type === "checkbox") {
            input.addEventListener("change", e => {
                setAutofillData(e.target.name, e.target.type, e.target.checked);
            });
        }
        else {
            input.addEventListener("change", e => {
                setAutofillData(e.target.name, e.target.type, e.target.value);
            });
        }
    }
})();
