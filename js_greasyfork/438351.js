// ==UserScript==
// @name         Auto-Commenter
// @namespace    http://tampermonkey.net/
// @version      0.4.4
// @description  automation for facebook comments
// @author       Aviv
// @license      MIT
// @match        m.facebook.com/comment/replies/?ctoken=1608121936208713_253310816793246*
// @match        m.facebook.com/a/comment.php?parent_comment_id=253310816793246&parent_redirect_comment_token=1608121936208713_253310816793246*
// @icon         https://www.google.com/s2/favicons?domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438351/Auto-Commenter.user.js
// @updateURL https://update.greasyfork.org/scripts/438351/Auto-Commenter.meta.js
// ==/UserScript==

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
(() => {
    var _a;
    try {
        const HOURS_BARRIER = {
            Start: 3,
            End: 6
        };
        const BREAK_AFTER = 249;
        let Selectors;
        (function (Selectors) {
            Selectors["CommentBtn"] = "._54k8._52jg._56bs._26vk._3lmf._3fyi";
            Selectors["CommentInput"] = "#composerInput";
            Selectors["CommentLoading"] = "._52jb._55wo._55x2._70na.async_composer_preprocess.async_composer_saving";
            Selectors["WarningBtn"] = ".acw.apm > form > button";
            Selectors["TroubleBtn"] = ".acw.apm > a";
        })(Selectors || (Selectors = {}));
        let messagesCounter = (_a = localStorage.messagesCounter) !== null && _a !== void 0 ? _a : 0;
        let keepPlay = true;
        let elBtn = findElement(Selectors.CommentBtn);
        let elInput = findElement(Selectors.CommentInput);
        function _setQuitKey() {
            document.addEventListener('keydown', (ev) => {
                const { key } = ev;
                if (/q/i.test(key)) {
                    keepPlay = !keepPlay;
                }
                if (keepPlay) {
                    console.log('PLAYING!');
                }
                else {
                    console.log('STOPPED!');
                }
            });
        }
        _setQuitKey();
        const runtime = () => __awaiter(void 0, void 0, void 0, function* () {
            yield handleWarnings();
            if (!keepPlay) {
                console.log('press the Q to continue');
                yield _waiter(12000);
                runtime();
                return;
            }
            yield handleNight();
            elBtn !== null && elBtn !== void 0 ? elBtn : (elBtn = findElement(Selectors.CommentBtn));
            elInput !== null && elInput !== void 0 ? elInput : (elInput = findElement(Selectors.CommentInput));
            if (elBtn && elInput) {
                elInput.scrollIntoView();
                // wait for comment to be sent
                const commentSendLoading = document.querySelector(Selectors.CommentLoading);
                if (commentSendLoading) {
                    yield _waiter(1000);
                    runtime();
                    return;
                }
                yield setComment(elBtn, elInput, generateMessage());
                yield _waiter(getRandomWait());
                // reload every 50 comments
                if (messagesCounter && messagesCounter % 50 === 0) {
                    location.reload();
                }
                if (messagesCounter > BREAK_AFTER) {
                    // take time off over 150 comments, for 12-36 minutes
                    messagesCounter = 0;
                    localStorage.messagesCounter = 0;
                    yield _waiter(getRandomWaitBreak());
                }
                runtime();
            }
            else {
                yield _waiter(120);
                runtime();
            }
        });
        runtime();
        function setComment(elBtn, elInput, text) {
            return __awaiter(this, void 0, void 0, function* () {
                elBtn.disabled = false;
                yield _waiter(1000);
                elInput.innerText = text;
                yield _waiter(1000);
                elBtn.click();
                yield _waiter(1000);
                elBtn.click();
                yield _waiter(1000);
                elInput.innerText = '';
                messagesCounter++;
                localStorage.messagesCounter = messagesCounter;
                console.log(`comment at ${new Date()}`);
                console.log({ text });
            });
        }
        function _waiter(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    return resolve(null);
                }, ms || 0);
            });
        }
        function findElement(selector) {
            return document.querySelector(selector);
        }
        /**
         * @returns random number of seconds in ms
         */
        function getRandomWait() {
            return (Math.random() * 8 + 8) * 1000;
        }
        /**
         * @returns random number of seconds in ms
         */
        function getRandomWaitBreak() {
            const time = (Math.random() * (60 * 24) + (12 * 60)) * 1000;
            console.log('Taking a break...');
            console.log({ breakTime: (time / 1000 / 60) });
            console.log({ messagesCounter });
            return time;
        }
        const emojisDB = [
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩',
            '🥩🥩🥩',
            '🥩🥩🥩',
            '🥩🥩🥩',
            '🥩🥩🥩',
            '🥩🥩🥩🥩',
            '🥩🥩🥩🥩',
            '🥩🥩🥩🥩',
            '🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩',
            '🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩',
            '🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩🥩',
        ];
        const messagesDB = [
            '1',
            '2',
            '3',
            'ר',
            'ק',
        ];
        function generateMessage() {
            return `${pickRandomFromArray(emojisDB)}${(messagesCounter && messagesCounter % 45 === 0) ? pickRandomFromArray(messagesDB) : ''}`;
        }
        function pickRandomFromArray(db) {
            return db[Math.floor(Math.random() * db.length)];
        }
        function handleNight() {
            return __awaiter(this, void 0, void 0, function* () {
                const now = new Date();
                if (now.getHours() >= HOURS_BARRIER.Start && now.getHours() < HOURS_BARRIER.End) {
                    const leftToStart = (HOURS_BARRIER.End - now.getHours()) * 1000 * 60 * 60;
                    console.log('in night mode, back in:');
                    console.log({ leftToStart });
                    yield _waiter(leftToStart);
                }
            });
        }
        function handleWarnings() {
            return __awaiter(this, void 0, void 0, function* () {
                const troubleBtn = document.querySelector(Selectors.TroubleBtn);
                // const warningUrl = 'm.facebook.com/a/comment.php?parent_comment_id=253310816793246&parent_redirect_comment_token=1608121936208713_253310816793246'
                // const url = location.href.includes(warningUrl)
                const warningBtn = document.querySelector(Selectors.WarningBtn);
                if (troubleBtn) {
                    yield _waiter(1000 * 60 * 3);
                    troubleBtn.click();
                }
                if (warningBtn) {
                    yield _waiter(1000 * 1.5);
                    warningBtn.click();
                    yield isStillWarning();
                }
                function isStillWarning() {
                    return __awaiter(this, void 0, void 0, function* () {
                        yield _waiter(1000 * 3);
                        const btn = document.querySelector(Selectors.WarningBtn);
                        if (btn) {
                            btn.click();
                            yield isStillWarning();
                        }
                    });
                }
            });
        }
    }
    catch (error) {
        location.reload();
    }
})();
