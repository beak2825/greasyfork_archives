// ==UserScript==
// @name        Robinhood QOL Trading
// @namespace   Trading
// @match       https://robinhood.com/legend/layout/*
// @grant       none
// @version     1.4
// @license     MIT
// @author      AdSam
// @description A Robinhood quality of life script
// @downloadURL https://update.greasyfork.org/scripts/523233/Robinhood%20QOL%20Trading.user.js
// @updateURL https://update.greasyfork.org/scripts/523233/Robinhood%20QOL%20Trading.meta.js
// ==/UserScript==

const MOD_KEY = "ctrl";

const Hotkeys = {
    BUY: "b",
    SELL: "s",
    TRAILING_STOP: "l",
    SET_SHARES: "z",
    SET_AMOUNT: "x",
};

const Actions = {
    [Hotkeys.BUY]: async () => await buy(shares),
    [Hotkeys.SELL]: async () => await sell(shares),
    [Hotkeys.TRAILING_STOP]: async () => await trailing_stop(shares, amount),
    [Hotkeys.SET_SHARES]: () => {
        shares = input("Enter number of shares:", shares);
    },
    [Hotkeys.SET_AMOUNT]: () => {
        amount = input("Enter trailing amount:");
    },
};

const TIMEOUT = 5;

function findElement(selector, index, timeout = 0) {
    let iter = 0;

    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (timeout != 0 && iter >= timeout * 1000) {
                reject(new Error("Timeout"));
            }

            const elements = document.querySelectorAll(selector);

            if (elements[index]) {
                clearInterval(interval);
                resolve(elements[index]);
            }

            iter++;
        }, 1);
    });
}

function input(message, _default) {
    userInput = prompt(message);

    if (userInput != null) {
        userInput = userInput
            .split("")
            .filter((char) => !isNaN(char) || char === ".")
            .join("");

        return parseFloat(userInput || _default);
    } else {
        return parseFloat(_default);
    }
}

async function buy(shares) {
    let menuBtn = await findElement(
        '[data-testid="legend_buy_button"]',
        0,
        TIMEOUT
    );
    menuBtn.click();

    let dropdown = await findElement('[role="combobox"]', 0, TIMEOUT);
    dropdown.click();

    let market = await findElement('[role="option"]', 1, TIMEOUT);
    market.click();

    let quantity = await findElement('[name="quantity"]', 0, TIMEOUT);
    quantity.focus();

    document.execCommand("selectAll");
    document.execCommand("insertText", false, shares.toString());

    while (quantity.value != shares.toString()) {}

    let buyBtn = await findElement('[type="submit"]', 0, TIMEOUT);
    buyBtn.click();
}

async function sell(shares) {
    let menuBtn = await findElement(
        '[data-testid="legend_sell_button"]',
        0,
        TIMEOUT
    );
    menuBtn.click();

    let dropdown = await findElement('[role="combobox"]', 0, TIMEOUT);
    dropdown.click();

    let market = await findElement('[role="option"]', 1, TIMEOUT);
    market.click();

    let quantity = await findElement('[name="quantity"]', 0, TIMEOUT);
    quantity.focus();

    document.execCommand("selectAll");
    document.execCommand("insertText", false, shares.toString());

    while (quantity.value != shares.toString()) {}

    let sellBtn = await findElement('[type="submit"]', 0, TIMEOUT);
    sellBtn.click();
}

async function trailing_stop(shares, amount) {
    let menuBtn = await findElement(
        '[data-testid="legend_sell_button"]',
        0,
        TIMEOUT
    );
    menuBtn.click();

    let dropdown = await findElement('[role="combobox"]', 0, TIMEOUT);
    dropdown.click();

    let ts = await findElement('[role="option"]', 4, TIMEOUT);
    ts.click();

    let quantity = await findElement('[name="quantity"]', 0, TIMEOUT);
    quantity.focus();

    document.execCommand("selectAll");
    document.execCommand("insertText", false, shares.toString());

    let trail = await findElement('[role="combobox"]', 1, TIMEOUT);
    trail.click();

    let a = await findElement('[role="option"]', 8, TIMEOUT);
    a.click();

    let ta = await findElement('[name="trailAmount"]', 1, TIMEOUT);
    ta.focus();

    document.execCommand("selectAll");
    document.execCommand("insertText", false, amount.toString());

    let tif = await findElement('[role="combobox"]', 2, TIMEOUT);
    tif.click();

    let gtc = await findElement('[role="option"]', 6, TIMEOUT);
    gtc.click();

    while (
        quantity.value != shares.toString() ||
        !ta.value.includes(amount.toString())
    ) {}

    await new Promise((r) => setTimeout(r, 100));

    let sellBtn = await findElement('[type="submit"]', 0, TIMEOUT);
    sellBtn.click();
}

let shares = 0;
let amount = 0;

let debounce = false;

document.addEventListener("keydown", async (event) => {
    if (!debounce) {
        debounce = true;

        try {
            if (
                event[MOD_KEY.toLowerCase() + "Key"] &&
                Actions[event.key.toLowerCase()]
            ) {
                event.preventDefault();
                await Actions[event.key]();
            }
        } catch (e) {
            console.warn(e);
        }

        debounce = false;
    }
});
