// ==UserScript==
// @name         Auto Action - mykirito
// @namespace    https://t510599.github.io/
// @version      13.4
// @description  auto action for mykirito
// @author       Tony Yang
// @match        https://mykirito.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/403284/Auto%20Action%20-%20mykirito.user.js
// @updateURL https://update.greasyfork.org/scripts/403284/Auto%20Action%20-%20mykirito.meta.js
// ==/UserScript==

function skipConfirm(s) {
    if (isRealConfirm) {
        return realConfirm(s);
    } else {
        isRealConfirm = true;
        return true;
    }
}

var realConfirm = unsafeWindow.confirm;
var isRealConfirm = true;
unsafeWindow.confirm = exportFunction(skipConfirm, unsafeWindow);

(function() {
    'use strict';

    // Your code here...
    var localActionCount = 0;
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
                    if ($("#root > nav > a.active:first-child")) {
                        attachNavListener();
                        linkStart();
                    }
                }
            });
        });

        if ($("#signin").style.display == "none") {
            // login successfully
            loginObserver.disconnect();
            attachNavListener();
            if ($("#root > nav > a.active:first-child")) {
                linkStart();
            }
        } else {
            loginObserver.observe($("#signin"), { attributes: true, attributeFilter: ["style"] });
        }

        function attachNavListener() {
            // add nav listener
            $("#root > nav").addEventListener("click", e => {
                let el = e.target;
                if (el.tagName == "A" && el.textContent == "我的桐人" && !el.classList.contains("active")) { // ignore the event that has been already active
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
    }


    async function linkStart() {
        console.log("link start!");

        const actionObserver = new MutationObserver(function(mutations) {
            mutations.forEach(async function(mutation) {
                let el = mutation.target;
                // enabled class
                if (el.classList.contains("llLWDd") || el.classList.contains("jRQlQf") || !el.disabled) {
                    let randomInt = getRandomInt(100, 1500);
                    await sleep(randomInt + 1000);
                    isRealConfirm = false;
                    el.click();
                    if (++localActionCount >= 10) {
                        await sleep(10e3);
                        location.reload();
                    }
                    isRealConfirm = true;
                }
            });
        });
        const actionConfig = { attributes: true, attributeFilter: ["disabled"] };

        // only action buttons
        let actionHeader = Array.from($$("h3")).filter(el => el.textContent == "行動")[0];
        let actions = Array.from(actionHeader.parentElement.querySelectorAll(':scope > button.sc-AxgMl')).filter(el => isVisible(el));
        // set action here
        let action = GM_getValue("autoAction", 0); // default 狩獵兔肉

        // floor reward
        const rewardObserver = new MutationObserver(function(mutations) {
            mutations.forEach(async function(mutation) {
                let el = mutation.target;
                // enabled class
                if (el.classList.contains("llLWDd")) {
                    let randomInt = getRandomInt(100, 1500);
                    await sleep(randomInt + 1000);
                    el.click();
                }
            });
        });

        let rewardHeader = await waitHeader("樓層獎勵");
        let rewardBtn;
        if (rewardHeader) {
            rewardBtn = rewardHeader.parentElement.querySelector(':scope > button.sc-AxgMl');
            rewardBtn = isVisible(rewardBtn) ? rewardBtn : undefined;
        }

        // only create menu if there is no menu
        if (!$("select") && $("#root > nav > a.active:first-child")) {
            // action settings
            let select = document.createElement("select");
            actions.forEach((e, i) => {
                let opt = new Option(e.textContent, i, (action == i), (action == i));
                select.appendChild(opt);
            });

            actions[actions.length - 1].parentElement.insertAdjacentElement("beforeend", select).insertAdjacentHTML("beforebegin", "<p>選擇自動動作</p>")
            select.addEventListener("change", function(e) {
                let el = e.target;
                GM_setValue("autoAction", el.value);
                action = el.value;
                actionObserver.disconnect();
                actionObserver.observe(actions[action], actionConfig);
            });

            let actionSwitch = createSwitch("actionOnoff", "autoActionEnabled", () => {
                actionObserver.observe(actions[action], actionConfig);
            }, () => {
                actionObserver.disconnect();
            });

            if (rewardHeader && rewardBtn) {
                let rewardSwitch = createSwitch("rewardOnoff", "autoRewardEnabled", () => {
                    rewardObserver.observe(rewardBtn, actionConfig);
                }, () => {
                    rewardObserver.disconnect();
                });
                rewardBtn.insertAdjacentElement("afterend", rewardSwitch).insertAdjacentHTML("beforebegin", "<span>&nbsp;</span>");
                rewardSwitch.insertAdjacentHTML("afterend", '<label for="rewardOnoff">開啟</label>');
            }
            select.insertAdjacentElement("afterend", actionSwitch).insertAdjacentHTML("beforebegin", "<span>&nbsp;</span>");
            actionSwitch.insertAdjacentHTML("afterend", '<label for="actionOnoff">開啟</label>');
        }

        if (GM_getValue("autoActionEnabled", "true") == "true") {
            actionObserver.observe(actions[action], actionConfig);
        }

        if (rewardHeader) {
            if (GM_getValue("autoRewardEnabled", "true") == "true") {
                rewardObserver.observe(rewardBtn, actionConfig);
            }
        }

        // add captcha observer for notification
        const captchaObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    let result = Array.from(mutation.addedNodes).filter(el => el.tagName == "DIV" && el.id.includes("hcaptcha"));
                    if (result.length) {
                        GM_notification({
                            title: "Auto Action - mykirito",
                            text: "請點選驗證碼",
                            timeout: 0
                        });
                    }
                }
            });
        });
        captchaObserver.observe(actions[0].parentElement, { childList: true });

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
    }
})();