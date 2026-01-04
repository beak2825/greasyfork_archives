// ==UserScript==
// @name         Fake Roblox Group Payout
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fake Roblox group payout interface for demonstration
// @author       You
// @match        https://create.roblox.com/dashboard/group/payouts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539838/Fake%20Roblox%20Group%20Payout.user.js
// @updateURL https://update.greasyfork.org/scripts/539838/Fake%20Roblox%20Group%20Payout.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let fakeGroupFunds = 5425654; // Change group funds
    let groupFundsElement = null; // Store reference to the element

    function formatNumber(num) {
        return num.toLocaleString();
    }

    function showSuccessNotification() {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #009D58;
            color: black;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        // Create checkmark icon
        const checkmark = document.createElement('span');
        checkmark.innerHTML = '✓';
        checkmark.style.cssText = `
            display: inline-block;
            width: 24px;
            height: 24px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            text-align: center;
            line-height: 24px;
            margin-right: 12px;
            font-size: 14px;
            font-weight: bold;
        `;
        notification.appendChild(checkmark);
        notification.textContent = 'The payout has been sent';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    function addStyles() {
        if (!document.querySelector('#fake-payout-styles')) {
            const style = document.createElement('style');
            style.id = 'fake-payout-styles';
            style.textContent = `
                .fake-hidden-error {
                    display: none !important;
                }
                .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline {
                    border-color: #494d5a !important;
                }
                .fake-robux-amount {
                    letter-spacing: 2px !important;
                    font-variant-numeric: tabular-nums !important;
                }
                /* Force label to not be red */
                #payout-amount-label.Mui-error,
                label[for="payout-amount"].Mui-error {
                    color: rgba(255, 255, 255, 0.7) !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function updateGroupFunds() {
        const fakeAmount = formatNumber(fakeGroupFunds);
        console.log('=== DEBUGGING GROUP FUNDS UPDATE ===');
        console.log('Target amount to display:', fakeAmount);
        console.log('Current fakeGroupFunds variable:', fakeGroupFunds);

        // Method 1: Look for injpog spans specifically
        const injpogSpans = document.querySelectorAll('span[class*="injpog"]');
        console.log('Found', injpogSpans.length, 'spans with "injpog" in class');
        injpogSpans.forEach((span, index) => {
            console.log(`  injpog span ${index}: "${span.textContent}" | class: ${span.className}`);
            const oldText = span.textContent;
            span.textContent = fakeAmount;
            console.log(`  Updated span ${index} from "${oldText}" to "${fakeAmount}"`);
        });

        // Method 2: Look for ANY spans with large numbers
        const allSpans = document.querySelectorAll('span');
        console.log('Checking all', allSpans.length, 'spans for large numbers...');

        let foundLargeNumbers = [];
        allSpans.forEach((span, index) => {
            const text = span.textContent.trim();
            const cleanNum = parseInt(text.replace(/[,\s]/g, ''));

            if (cleanNum > 100000000) {
                foundLargeNumbers.push({
                    index: index,
                    text: text,
                    cleanNum: cleanNum,
                    className: span.className
                });
            }
        });

        console.log('Found', foundLargeNumbers.length, 'spans with large numbers:');
        foundLargeNumbers.forEach(item => {
            console.log(`  Span ${item.index}: "${item.text}" (${item.cleanNum}) | class: ${item.className}`);
        });

        // Update all large number spans
        foundLargeNumbers.forEach(item => {
            const span = allSpans[item.index];
            span.textContent = fakeAmount;
            console.log(`  FORCED UPDATE span ${item.index} to: ${fakeAmount}`);
        });

        console.log('=== END DEBUGGING ===');
    }

    function processModal() {
        const modal = document.querySelector('[role="dialog"]');
        if (!modal || !modal.textContent.includes('Send to Creators')) return;

        // Hide error message
        const errorAlert = modal.querySelector('.MuiAlert-filledError');
        if (errorAlert) {
            errorAlert.classList.add('fake-hidden-error');
        }

        // Fix input styling
        const amountInput = modal.querySelector('#payout-amount');
        if (amountInput) {
            amountInput.setAttribute('aria-invalid', 'false');

            const container = amountInput.closest('.MuiOutlinedInput-root');
            if (container) {
                container.classList.remove('Mui-error');
            }

            // Enable Next button
            const nextBtn = modal.querySelector('button[disabled]');
            if (nextBtn && nextBtn.textContent.includes('Next')) {
                nextBtn.disabled = false;
                nextBtn.removeAttribute('disabled');
                nextBtn.classList.remove('Mui-disabled');
                nextBtn.style.opacity = '1';
                nextBtn.style.backgroundColor = 'white';
                nextBtn.style.color = 'black';
                nextBtn.style.border = '1px solid #ccc';

                // Hijack click
                if (!nextBtn.dataset.hijacked) {
                    nextBtn.dataset.hijacked = 'true';

                    nextBtn.addEventListener('click', function(e) {
                        let amount = parseInt(amountInput.value) || 0;
                        if (amount > 0) {
                            e.preventDefault();
                            e.stopPropagation();

                            // Round to nearest thousand for easy calculation
                            amount = Math.round(amount / 1000) * 1000;

                            console.log('Processing payout of', amount, '(rounded to nearest thousand)');
                            fakeGroupFunds -= amount;
                            console.log('New fake group funds:', fakeGroupFunds);
                            console.log('Expected display amount:', formatNumber(fakeGroupFunds));

                            // Close modal like Cancel button
                            const cancelButton = modal.querySelector('button');
                            if (cancelButton && cancelButton.textContent.includes('Cancel')) {
                                console.log('Clicking Cancel button to close modal properly');
                                cancelButton.click();
                            } else {
                                // Fallback: click backdrop
                                const backdrop = document.querySelector('.MuiBackdrop-root');
                                if (backdrop) {
                                    console.log('Clicking backdrop to close modal');
                                    backdrop.click();
                                } else {
                                    // Last resort: hide modal
                                    modal.style.display = 'none';
                                }
                            }

                            showSuccessNotification();

                            // AGGRESSIVE multi-attempt updating
                            setTimeout(() => {
                                console.log('=== STARTING AGGRESSIVE UPDATE SEQUENCE ===');
                                updateGroupFunds();
                                setTimeout(() => {
                                    console.log('=== UPDATE ATTEMPT 2 ===');
                                    updateGroupFunds();
                                }, 100);
                                setTimeout(() => {
                                    console.log('=== UPDATE ATTEMPT 3 ===');
                                    updateGroupFunds();
                                }, 500);
                                setTimeout(() => {
                                    console.log('=== UPDATE ATTEMPT 4 ===');
                                    updateGroupFunds();
                                }, 1000);
                                setTimeout(() => {
                                    console.log('=== FINAL UPDATE ATTEMPT ===');
                                    updateGroupFunds();
                                }, 2000);
                            }, 500);
                        }
                    });
                }
            }
        }
    }

    function init() {
        addStyles();

        // Simple observer - only update when DOM changes
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });

            if (shouldUpdate) {
                processModal();
                setTimeout(updateGroupFunds, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial calls only - no intervals
        setTimeout(updateGroupFunds, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();

