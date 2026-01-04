// ==UserScript==
// @name         Stock Cash Buy/Sell
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Adds cash input boxes to stocks
// @author       leonissenbaum
// @match        https://www.torn.com/page.php?sid=stocks*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541515/Stock%20Cash%20BuySell.user.js
// @updateURL https://update.greasyfork.org/scripts/541515/Stock%20Cash%20BuySell.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //make things look good!
    const style = document.createElement('style')
    style.textContent = `
    .input-money-symbol {
        border-radius: 0 !important;
    }
    .tm-input-cash {
        border-bottom-left-radius: 5px !important;
        border-bottom-right-radius: 0px !important;
        border-top-left-radius: 5px !important;
        border-top-right-radius: 0px !important;
    }
    [class*="withInput"] {
            width: auto !important;
    }
`;
    document.head.appendChild(style)


    // make sure we don't add the money box twice
    const processedElements = new WeakSet()
    let manualUpdate = false

    function addInputBeforeMoneySymbols() {
        const moneySymbolElements = document.querySelectorAll('.input-money-symbol');

        moneySymbolElements.forEach(element => {
            // Skip if we've already processed this element
            if (processedElements.has(element)) {
                return
            }

            const sendCashElement = element.closest('.send-cash')
            if (sendCashElement) {
                processedElements.add(element)
                return
            }

            // Create the new input element
            const newInput = document.createElement('input')
            newInput.setAttribute('data-money', 0)
            newInput.setAttribute('data-lpignore', 'true')
            newInput.setAttribute('autocomplete', 'off')
            newInput.setAttribute('autocorrect', 'off')
            newInput.setAttribute('autocapitalize', 'off')
            newInput.setAttribute('spellcheck', 'false')
            newInput.className = 'input-money tm-input-cash'

            // Insert before the money symbol element
            element.insertAdjacentElement('beforebegin', newInput)

            newInput.setAttribute('data-money', getMaxValue(newInput))

            newInput.addEventListener('input', function(event) {
                updateStockBox(event.target)
            })

            // Mark this element as processed
            processedElements.add(element)
        })
    }

    function updateCashBox(element) {
        if (manualUpdate) {
            return
        }
        //yes, as far as i can tell, this is the easiest way to get the share price. if it works it works!
        let sharePrice = Number(element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.querySelector('[class^="price"]').textContent)
        const sellBlock = Array.from(element.parentNode.parentNode.parentNode.parentNode.classList).some(className => className.startsWith('sellBlock'))
        if (sellBlock) {
            sharePrice *= 0.999 //0.1% fee
        }
        const money = element.value.replaceAll(",","") * sharePrice
        if (isNaN(money)) {
            return
        }
        let modifiedValue = "$" + Math.ceil(money).toLocaleString('en-US')
        if (sellBlock) {
        modifiedValue = "$" + Math.floor(money).toLocaleString('en-US')
        }
        element.parentNode.querySelector('.tm-input-cash').value = modifiedValue
    }

    function updateStockBox(element) {
        //first, format value. we will NOT have this look ugly!
        let stockBoxNum = element.value.replaceAll(",","").replaceAll("$","")
        //before that, we do need to format this for stuff like 5
        element.setAttribute('data-money', getMaxValue(element))
        const formattedNumber = rules(element)
        if (formattedNumber) {
            stockBoxNum = formattedNumber
        }
        if (isNaN(stockBoxNum)) {
            return
        }
        stockBoxNum = Math.min(stockBoxNum, element.getAttribute('data-money'))

        element.parentNode.querySelector('.tm-input-cash').value = "$" + Math.ceil(stockBoxNum).toLocaleString('en-US')

        let sharePrice = Number(element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.querySelector('[class^="price"]').textContent)
        const sellBlock = Array.from(element.parentNode.parentNode.parentNode.parentNode.classList).some(className => className.startsWith('sellBlock'))
        if (sellBlock) {
            sharePrice *= 0.999 //0.1% fee
        }

        const amountOfStocks = Math.ceil(stockBoxNum / sharePrice)
        const stockNumberBlock = element.parentNode.querySelector('.input-money:not(.tm-input-cash):not([type="hidden"])')
        stockNumberBlock.value = amountOfStocks
        //manualUpdate shennangians are needed here, because otherwise the observer detects this update and instantly updates this box again in updateCashBox
        manualUpdate = true
        stockNumberBlock.dispatchEvent(new Event('input', { bubbles: true }))
        setTimeout(() => {
            manualUpdate = false;
        }, 10);
    }

    function getMaxValue(element) {
        const sellBlock = Array.from(element.parentNode.parentNode.parentNode.parentNode.classList).some(className => className.startsWith('sellBlock'))
        if (!sellBlock) {
            return document.getElementById('user-money').textContent.replaceAll(",","").replaceAll("$","")
        } else {
            const numberOfShares = element.nextSibling.nextSibling.getAttribute('data-money')
            const costPerShare = Number(element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling.querySelector('[class^="price"]').textContent) * 0.999
            return Math.floor(numberOfShares * costPerShare)
        }

    }

    function rules(element) {
        const inputValue = element.value.replaceAll(",","").replaceAll("$","")
        const moneySourceData = element.getAttribute('data-money')

        const all = /^(all|max){1}$/i
        if (all.exec(inputValue)) {
            return moneySourceData
        }

        const thousand = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,3})?)k$', 'i')
        if (thousand.exec(inputValue)) {
            return Math.round(thousand.exec(inputValue)[1] * 1000)
        }

        const million = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,6})?)m$', 'i')
        if (million.exec(inputValue)) {
            return Math.round(million.exec(inputValue)[1] * 1000000)
        }

        const billion = new RegExp('^(' + reNumsSign + '\\d+[.]?(\\d{1,9})?)b$', 'i')
        if (billion.exec(inputValue)) {
            return Math.round(billion.exec(inputValue)[1] * 1000000000)
        }

        const quarter = /^(1\/4|quarter){1}$/i
        if (quarter.exec(inputValue) && moneySourceData) {
            return Math.round(parseInt(moneySourceData) / 4)
        }

        const third = /^(1\/3){1}$/i
        if (third.exec(inputValue) && moneySourceData) {
            return Math.round(parseInt(moneySourceData) / 3)
        }

        const half = /^(1\/2|half){1}$/i
        if (half.exec(inputValue) && moneySourceData) {
            return Math.round(parseInt(moneySourceData) / 2)
        }

        const percent = /^([1-9][0-9]?|100)%$/i
        if (percent.exec(inputValue) && moneySourceData) {
            return Math.round(parseInt(moneySourceData) * percent.exec(inputValue)[1] / 100)
        }

        const fraction = /^(([1-9])\/([2-9]|10))$/i
        const fractionMatch = fraction.exec(inputValue)
        if (fractionMatch && moneySourceData && (parseInt(fractionMatch[2]) < parseInt(fractionMatch[3]))) {
            return Math.round(parseInt(moneySourceData) * fractionMatch[2] / fractionMatch[3])
        }

        return null
    }

    // You'll need to define reNumsSign if it's not already defined
    // Based on the pattern, it's likely something like this:
    var reNumsSign = '[-+]?'; // Allows optional + or - sign

    // Set up MutationObserver to watch for DOM changes
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // Check if nodes were added
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                addInputBeforeMoneySymbols()
            }
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-money') {
                if (mutation.target.value) {
                    updateCashBox(mutation.target)
                }
            }

        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['data-money']
    });

})();