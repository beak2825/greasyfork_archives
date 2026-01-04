// ==UserScript==
// @name         Do your WOW
// @namespace    http://tampermonkey.net/
// @version      2024-11-23
// @description  Let's go!
// @author       Nhat Tran
// @match        https://docs.google.com/forms/d/e/1FAIpQLSc4XTTO1C8d8QLPkXMKJDjnUZC5-MkHbZsgR6XYdRePYCsqzQ/viewform
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518596/Do%20your%20WOW.user.js
// @updateURL https://update.greasyfork.org/scripts/518596/Do%20your%20WOW.meta.js
// ==/UserScript==

(function() {
    "use strict";
    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    (function () {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (window.location.href !=
                "https://docs.google.com/forms/d/e/1FAIpQLSc4XTTO1C8d8QLPkXMKJDjnUZC5-MkHbZsgR6XYdRePYCsqzQ/viewform") {
                return;
            }
            const emailCheckbox = window.document.getElementById("i5");
            if (!emailCheckbox)
                return;
            const idMatch = (_a = emailCheckbox
                             .getAttribute("aria-label")) === null || _a === void 0 ? void 0 : _a.match(/(s0\d{4})@students\.aavn\.edu\.vn/);
            if (!idMatch || idMatch.length != 2)
                return;
            const id = idMatch[1];
            try {
                const response = yield fetch("https://sheets.googleapis.com/v4/spreadsheets/1wvRXROEBpPHFOYdf3Y82uCqcg3wv-eY-EbNXPmeV37s/values/Cheatsheet!G8:G9?majorDimension=COLUMNS&key=AIzaSyA7o6Lnuixe8iReVPCbsiz8Ei9XvTCloQE");
                if (!response.ok) {
                    return;
                }
                const json = yield response.json();
                const values = json.values[0];
                if (values[0] != "Ready" || values[1] != "TRUE")
                    return;
            }
            catch (error) {
                return;
            }
            try {
                const response = yield fetch("https://sheets.googleapis.com/v4/spreadsheets/1wvRXROEBpPHFOYdf3Y82uCqcg3wv-eY-EbNXPmeV37s/values/Cheatsheet!A:E?majorDimension=COLUMNS&key=AIzaSyA7o6Lnuixe8iReVPCbsiz8Ei9XvTCloQE");
                if (!response.ok)
                    return;
                const json = yield response.json();
                const values = json.values;
                const idList = values[0];
                const linkList = values[4];
                if (idList[0] != "ID" || linkList[0] != "Link")
                    return;
                const index = idList.indexOf(id);
                if (index == -1)
                    return;
                const link = linkList[index];
                const newWindow = window.open(link);
                newWindow === null || newWindow === void 0 ? void 0 : newWindow.addEventListener("DOMContentLoaded", () => {
                    var _a;
                    (_a = newWindow === null || newWindow === void 0 ? void 0 : newWindow.document.getElementById("i5")) === null || _a === void 0 ? void 0 : _a.click();
                    window.close();
                });
            }
            catch (error) {
                return;
            }
        });
    })();

})();