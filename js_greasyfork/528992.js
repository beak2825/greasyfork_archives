// ==UserScript==
// @name         Balance Changer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Скрытно меняет баланс на форуме.
// @author       eretly
// @match        https://lzt.market/*
// @match        https://lolz.live/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528992/Balance%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/528992/Balance%20Changer.meta.js
// ==/UserScript==

;(() => {
    const amountToAdd = 2439.32
    let pageReady = false

    function hideMainContent() {
        const style = document.createElement("style")
        style.id = "balance-changer-style"
        style.textContent = `
            body > *:not(header):not(.header):not(#header):not(footer):not(.footer):not(#footer):not(script):not(style) {
                visibility: hidden !important;
                opacity: 0 !important;
                transition: none !important;
            }
            header, footer, .header, .footer,
            #header, #footer, .navigation, .nav,
            header *, footer *, .header *, .footer *,
            #header *, #footer * {
                visibility: visible !important;
                opacity: 1 !important;
            }
        `
        document.head.appendChild(style)
    }

    function showMainContent() {
        const style = document.getElementById("balance-changer-style")
        if (style) {
            style.remove()
        }
        pageReady = true
    }

    function formatNumber(num) {
        let formattedNum = num.toLocaleString('ru-RU', { minimumFractionDigits: 2 });

        if (formattedNum.endsWith(',00')) {
            formattedNum = formattedNum.slice(0, -3);
        }

        return formattedNum;
    }


    function formatContestPrize(num) {
        const integerOnly = Number.parseInt(num.toString().split(/[,.]/)[0])
        return integerOnly.toLocaleString("ru-RU")
    }

    function modifyMarketBalance() {
        const newBalanceElement = document.querySelector(".user-balance-block .balance-title")

        if (newBalanceElement && !newBalanceElement.dataset.modified) {
            try {
                const currentBalance =
                      Number.parseFloat(newBalanceElement.textContent.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0
                const newBalance = currentBalance + amountToAdd
                const formattedBalance = formatNumber(newBalance)

                newBalanceElement.textContent = formattedBalance
                newBalanceElement.dataset.modified = "true"
            } catch (e) {
                console.error("Error modifying new balance element:", e)
            }
        }
    }

    function modifyBalance(element) {
        if (!element || element.dataset.modified) return

        if (element.classList.contains("muted")) return

        try {
            const currentBalance = Number.parseFloat(element.textContent.replace(/\s/g, "").replace(",", ".")) || 0
            const newBalance = currentBalance + amountToAdd
            element.textContent = formatNumber(newBalance)
            element.dataset.modified = "true"
        } catch (e) {
            console.error("Error", e)
        }
    }

    function modifyMethodBalance(element) {
        if (!element || element.dataset.modified) return;

        try {
            const text = element.textContent.trim();
            const balanceMatch = text.match(/\(([\d\s,.-]+)\s*₽\)/);

            if (balanceMatch) {
                let currentBalance = parseFloat(balanceMatch[1].replace(/\s/g, '').replace(',', '.')) || 0;
                let newBalance = currentBalance + amountToAdd;
                let formattedBalance = formatNumber(newBalance);

                const newText = text.replace(/\([\d\s,.-]+\s*₽\)/, `(${formattedBalance} ₽)`);
                element.textContent = newText;

                element.dataset.modified = "true";

            }
        } catch (e) {
            console.error("Error", e);
        }
    }

    function modifyContestBalance() {
        const contestBalanceElement = document.querySelector("#ContestPrizType--money .explain")
        if (contestBalanceElement && !contestBalanceElement.dataset.modified) {
            try {
                const text = contestBalanceElement.textContent.trim()
                const balanceMatch = text.match(/Доступный баланс\s*([\d\s,.-]+)\s*₽/)

                if (balanceMatch) {
                    const currentBalance = Number.parseFloat(balanceMatch[1].replace(/\s/g, "").replace(",", ".")) || 0
                    const newBalance = currentBalance + amountToAdd
                    const formattedBalance = formatNumber(newBalance)

                    const newText = text.replace(/Доступный баланс\s*[\d\s,.-]+\s*₽/, `Доступный баланс ${formattedBalance} ₽`)
                    contestBalanceElement.textContent = newText

                    contestBalanceElement.dataset.modified = "true"
                }
            } catch (e) {
                console.error("Error", e)
            }
        }
    }

    function modifyTransferAmount() {
        document.querySelectorAll(".bigTextHeading").forEach((element) => {
            if (!element.dataset.modified && element.textContent.includes("Сумма перевода (Доступно для перевода")) {
                try {
                    const match = element.textContent.match(/Доступно для перевода ([\d\s,.-]+)₽/)
                    if (match) {
                        const currentBalance = Number.parseFloat(match[1].replace(/\s/g, "").replace(",", ".")) || 0
                        const newBalance = currentBalance + amountToAdd
                        const formattedBalance = formatNumber(newBalance)

                        element.innerHTML = `Сумма перевода (Доступно для перевода ${formattedBalance} ₽)`
                        element.dataset.modified = "true"
                    }
                } catch (e) {
                    console.error("Ошибка при изменении суммы перевода:", e)
                }
            }
        })
    }

    function modifyLastTransferAmount() {
        const transferSpans = document.querySelectorAll(".Transfer[data-amount]")

        if (transferSpans.length > 0) {
            const lastTransfer = transferSpans[transferSpans.length - 1]

            if (!lastTransfer.dataset.modified) {
                try {
                    const currentAmount = Number.parseFloat(lastTransfer.dataset.amount.replace(/\s/g, "").replace(",", ".")) || 0
                    const newAmount = currentAmount + amountToAdd
                    const formattedAmount = formatNumber(newAmount)

                    lastTransfer.dataset.amount = formattedAmount
                    lastTransfer.querySelector("span:first-child").textContent = formattedAmount

                    lastTransfer.dataset.modified = "true"
                } catch (e) {
                    console.error("Ошибка при изменении суммы в <span class='Transfer'>:", e)
                }
            }
        }
    }

    function modifyPayoutBalance() {
        if (!window.location.href.includes("https://lzt.market/balance/payout")) return

        const payoutBalanceElement = document.querySelector(".explain .MarketAvailableBalance")
        if (payoutBalanceElement && !payoutBalanceElement.dataset.modified) {
            try {
                const currentBalance =
                      Number.parseFloat(payoutBalanceElement.textContent.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0

                const newBalance = currentBalance + amountToAdd

                const formattedBalance = formatNumber(newBalance)

                payoutBalanceElement.textContent = formattedBalance + " ₽"

                payoutBalanceElement.dataset.modified = "true"
            } catch (e) {
                console.error("Error", e)
            }
        }
    }

    function updateUI() {
        const notEnoughMoneyElement = document.getElementById("NotEnoughMoney")
        const totalMoneyPrizeElement = document.getElementById("TotalMoneyPrizeData")
        const prizeInputElement = document.getElementById("prize_data_money")
        const contestBalanceElement = document.querySelector("#ContestPrizType--money .explain")

        if (!contestBalanceElement || !prizeInputElement || !totalMoneyPrizeElement || !notEnoughMoneyElement) return

        // Получаем измененный баланс
        const balanceMatch = contestBalanceElement.textContent.match(/Доступный баланс\s*([\d\s,.-]+)\s*₽/)
        if (!balanceMatch) return

        const availableBalance = Number.parseFloat(balanceMatch[1].replace(/\s/g, "").replace(",", ".")) || 0

        // Получаем введенную сумму
        const prizeAmount = Number.parseFloat(prizeInputElement.value.replace(/\s/g, "").replace(",", ".")) || 0

        if (prizeAmount === 0 || prizeInputElement.value.trim() === "") {
            // Если сумма равна 0 или поле пустое
            notEnoughMoneyElement.style.display = "none" // Скрываем красное сообщение
            totalMoneyPrizeElement.style.display = "none" // Скрываем блок списания
        } else if (prizeAmount <= availableBalance) {
            // Если сумма меньше или равна балансу
            notEnoughMoneyElement.style.display = "none" // Скрываем красное сообщение
            totalMoneyPrizeElement.style.display = "block" // Показываем блок списания

            // Обновляем сумму списания с удалением десятичной части и с пробелами между тысячами
            const valueElement = totalMoneyPrizeElement.querySelector(".Value")
            if (valueElement) {
                valueElement.textContent = formatContestPrize(prizeAmount)
            }
        } else {
            // Если сумма больше баланса
            notEnoughMoneyElement.style.display = "block" // Показываем красное сообщение
            totalMoneyPrizeElement.style.display = "none" // Скрываем блок списания
        }
    }

    function setupPrizeInputListener() {
        const prizeInputElement = document.getElementById("prize_data_money")
        if (prizeInputElement) {
            prizeInputElement.addEventListener("input", () => {
                setTimeout(updateUI, 100)
            })
        }
    }

    function applyChanges() {
        if (window.location.href.includes("lzt.market")) {
            document.querySelectorAll(".balanceValue, .Incomes").forEach(modifyBalance)
            modifyMarketBalance()
            document
                .querySelectorAll(".Method.method.full.balance.balance, .Method.method.full.balance.balance.selected")
                .forEach(modifyMethodBalance)
            modifyTransferAmount()
            modifyLastTransferAmount()
            modifyPayoutBalance()
        }

        if (window.location.href.includes("lolz.live")) {
            lolzLiveSpecificFix()
            modifyContestBalance()
            updateUI()
            setupPrizeInputListener()
        }
    }

    function startObserver() {
        if (!document.body) {
            setTimeout(startObserver, 100)
            return
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === "childList") {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const methodBalanceElements = node.querySelectorAll
                            ? node.querySelectorAll(
                                ".Method.method.full.balance.balance, .Method.method.full.balance.balance.selected",
                            )
                            : []
                            methodBalanceElements.forEach(modifyMethodBalance)

                            if (node.id === "ContestPrizType--money" || node.querySelector("#ContestPrizType--money")) {
                                modifyContestBalance()
                                updateUI()
                                setupPrizeInputListener()
                            }

                            if (window.location.href.includes("https://lzt.market/balance/payout")) {
                                modifyPayoutBalance()
                            }

                            modifyTransferAmount()
                            modifyLastTransferAmount()
                        }
                    })
                }
            }
        })

        observer.observe(document.body, { childList: true, subtree: true })
    }

    startObserver()

    hideMainContent()

    document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
            applyChanges()
            setTimeout(showMainContent, 150)
        }, 100)
    })

    window.addEventListener("load", () => {
        setTimeout(() => {
            applyChanges()
            if (!pageReady) {
                setTimeout(showMainContent, 150)
            }
        }, 200)
    })

    if (document.readyState !== "loading") {
        setTimeout(() => {
            applyChanges()
            setTimeout(showMainContent, 150)
        }, 100)
    }

    function lolzLiveSpecificFix() {
        const possibleSelectors = [
            "#AccountMenu .balanceValue",
            ".balanceRow .balanceValue",
            ".Menu.HeaderMenu .balanceValue",
            ".balanceValue",
        ]

        for (const selector of possibleSelectors) {
            const elements = document.querySelectorAll(selector)
            if (elements.length > 0) {
                elements.forEach(modifyBalance)
            }
        }
    }
})()
