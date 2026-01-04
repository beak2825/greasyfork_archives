// ==UserScript==
// @name         Auto Attack - mykirito
// @namespace    https://t510599.github.io/
// @version      1.4
// @description  auto attack for mykirito
// @author       Tony Yang
// @match        https://mykirito.com/user-list
// @match        https://mykirito.com/profile/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/405081/Auto%20Attack%20-%20mykirito.user.js
// @updateURL https://update.greasyfork.org/scripts/405081/Auto%20Attack%20-%20mykirito.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var localAttackCount = 0;
    var loaderTimer;

    const $ = (selector) => {
        return document.querySelector(selector);
    }

    const $$ = (selector) => {
        return document.querySelectorAll(selector);
    }

    async function sleep(ms) {
        return new Promise(res => {
            setTimeout(res, ms);
        });
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // https://stackoverflow.com/a/38873788
    function isVisible(el) {
        return !!( el.offsetWidth || el.offsetHeight || el.getClientRects().length );
    }

    // check first
    if ($("#signin") && $("#signin").style.display == "none") {
        loader();
    } else {
        window.addEventListener("load", function() {
            console.log("onload event triggered");
            clearTimeout(loaderTimer);
            loader();
        });

        // prevent the situation that onload event is not triggered
        loaderTimer = setTimeout(function() {
            loader();
        }, 5e3);
    }

    function loader() {
        const loginObserver = new MutationObserver(function(mutations, observer) {
            mutations.forEach(async function(mutation) {
                let el = mutation.target;
                // check if logged in
                if (el.style.display == "none") {
                    let randomInt = getRandomInt(100, 500);
                    await sleep(randomInt);
                    observer.disconnect();
                    attachNavListener();
                    linkStart();
                }
            });
        });

        if ($("#signin").style.display == "none") {
            // login successfully
            loginObserver.disconnect();
            attachNavListener();
            linkStart();
        } else {
            loginObserver.observe($("#signin"), { attributes: true, attributeFilter: ["style"] });
        }
    }

    function attachNavListener() {
        // add nav listener
        $("#root > nav").addEventListener("click", e => {
            let el = e.target;
            if (el.tagName == "A" && el.textContent == "玩家列表" && !el.classList.contains("active")) { // ignore the event that has been already active
                // re-observe newly created elements again
                const myObserver = new MutationObserver((mutations, observer) => {
                    mutations.forEach(mutation => {
                        if (mutation.addedNodes.length) {
                            linkStart();
                            observer.disconnect();
                        }
                    });
                });
                myObserver.observe($("#root > nav + div"), { childList: true });
            }
        });
    }

    async function linkStart() {
        if (location.href == "https://mykirito.com/user-list") {
            console.log("link start!!");
            $("tbody").addEventListener("click", async function(e) {
                let el = e.target;
                // if element is element under user list table
                if (el.matches("table tbody tr:not(.eSbheu) td *")) {
                    await sleep(1e3);
                    linkStart();
                }
            });
        } else if (location.href.includes("profile")) {
            console.log("It's show time.");
            const errorObserver = new MutationObserver(function(mutations) {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        let incarnation = Array.from(mutation.addedNodes).filter(el => el.textContent.includes("已經轉生或升級了，請重新載入"));
                        if (incarnation.length) {
                            console.log("incarnation");
                            notify("目標已經轉生或升級了，請重新載入");
                            $('input[type="checkbox"]').click();
                        }
                        let dead = Array.from(mutation.addedNodes).filter(el => el.textContent.includes("對方已經死亡了"));
                        if (dead.length) {
                            console.log("death");
                            notify("目標已經死亡了");
                            $('input[type="checkbox"]').click();
                        }
                    }
                });
            });
            let reportHeader = await waitHeader("戰鬥報告");
            errorObserver.observe(reportHeader.parentElement, { childList: true });

            const attackObserver = new MutationObserver(function(mutations) {
                mutations.forEach(async function(mutation) {
                    let el = mutation.target;
                    // enabled class
                    if (el.classList.contains("llLWDd") || el.classList.contains("bPQSXu") || !el.disabled) {
                        let randomInt = getRandomInt(100, 1500);
                        await sleep(randomInt + 1000);
                        el.click();
                        if (++localAttackCount >= 1) {
                            await sleep(10e3);
                            location.reload();
                        }
                    }
                });
            });
            const actionConfig = { attributes: true, attributeFilter: ["disabled"] };

            // only attack buttons
            let attackHeader = await waitHeader("挑戰");
            let actions = Array.from(attackHeader.parentElement.querySelectorAll(':scope > h3 + div > div.cqDPIl > button.sc-AxgMl')).filter(el => isVisible(el));
            // set action here
            let attack = GM_getValue("autoAttack", 0); // default 友好切磋

            // only create menu if there is no menu
            if (!$("select")) {
                // action settings
                let select = document.createElement("select");
                actions.forEach((e, i) => {
                    let opt = new Option(e.textContent, i, (attack == i), (attack == i));
                    select.appendChild(opt);
                });

                actions[actions.length - 1].parentElement.parentElement.insertAdjacentElement("beforeend", select).insertAdjacentHTML("beforebegin", "<p>選擇自動攻擊指令</p>")
                select.addEventListener("change", function(e) {
                    let el = e.target;
                    GM_setValue("autoAttack", el.value);
                    attack = el.value;
                    attackObserver.disconnect();
                    attackObserver.observe(actions[attack], actionConfig);
                });

                let attackSwitch = createSwitch("attackOnoff", "autoAttackEnabled", () => {
                    attackObserver.observe(actions[attack], actionConfig);
                }, () => {
                    attackObserver.disconnect();
                });

                select.insertAdjacentElement("afterend", attackSwitch).insertAdjacentHTML("beforebegin", "<span>&nbsp;</span>");
                attackSwitch.insertAdjacentHTML("afterend", '<label for="attackOnoff">開啟</label>');
            }

            if (GM_getValue("autoAttackEnabled", "true") == "true") {
                attackObserver.observe(actions[attack], actionConfig);
            }

            // add captcha observer for notification
            const captchaObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.addedNodes.length) {
                        let result = Array.from(mutation.addedNodes).filter(el => el.tagName == "DIV" && el.id.includes("hcaptcha"));
                        if (result.length) {
                            notify("請點選驗證碼");
                        }
                    }
                });
            });
            captchaObserver.observe(actions[0].parentElement.parentElement, { childList: true });
        }

        async function waitHeader(title) {
            let count = 0;
            while (!Array.from($$("h3")).filter(el => el.textContent == title)[0]) {
                if (count > 5) {
                    break;
                }
                await sleep(100);
                count++;
            }
            return Array.from($$("h3")).filter(el => el.textContent == title)[0];
        }

        function createSwitch(id, storageKey, onchecked, onunchecked) {
            let onoff = document.createElement("input");
            onoff.type = "checkbox"; onoff.id = id; onoff.name = id;
            onoff.checked = GM_getValue(storageKey, "true") == "true" ? true : false;

            onoff.addEventListener("change", function(e) {
                let el = e.target;
                if (el.checked) {
                    GM_setValue(storageKey, "true");
                    onchecked();
                } else {
                    GM_setValue(storageKey, "false");
                    onunchecked();
                }
            });
            return onoff;
        }

        function notify(message) {
            GM_notification({
                title: "Auto Attack - mykirito",
                text: message,
                timeout: 0
            });
        }
    }
})();