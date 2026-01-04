// ==UserScript==
// @name Monkeytyper
// @author Carson at Fyre
// @description Type really fast on Monkeytype! Useful for scuffing leaderboard entries.
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKYAAACUCAMAAAAu5KLjAAAAb1BMVEUyNDfitxTkuRPnuxIvMjfrvhAmLDiFcCwbJjgPIDnOqRm2liE/PTbYsBYeKDkYJDmjhySTfCdTSzObgSYqLzjBnh5YTzLUrBerjiFDPzVGQjSKdCpnWjBNRzReUzE1NjbHoxxtXi9zYy57aSwAFTu9mtO8AAAGB0lEQVR4nO2aaXeqOhSGIVOZEoIEQQZBPf//N14wA0i1p8Vwez7kWau2sZC8ZNh7ZwfPczgcDofD4XA4HA6Hw+FwOBwOh8PhcPw/IMLS0CopI8iuRiH67tLw2Cq8uXQ9EfZEpuesABhjaJWxQn/IzqkdoSg9VRRCfxcgpPEptTD2os/30qiV8v7tDiVdjPcUOYGLjryp8hDt2pUSWB7f0klqf6kSWGWp03+nP0VSGJXjSvfLyCIlhdhIhcNp+/wUFTT9ODQ1skzdFKZPYbV5uZMrNA97ZYFllzGauiC4DqaJG9tYTaiXD45Pby7FV5CTNiQwSjdWcdM1VDYM8HNQyFUr+GNbdwq1fmDh7aZy1OmZZtCWZsSZysek7U4jvm7nvGWxkwbqIX+slgVBwEyNgozFYB2SIRawxUVTdQGbmD8D/fApVw01W7oD6bvPi7sRI8cPzvOmJWxSRtLulnOetd7D9BWi4eO3BzPbBLnxNVdVrzjq/tgy6L2cM4Cy+W7h3SIAIBx9SNQkRJBLMZrUqUj5ae5R0Q1w+ta/KCXoVIw3TdEbmH4BGcnF6ilSCqTV63+uEyWRvLkIzXdBOxjHAXDZdhU29h/TRuhWUCVXLyg7Oe6CP4sMsBrlMJYdUiZbZMpnxPPUZC1dtgZp+ejwqxCpW331MOBG1CM/kwkKeX0qbRKg78jkWqa4+GDVzqp3uOw7VGsfCD6UzHJ1qZIpR9mqzBdd8tCu7Dyv1y6QtlJ4Hz+7FXJivzfTTMfHYN2pJn4YZEPiel9WAHO9mFsffgrkME2EdZkImU6gUQlnpVNRDz+Wg+yxczGGakNjVt+4CVgHckOlVFqVacIlwI/JIaNGZdwm3ZVqh6eEEZEkibcwuIIkK3pjwKzKVDYF5EQgEdyUaFgwglBwpKo/jV+eAsrHCteY/9iUKYp7EUT1faj+SKvq4+O9SHLVnd0Gv2xRJuqVzELqCCvlo073qsmHUn34t2SmL2QencxdZAr2NXOS6xdlir7Nv6Y5zgHnb8lEp3hK4c1A9SM/7p800/7t12Sm38g8AXyz7tN/JhPV38k87RDIjRvAlUxZdallSl3KboruO2m8PQI55SxxHsii3MTDor8X1fYQUOkDEdHO8yvwDoGcOFE8Bl+l2q+Mk2AsQnpRK5vwqQgbtb0hNx/+RSjAUbJD9E6Ose/HB21FRM19fzBbayQyCqLbbDXHzdzXlLxWdVneZKQjs5NBQRqEC5/DQhYuI7c0IBrWy00GrP6Y70hotsx2Zf68CoPaC8E4fBLH/bbMua6Tkfns306mk/muzDk0e0jAvYzYzFVPZArC9gjkRoKuyRRXYUwPYsfsBTdkMl1rmUH90XS6YqsyGZ/PVnGp0hmj0YlfHrliqnKOn2QG+RTNcZ2Rs+nTb8toApYq/ZbmXwQZMJKByVomudxv2iGQ80T84KOxcpPsaRJLozNyK5lMZQoL68kZHcgZmTLXi3q6lvYg8zEjp/PjRAWFg41AblV19RDp4loN+vBlAKwDKJl51immQOqClRp0HWJvkjlImZEcKFEvk2q6BY+08HOuzeTc9FXiSserdMJuGoOp6KsUSSgfFUQbktoeUjlJoG4eA7moVAyZqZFci/IFUW4sJ2mLMuK1NpX3uuIzU6Jlz8P45yIXaaFGxuueQAfN4jjAI/3hBfXjVZ2Yw76pLqSKgdqgwHzTudBVLYPITJlnUdiTVNurq7zHsv6jH9TivG46FzqppBvIdj1lI5lqJqo3nTkyndH028C2tpngrFLNsNp4tJro8wjQ2n7/SoNIqzP3cOv7Cak+QwY0I3sIRYRleqeMq60BI6r1Ecto8q5j7GUZ4V0GvU2G5baZOUEus9vDNM6aD5tkFcWzC9u0zLXOZo5/AMSWWSQc8HvWJM3/lrywAYD5mzsZ0qxPJndQ6b9tmdE4P3d+SQ77FwtmhCBO9xt5ACn3tr6B9ABKzzzC+DuJ1R8yLsqSn629PSREcuGD5Tf5Ru8z8EsiNvqepyCRhoF1wnQX3/ZPV+dwOBwOh8PhcDgcDofD4XA4HA6Hw/FL/AdlgIouQk2B/gAAAABJRU5ErkJggg==
// @version 0.1
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/en/users/1431993-carson-at-fyre
// @downloadURL https://update.greasyfork.org/scripts/526037/Monkeytyper.user.js
// @updateURL https://update.greasyfork.org/scripts/526037/Monkeytyper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Carson at Fyre
    Github: https://github.com/carsonatfyre
    Greasyfork: https://greasyfork.org/en/users/1431993-carson-at-fyre

    READ BEFORE USING:
    - Log out of your account before using this script and reload the page
    - Press [Right arrow] on your keyboard to start.
    - Modify `MIN_DELAY` and `MAX_DELAY` variables to change your typing speed
