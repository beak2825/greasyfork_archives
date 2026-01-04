// ==UserScript==
// @name          DSS: Faction Money Transfers
// @namespace     Dsuttz Scripts
// @match         https://www.torn.com/factions.php*
// @version       0.34
// @author        Dsuttz [1561637]
// @description   Assists with dealing with faction member money
// @downloadURL https://update.greasyfork.org/scripts/535823/DSS%3A%20Faction%20Money%20Transfers.user.js
// @updateURL https://update.greasyfork.org/scripts/535823/DSS%3A%20Faction%20Money%20Transfers.meta.js
// ==/UserScript==

let isInitialized = false;
let container = null;

function shouldShowButton() {
    return window.location.href.includes("tab=controls");
}

function initializeButton() {
    if (isInitialized || !shouldShowButton()) return;

    const paymentMessage = "Process faction payments";
    const nextPaymentMessage = "Process next faction payment";

    const paymentButton = document.createElement('a');
    paymentButton.className = "torn-btn btn-small";
    paymentButton.textContent = paymentMessage;

    container = document.createElement('div');
    container.appendChild(paymentButton);

    const results = document.createElement("div");
    container.appendChild(results);

    var paymentInstructions = [];

    function report_message(msg, isError) {
        const result = document.createElement('div');
        result.style.display = 'flex';
        result.style.cursor = 'pointer';
        result.style.color = isError ? "red" : "green";
        result.innerHTML = msg;
        results.appendChild(result);
    }

    async function process_one_instruction() {
        const instruction = paymentInstructions.shift();

        var player_id = instruction[0];
        var amount = instruction[1];

        var existing_money_str = null;

        $(".listItem___XjdYl").each(function () {
            const userLink = $(this).find("a[href*='/profiles.php?XID=']");
            const href = userLink.attr("href");

            if (!href) return;

            const match = href.match(/XID=(\d+)/);
            if (match && match[1] === String(player_id)) {
                if (!$(this).find(".points___J_e0F").length) {
                    var moneyValue = $(this).find(".editBalanceWrap___zSfd0.canEdit___AnTEo input[type='hidden']").val();

                    if (!moneyValue) {
                        return;
                    }

                    existing_money_str = moneyValue;
                    return false;
                }
            }
        });

        if (typeof existing_money_str !== "string" || existing_money_str === "") {
            report_message("Failed to locate money for " + player_id, true);
            return;
        }

        var existing_money = parseInt(existing_money_str, 10);
        var final_money = existing_money + amount;

        var success_message = "Adjusted " + player_id + " by " + amount + ". Going from " + existing_money + " to " + final_money;
        var failure_message = "Failed to adjust " + player_id + " by " + amount + ". Going from " + existing_money + " to " + final_money;

        try {
            const response = await new Promise((resolve, reject) => {
                getAction({
                    type: 'post',
                    action: 'page.php?sid=factionsEditMoneyBalance',
                    data: {
                        depositor: player_id,
                        balance: final_money,
                    },
                    success: (str) => {
                        resolve(str);
                    },
                    error: (error) => {
                        reject(error);
                    }
                });
            });

            // Check if response is already an object or needs parsing
            let msg;
            if (typeof response === 'string') {
                try {
                    msg = JSON.parse(response);
                } catch (e) {
                    report_message("Error parsing server response: " + e.message, true);
                    return;
                }
            } else {
                // Response is already an object
                msg = response;
            }

            // Check if response has the expected structure
            if (msg.success === true) {
                // Success response
                report_message(success_message, false);
            } else if (msg.depositor && typeof msg.balance === 'number') {
                // Alternative success format: {"depositor":1561637,"balance":-6000001}
                report_message(success_message, false);
            } else if (msg.error) {
                // Error response
                report_message(failure_message + "<br>API Error: " + msg.error, true);
            } else {
                // Unknown response format - but might still be successful
                report_message(success_message + " (Warning: Unexpected response format)", false);
            }
        } catch (e) {
            report_message("Network error: " + e.message, true);
        }

        if (paymentInstructions.length == 0) {
            paymentButton.textContent = paymentMessage;
        } else {
            paymentButton.textContent = nextPaymentMessage + " (" + paymentInstructions.length + ")";
        }
    }

    async function process_payment_click() {
        if (paymentButton.textContent === paymentMessage) {
            const userInput = prompt("Enter payment command (format: [[userID, amount], ...])", "");
            if (userInput) {
                try {
                    const trimmedInput = userInput.trim();
                    const instructions = JSON.parse(trimmedInput);

                    // Validate input is an array
                    if (!Array.isArray(instructions)) {
                        throw new Error("Input must be an array");
                    }

                    if (instructions.length < 1) {
                        report_message("No payments to make", true);
                        return;
                    }

                    // Validate each instruction
                    for (let i = 0; i < instructions.length; i++) {
                        const inst = instructions[i];
                        if (!Array.isArray(inst) || inst.length !== 2) {
                            throw new Error(`Invalid instruction at index ${i}: expected [userID, amount]`);
                        }
                        if (typeof inst[0] !== 'number' || typeof inst[1] !== 'number') {
                            throw new Error(`Invalid instruction at index ${i}: userID and amount must be numbers`);
                        }
                    }

                    paymentInstructions = instructions;
                    await process_one_instruction();
                } catch(e) {
                    report_message("Parse error: " + e.message, true);
                }
            }
        } else {
            await process_one_instruction();
        }
    }

    paymentButton.addEventListener('click', async () => {
        await process_payment_click();
    });

    $(".content-wrapper")[0].prepend(container);
    isInitialized = true;
}

function removeButton() {
    if (container && container.parentNode) {
        container.parentNode.removeChild(container);
        isInitialized = false;
        container = null;
    }
}

function checkAndToggleButton() {
    if (shouldShowButton() && !isInitialized) {
        initializeButton();
    } else if (!shouldShowButton() && isInitialized) {
        removeButton();
    }
}

// Initial check
checkAndToggleButton();

// Monitor for URL changes (handles client-side navigation)
let lastUrl = location.href;
new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
        lastUrl = url;
        checkAndToggleButton();
    }
}).observe(document, { subtree: true, childList: true });