*/

(function() {
    "use strict";

    const MIN_DELAY = 0;
    const MAX_DELAY = 10;
    const TOGGLE_KEY = "ArrowRight";
  
    const log = console.log;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let toggle = false;
    function canType() {
        const typingTest = document.getElementById("typingTest");
        const isHidden = typingTest.classList.contains("hidden");
        if (isHidden) toggle = false;
        return toggle && !isHidden;
    }

    function getNextCharacter() {
        const currentWord = document.querySelector(".word.active");
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " ";
    }

    const InputEvents = {};
    function pressKey(key) {
        const wordsInput = document.getElementById("wordsInput");
        const KeyboardEvent = Object.assign({}, DEFAULT_INPUT_OPTIONS, { target: wordsInput, data: key });
        const InputEvent = Object.assign({}, DEFAULT_KEY_OPTIONS, { target: wordsInput, key: key });

        wordsInput.value += key;
        InputEvents.beforeinput(InputEvent);
        InputEvents.input(InputEvent);
        InputEvents.keyup(KeyboardEvent);
    }

    function typeCharacter() {
        if (!canType()) {
            log("Finished typing.");
            return;
        }

        pressKey(getNextCharacter());
        setTimeout(typeCharacter, random(MIN_DELAY, MAX_DELAY));
    }

    window.addEventListener("keydown", function(event) {
        if (event.code === TOGGLE_KEY) {
            event.preventDefault();

            if (event.repeat) return;
            toggle = !toggle;
            if (toggle) {
                log("Started typing.");
                typeCharacter();
            }
        }
    })

    function hook(element) {
        element.addEventListener = new Proxy(element.addEventListener, {
            apply(target, _this, args) {
                const [type, listener, ...options] = args;
                if (_this.id === "wordsInput") {
                    InputEvents[type] = listener;
                }
                return target.apply(_this, args);
            }
        })
    }
    hook(HTMLInputElement.prototype);

    const DEFAULT_KEY_OPTIONS = {
        key: "", code: "", keyCode: 0, which: 0, isTrusted: true, altKey: false,
        bubbles: true, cancelBubble: false, cancelable: true, charCode: 0,
        composed: true, ctrlKey: false, currentTarget: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, isComposing: false, location: 0, metaKey: false,
        path: null, repeat: false, returnValue: true, shiftKey: false, srcElement: null,
        target: null, timeStamp: 6338.5, type: "", view: window,
    };

    const DEFAULT_INPUT_OPTIONS = {
        isTrusted: true, bubbles: true, cancelBubble: false, cancelable: false,
        composed: true, data: "", dataTransfer: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, inputType: "insertText", isComposing: false,
        path: null, returnValue: true, sourceCapabilities: null, srcElement: null,
        target: null, currentTarget: null, timeStamp: 11543, type: "input",
        view: null, which: 0
    };

})();