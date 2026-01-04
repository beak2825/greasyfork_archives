// ==UserScript==
// @name         DoorDash fees buster
// @namespace    http://tampermonkey.net/
// @version      2025-07-07.6
// @description  Display DoorDash fees in a clearer way.
// @author       Somebody
// @match        https://www.doordash.com/consumer/checkout/*
// @match        https://www.doordash.com/store/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doordash.com
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522166/DoorDash%20fees%20buster.user.js
// @updateURL https://update.greasyfork.org/scripts/522166/DoorDash%20fees%20buster.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const D = window.document;
    const GLOBAL_TIMEOUT = 10 * 1000;

    const KNOWN_DELIVERY_MARKUP_BUSINESS_NAMES = [
        'Popeyes Louisiana Kitchen',
        'Jollibee',
        'KFC',
        'Qdoba Mexican Eats',
        'Chipotle Mexican Grill',
    ];

    const KNOWN_PICKUP_MARKUP_BUSINESS_NAMES = [
        'Qdoba Mexican Eats',
    ];

    const KNOWN_GHOST_KITCHEN_ADDRESSES = [
        '2100 Kerrigan Ave, Union City, NJ 07087, USA',
    ];

    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const createElementWithInnerTextAndStyle = (ElementName, innerText, style = {}) => {
        const element = D.createElement(ElementName);
        if (typeof innerText === 'string') {
            element.innerText = innerText;
        }
        Object.assign(
            element.style,
            style
        );
        return element;
    };

    const createQuestionMarkInCircle = () => {
        const wrpperElement = D.createElement('a');
        const circleElement = createElementWithInnerTextAndStyle('span', '?', {
            display: 'inline-block',
            textAlign: 'center',
            borderRadius: '50%',
            margin: '0 0.5em',
            border: 'solid',
            textDecoration: 'none',
            padding: '0 0.4rem',
        });
        wrpperElement.appendChild(circleElement);
        return wrpperElement;
    };

    const createToastWithText = (() => {
        const showToast = (text, disappearDelayInMs = 1000) => {
            const defaultStyle = {
                position: 'fixed',
                top: '10vh',
                zIndex: 9999,
                transform: 'translateX(-50%)',
                left: '50%',
                transition: 'all 0.25s ease',
                borderRadius: '2em',
                backgroundColor: 'black',
                padding: '0.5em 2em',
                color: 'white',
                textAlign: 'center',
                opacity: '0',
            };
            const toast = createElementWithInnerTextAndStyle('div', text, defaultStyle);
            D.body.append(toast);
            setTimeout(
                () => {
                    Object.assign(
                        toast.style, {
                            opacity: '100%'
                        }
                    );
                },
                0
            );
            const removeToast = () => {
                Object.assign(
                    toast.style, {
                        opacity: '0'
                    }
                );
                setTimeout(
                    () => {
                        D.body.removeChild(toast);
                    },
                    250
                );
            };
            if (disappearDelayInMs > 0) {
                setTimeout(
                    removeToast,
                    disappearDelayInMs
                );
            } else {
                return removeToast;
            }
        };
        return showToast;
    })();

    const getInitialServiceFee = () => {
        // This is no longer true if items are modified after page load
        const keyword = 'Service Fee: ';
        let line = Array.from(D.querySelectorAll('script')).find(e => e.innerText.includes(keyword))?.innerText;
        line = line?.substring(line?.indexOf(keyword));
        line = line?.substring(0, line?.indexOf('\"'));
        return line;
    };

    const getInitialEstimatedTax = () => {
        // This is no longer true if items are modified after page load
        const keyword = 'Estimated Tax: ';
        let line = Array.from(D.querySelectorAll('script')).find(e => e.innerText.includes(keyword))?.innerText;
        line = line?.substring(line?.indexOf(keyword));
        line = line?.substring(0, line?.indexOf('\"'));
        return line;
    };

    const getInitialBagFee = () => {
        // This is no longer true if items are modified after page load
        const keyword = 'Bag Fee: ';
        let line = Array.from(D.querySelectorAll('script')).find(e => e.innerText.includes(keyword))?.innerText;
        line = line?.substring(line?.indexOf(keyword));
        line = line?.substring(0, line?.indexOf('\"'));
        return line;
    };

    const getInitialBusinessName = () => {
        const businessNameElement = Array.from(document.querySelectorAll('span')).find(spenElement => ['Your cart from', 'Order From', 'Checkout'].includes(spenElement.innerText))?.nextSibling;
        if (businessNameElement instanceof HTMLElement) {
            return Array.from(businessNameElement.querySelectorAll('span')).find(spenElement => typeof spenElement.innerText === 'string' && spenElement.innerText.length > 0)?.innerText;
        }
    };

    const getInitialBusinessDisplayAddress = () => {
        const keyword = 'displayAddress\\":\\"';
        let line = Array.from(D.querySelectorAll('script')).find(e => e.innerText.includes(keyword))?.innerText;
        line = line?.substring(line?.indexOf(keyword) + keyword.length);
        line = line?.substring(0, line?.indexOf('\\"'));
        return line;
    };

    const triggerHover = (element) => {
        if (element instanceof HTMLElement) {
            // Create the mouseenter event
            const mouseEnterEvent = new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            // Create the mouseover event
            const mouseOverEvent = new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            // Create the mouseleave event
            const mouseLeaveEvent = new MouseEvent('mouseleave', {
                bubbles: true,
                cancelable: true,
                view: window,
            });

            // Dispatch mouseenter and mouseover events
            element.dispatchEvent(mouseEnterEvent);
            element.dispatchEvent(mouseOverEvent);

            const triggerHoverEnd = () => {
                element.dispatchEvent(mouseLeaveEvent);
            };
            return triggerHoverEnd;
        }
    };

    const findLineItemsElement = () => D.querySelector('[data-testid="LineItems"]');

    // const findStackChildrenElement = () => D.querySelector('[class^="StackChildren"]');

    // const findTooltipElements = () => D.querySelectorAll('[role="tooltip"]');

    const findEstimatedTaxElement = () => D.querySelector('[data-testid="Estimated Tax"]');

    const findFeesAndEstimatedTaxElement = () => D.querySelector('[data-testid="Fees & Estimated Tax"]');

    const findFeesAndEstimatedTaxTooltipTriggerElement = () => findFeesAndEstimatedTaxElement()?.querySelector('button');

    const findServiceFeeElement = () => D.querySelector('[data-testid="Service Fee"]');

    const findBagFeeElement = () => D.querySelector('[data-testid="Bag Fee"]');

    const findSubtotalElement = () => D.querySelector('[data-testid="Subtotal"]');

    const findDeliveryFeeElement = () => D.querySelector('[data-testid="Delivery Fee"]');

    const findLongDistanceFeeElement = () => D.querySelector('[data-testid="Long Distance Fee"]');

    const findDasherTipElement = () => D.querySelector('[data-testid="Dasher Tip"]');

    const findTipTheStuffElement = () => D.querySelector('[data-testid="Tip the staff"]');

    const findTotalElement = () => D.querySelector('[data-testid="Total"]');

    const findCartTotalElement = () => D.querySelector('[data-anchor-id="OrderCartTotal"]');

    const findPopupLayerElement = () => D.querySelector('[data-testid="LAYER-MANAGER-POPOVER_CONTENT"]');

    const findFeesAndEstimatedTaxTotalElement = () => {
        const feesAndEstimatedTaxElement = findFeesAndEstimatedTaxElement();
        if (feesAndEstimatedTaxElement instanceof HTMLElement) {
            const totalElement = Array.from(feesAndEstimatedTaxElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return totalElement;
        }
        return undefined;
    };

    const findSubtotalTotalElement = () => {
        const subtotalElement = findSubtotalElement();
        if (subtotalElement instanceof HTMLElement) {
            const totalElement = Array.from(subtotalElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return totalElement;
        }
        return undefined;
    };

    const findDoorDashCreditsTotalElement = () => {
        const lineItemsElement = D.querySelector('[data-testid="LineItems"]');
        if (lineItemsElement instanceof HTMLElement) {
            const doorDashCreditsDescriptionElement = Array.from(lineItemsElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('DoorDash Credits'));
            const doorDashCreditsTotalElement = doorDashCreditsDescriptionElement?.parentNode?.lastChild;
            return doorDashCreditsTotalElement;
        }
        return undefined;
    };

    const findDasherTipTotalElement = () => {
        const dasherTipElement = findDasherTipElement();
        if (dasherTipElement instanceof HTMLElement) {
            const doorDashTipTotalElement = Array.from(dasherTipElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$'));
            return doorDashTipTotalElement;
        }
        return undefined;
    };

    const findTipTheStuffTotalElement = () => {
        const tipTheStuffElement = findTipTheStuffElement();
        if (tipTheStuffElement instanceof HTMLElement) {
            const tipTheStuffTotalElement = Array.from(tipTheStuffElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$'));
            return tipTheStuffTotalElement;
        }
        return undefined;
    };

    const findDeliveryFeeElementTotalElement = () => {
        const deliveryFeeElement = findDeliveryFeeElement();
        if (deliveryFeeElement instanceof HTMLElement) {
            const deliveryFeeTotalElement = Array.from(deliveryFeeElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return deliveryFeeTotalElement;
        }
        return undefined;
    };

    const findLongDistanceFeeTotalElement = () => {
        const longDistanceFeeElement = findLongDistanceFeeElement();
        if (longDistanceFeeElement instanceof HTMLElement) {
            const longDistanceFeeTotalElement = Array.from(longDistanceFeeElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return longDistanceFeeTotalElement;
        }
        return undefined;
    };

    const findServiceFeeTotalElement = () => {
        const serviceFeeElement = findServiceFeeElement();
        if (serviceFeeElement instanceof HTMLElement) {
            const serviceFeeTotalElement = Array.from(serviceFeeElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return serviceFeeTotalElement;
        }
        return undefined;
    };

    const findEstimatedTaxTotalElement = () => {
        const estimatedTaxElement = findEstimatedTaxElement();
        if (estimatedTaxElement instanceof HTMLElement) {
            const estimatedTaxTotalElement = Array.from(estimatedTaxElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return estimatedTaxTotalElement;
        }
        return undefined;
    };

    const findBagFeeTotalElement = () => {
        const bagFeeElement = findBagFeeElement();
        if (bagFeeElement instanceof HTMLElement) {
            const bagFeeTotalElement = Array.from(bagFeeElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$') && !window.getComputedStyle(spanElement).textDecoration.includes('line-through'));
            return bagFeeTotalElement;
        }
        return undefined;
    };

    const findStoreInfoElements = () => D.querySelectorAll('[data-testid="storeInfo"]');

    const findMainElement = () => D.querySelector('main');

    const findTooltipByKeywordsWithObserver = (keywords) => new Promise((resolve, reject) => {
        const popupLayerElement = findPopupLayerElement();
        if (popupLayerElement instanceof HTMLElement) {
            const timeoutId = setTimeout(() => {
                createToastWithText('Unable to find target popup element before timeout');
                reject(new Error('unable to find target popup element before timeout'));
                observer.disconnect();
            }, GLOBAL_TIMEOUT);
            const observer = new MutationObserver(async (mutationsList, observer) => {
                try {
                    // Iterate over all mutations
                    loop:
                    for (let mutation of mutationsList) {
                        // Check if nodes were added to the DOM
                        if (mutation.type === 'childList') {
                            // Look for the element with the specific keyword
                            for (const addedNode of mutation.addedNodes) {
                                if (keywords.every(keyword => addedNode.innerText?.includes(keyword))) {
                                    // disconnect the observer once the element is found
                                    observer.disconnect();
                                    clearTimeout(timeoutId);
                                    resolve(addedNode);
                                    break loop;
                                }
                            }
                        }
                    }
                } catch (err) {
                    clearTimeout(timeoutId);
                    createToastWithText('Unable to find tooltip due to an error');
                    console.error(err);
                    reject(err);
                }
            });

            // Configure the observer to look for added nodes in the popup layer
            observer.observe(popupLayerElement, {
                childList: true, // Look for added/removed child nodes
                subtree: true, // Include all descendants in the search
            });
        } else {
            reject(new Error('unable to find popup layer element'));
        }
    });

    const getFeesAndTaxFromTooltip = async () => {
        const targetTooltipElementPromise = findTooltipByKeywordsWithObserver(['Service Fee', 'Estimated Tax']);
        const triggerHoverEnd = triggerHover(findFeesAndEstimatedTaxTooltipTriggerElement());
        const targetTooltipElement = await targetTooltipElementPromise;
        const targetTooltipElementInnerText = targetTooltipElement?.innerText;
        triggerHoverEnd?.();
        const targetTooltipElementInnerTextLines = targetTooltipElementInnerText?.split('\n')?.map(line => line.trim());
        const serviceFee = targetTooltipElementInnerTextLines?.find(line => line.startsWith('Service Fee'));
        const estimatedTax = targetTooltipElementInnerTextLines?.find(line => line.startsWith('Estimated Tax'));
        const bagFee = targetTooltipElementInnerTextLines?.find(line => line.startsWith('Bag Fee')); // Very innovative, what else will they come up with?
        return [serviceFee, estimatedTax, bagFee];
    };

    const getNumberOnly = (text, fallback = '0') => {
        const decimalNumberRegExp = new RegExp(/(\d*\.)?\d+/);
        if (typeof text !== 'string') {
            if (typeof fallback === 'undefined') {
                throw new TypeError('text must be string');
            }
            return fallback;
        }
        // Find the last index of $, to get only the original price
        const originalNumberValue = text.substring(text.lastIndexOf('$'));
        const numberPart = originalNumberValue.match(decimalNumberRegExp)?.[0];
        return numberPart;
    };

    const getFeesAndTaxFromTooltipMemorized = (() => {
        let serviceFee = 'Service Fee: $0.00';
        let estimatedTax = 'Estimated Tax: $0.00';
        let bagFee = 'Bag Fee: $0.00';
        let isFirstRun = true;
        return async () => {
            const serviceFeeAndEstimatedTax = findFeesAndEstimatedTaxTotalElement()?.innerText;
            // Be careful about float point number precision error
            if (Math.round(parseFloat(getNumberOnly(serviceFeeAndEstimatedTax)) * 100) !== Math.round(parseFloat(getNumberOnly(serviceFee)) * 100) + Math.round(parseFloat(getNumberOnly(estimatedTax)) * 100) + Math.round(parseFloat(getNumberOnly(bagFee)) * 100)) {
                if (isFirstRun) {
                    [serviceFee, estimatedTax, bagFee] = [getInitialServiceFee(), getInitialEstimatedTax(), getInitialBagFee()];
                    isFirstRun = false;
                    if (typeof serviceFee === 'undefined' || typeof estimatedTax === 'undefined') {
                        [serviceFee, estimatedTax, bagFee] = await getFeesAndTaxFromTooltip();
                    }
                } else {
                    [serviceFee, estimatedTax, bagFee] = await getFeesAndTaxFromTooltip();
                }
            }
            return [serviceFee, estimatedTax, bagFee];
        };
    })();

    const getTotalCost = () => {
        const cartTotalElement = findCartTotalElement();
        const cartTotal = parseFloat(getNumberOnly(cartTotalElement.innerText));
        let totalCost = cartTotal;
        const doorDashCreditsTotalElement = findDoorDashCreditsTotalElement();
        if (doorDashCreditsTotalElement instanceof HTMLElement) {
            const doorDashCreditsTotal = Math.abs(parseFloat(getNumberOnly(doorDashCreditsTotalElement.innerText)));
            totalCost += doorDashCreditsTotal;
        }
        return totalCost;
    };

    const insertNewRow = (description, total, insertAfterElement, testid = '') => {
        const newRowElement = findSubtotalElement().cloneNode(true);
        newRowElement.dataset.testid = testid;
        const descriptionElement = Array.from(newRowElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('Subtotal'));
        descriptionElement.innerText = description;
        const totalElement = Array.from(newRowElement.querySelectorAll('span')).find(spanElement => spanElement.innerText.includes('$'));
        totalElement.innerText = total;
        if (insertAfterElement.nextSibling) {
            insertAfterElement.parentNode.insertBefore(newRowElement, insertAfterElement.nextSibling);
        } else {
            insertAfterElement.parentNode.appendChild(newRowElement);
        }
        return newRowElement;
    };

    const calcCostPercentage = (cost) => {
        const subtotalTotalElement = findSubtotalTotalElement();
        const subtotal = parseFloat(getNumberOnly(subtotalTotalElement.innerText));
        const percentage = Math.ceil(cost * 10000 / subtotal) / 100;
        return percentage;
    };

    const setColorRecursively = (parentElement, color = 'red') => {
        Object.assign(
            parentElement.style,
            {
                color: color,
            },
        );
        Array.from(parentElement.querySelectorAll('span, div')).forEach(spanOrDivElement => {
            Object.assign(
                spanOrDivElement.style,
                {
                    color: color,
                },
            );
        });
    };

    const updateLineItems = async () => {
        const estimatedTaxElement = findEstimatedTaxElement();
        const feesAndEstimatedTaxElement = findFeesAndEstimatedTaxElement();
        // Only perform remaining logic if we can find fees and estimated tax element
        // Usually this means we are getting the order delivered
        // After recent update doordash is showing service fee and estimated tax separately already?
        // Maybe it is just an A/B test hehe
        if (feesAndEstimatedTaxElement instanceof HTMLElement) {
            const [serviceFee, estimatedTax, bagFee] = await getFeesAndTaxFromTooltipMemorized();
            if (feesAndEstimatedTaxElement instanceof HTMLElement) {
                const serviceFeeElementTestid = 'Service Fee';
                D.querySelector(`[data-testid="${serviceFeeElementTestid}"]`)?.remove();
                const serviceFeeElement = insertNewRow(serviceFee.split(': ')[0], `$${getNumberOnly(serviceFee)}`, feesAndEstimatedTaxElement, serviceFeeElementTestid);
                setColorRecursively(serviceFeeElement, 'red');
                const estimatedTaxElementTestid = 'Estimated Tax';
                D.querySelector(`[data-testid="${estimatedTaxElementTestid}"]`)?.remove();
                const estimatedTaxElement = insertNewRow(estimatedTax.split(': ')[0], `$${getNumberOnly(estimatedTax)}`, serviceFeeElement, estimatedTaxElementTestid);
                const bagFeeElementTestid = 'Bag Fee';
                D.querySelector(`[data-testid="${bagFeeElementTestid}"]`)?.remove();
                if (typeof bagFee === 'string' && bagFee.length > 0) {
                    const bagFeeElement = insertNewRow(bagFee.split(': ')[0], `$${getNumberOnly(bagFee)}`, estimatedTaxElement, bagFeeElementTestid);
                    setColorRecursively(bagFeeElement, 'red');
                }

                setColorRecursively(feesAndEstimatedTaxElement, 'darkgray');
            }

            const totalElement = findTotalElement();
            if (totalElement instanceof HTMLElement) {
                const businessName = getInitialBusinessName();
                const deliveryMarkUpWarningTestid = 'Delivery Markup Warning';
                D.querySelector(`[data-testid="${deliveryMarkUpWarningTestid}"]`)?.remove();
                const pickupMarkUpWarningTestid = 'Pickup Markup Warning';
                D.querySelector(`[data-testid="${pickupMarkUpWarningTestid}"]`)?.remove();
                if (KNOWN_DELIVERY_MARKUP_BUSINESS_NAMES.includes(businessName)) {
                    const deliveryMarkUpWarningElement = insertNewRow('This business typically charges higher prices for DoorDash delivery, so the pre-tax subtotal would be lower if purchased in-store.\n(Hint: Switch to the pickup and take a look?)', ' ', totalElement, deliveryMarkUpWarningTestid);
                    setColorRecursively(deliveryMarkUpWarningElement, 'red');
                }
            }
        } else if (estimatedTaxElement instanceof HTMLElement) {
            // We only resort to use this logic branch when fees and estimated tax element is not found
            // Be careful, only use this when feesAndEstimatedTaxElement is not found, as we are adding estimated tax element ourselves when the current order is for delivery
            // Usually this means we are getting the order for pickup
            const totalElement = findTotalElement();
            if (totalElement instanceof HTMLElement) {
                const businessName = getInitialBusinessName();
                const deliveryMarkUpWarningTestid = 'Delivery Markup Warning';
                D.querySelector(`[data-testid="${deliveryMarkUpWarningTestid}"]`)?.remove();
                const pickupMarkUpWarningTestid = 'Pickup Markup Warning';
                D.querySelector(`[data-testid="${pickupMarkUpWarningTestid}"]`)?.remove();
                if (KNOWN_PICKUP_MARKUP_BUSINESS_NAMES.includes(businessName)) {
                    const pickupMarkUpWarningElement = insertNewRow('This business typically charges higher prices for DoorDash pickup, so the pre-tax subtotal would be lower if purchased in-store.\n(Hint: Go to the business official website and take a look?)', ' ', totalElement, pickupMarkUpWarningTestid);
                    setColorRecursively(pickupMarkUpWarningElement, 'red');
                }
            }
        } else {
            // Not sure what is going on but we don't try anything smart
            restoreLineItems();
        }

        // Calc percentages, the fun part
        const deliveryFeeElement = findDeliveryFeeElement();
        if (deliveryFeeElement instanceof HTMLElement) {
            const deliveryFeeTotalElement = findDeliveryFeeElementTotalElement();
            deliveryFeeTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(deliveryFeeTotalElement.innerText)))}% = $${getNumberOnly(deliveryFeeTotalElement.innerText)}`;
            setColorRecursively(deliveryFeeElement, 'red');
        }

        const longDistanceFeeElement = findLongDistanceFeeElement();
        if (longDistanceFeeElement instanceof HTMLElement) {
            const longDistanceFeeTotalElement = findLongDistanceFeeTotalElement();
            longDistanceFeeTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(longDistanceFeeElement.innerText)))}% = $${getNumberOnly(longDistanceFeeElement.innerText)}`;
            setColorRecursively(longDistanceFeeElement, 'red');
        }

        const serviceFeeElement = findServiceFeeElement();
        if (serviceFeeElement instanceof HTMLElement) {
            const serviceFeeTotalElement = findServiceFeeTotalElement();
            serviceFeeTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(serviceFeeTotalElement.innerText)))}% = $${getNumberOnly(serviceFeeTotalElement.innerText)}`;
            setColorRecursively(serviceFeeTotalElement, 'red');
        }

        const bagFeeElement = findBagFeeElement();
        if (bagFeeElement instanceof HTMLElement) {
            const bagFeeTotalElement = findBagFeeTotalElement();
            bagFeeTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(bagFeeTotalElement.innerText)))}% = $${getNumberOnly(bagFeeTotalElement.innerText)}`;
            setColorRecursively(bagFeeTotalElement, 'red');
        }

        // Find current estimated tax element, it might already be there, it might be inserted by us
        const currentEstimatedTaxElement = findEstimatedTaxElement();
        if (currentEstimatedTaxElement instanceof HTMLElement) {
            const currentEstimatedTaxTotalElement = findEstimatedTaxTotalElement();
            currentEstimatedTaxTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(currentEstimatedTaxTotalElement.innerText)))}% = $${getNumberOnly(currentEstimatedTaxTotalElement.innerText)}`;
        }

        const dasherTipElement = findDasherTipElement();
        if (dasherTipElement instanceof HTMLElement) {
            const dasherTipTotalElement = findDasherTipTotalElement();
            dasherTipTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(dasherTipTotalElement.innerText)))}% = $${getNumberOnly(dasherTipTotalElement.innerText)}`;
            setColorRecursively(dasherTipElement, 'red');
        }

        const tipTheStuffElement = findTipTheStuffElement();
        if (tipTheStuffElement instanceof HTMLElement) {
            const tipTheStuffTotalElement = findTipTheStuffTotalElement();
            tipTheStuffTotalElement.innerText = `${calcCostPercentage(parseFloat(getNumberOnly(tipTheStuffTotalElement.innerText)))}% = $${getNumberOnly(tipTheStuffTotalElement.innerText)}`;
            setColorRecursively(tipTheStuffElement, 'red');
        }

        const totalCost = getTotalCost();
        const cartTotalElement = findCartTotalElement();
        if (!Number.isNaN(totalCost) && cartTotalElement instanceof HTMLElement && currentEstimatedTaxElement instanceof HTMLElement) {
            const estimatedTax = getNumberOnly(currentEstimatedTaxElement.innerText);
            cartTotalElement.innerText = `${calcCostPercentage(totalCost - parseFloat(estimatedTax))}% (Pretax) / ${calcCostPercentage(totalCost)}% = $${getNumberOnly(cartTotalElement.innerText)}`;
        }
    };

    const restoreLineItems = () => {
        // const feesElementTestid = 'Service Fee';
        // D.querySelector(`[data-testid="${feesElementTestid}"]`)?.remove();
        // const estimatedTaxElementTestid = 'Estimated Tax';
        // D.querySelector(`[data-testid="${estimatedTaxElementTestid}"]`)?.remove();
        const feesAndEstimatedTaxElement = findFeesAndEstimatedTaxElement();
        if (feesAndEstimatedTaxElement instanceof HTMLElement) {
            setColorRecursively(feesAndEstimatedTaxElement, 'initial');
        }

        const deliveryFeeElement = findDeliveryFeeElement();
        if (deliveryFeeElement instanceof HTMLElement) {
            const deliveryFeeTotalElement = findDeliveryFeeElementTotalElement();
            deliveryFeeTotalElement.innerText = `$${getNumberOnly(deliveryFeeTotalElement.innerText)}`;
            setColorRecursively(deliveryFeeElement, 'initial');
        }

        const longDistanceFeeElement = findLongDistanceFeeElement();
        if (longDistanceFeeElement instanceof HTMLElement) {
            const longDistanceFeeElement = findLongDistanceFeeTotalElement();
            longDistanceFeeElement.innerText = `$${getNumberOnly(longDistanceFeeElement.innerText)}`;
            setColorRecursively(longDistanceFeeElement, 'initial');
        }

        const dasherTipElement = findDasherTipElement();
        if (dasherTipElement instanceof HTMLElement) {
            const dasherTipTotalElement = findDasherTipTotalElement();
            dasherTipTotalElement.innerText = `$${getNumberOnly(dasherTipTotalElement.innerText)}`;
            setColorRecursively(dasherTipElement, 'initial');
        }

        const totalElement = findTotalElement();
        if (totalElement instanceof HTMLElement) {
            const cartTotalElement = findCartTotalElement();
            cartTotalElement.innerText = `$${getNumberOnly(cartTotalElement.innerText)}`;
            const deliveryMarkUpWarningTestid = 'Delivery Markup Warning';
            D.querySelector(`[data-testid="${deliveryMarkUpWarningTestid}"]`)?.remove();
            const pickupMarkUpWarningTestid = 'Pickup Markup Warning';
            D.querySelector(`[data-testid="${pickupMarkUpWarningTestid}"]`)?.remove();
        }
    };

    const updateStoreInfo = () => {
        const initialBusinessDisplayAddress = getInitialBusinessDisplayAddress();
        const storeInfoElements = findStoreInfoElements();
        for (const storeInfoElement of storeInfoElements) {
            if (KNOWN_GHOST_KITCHEN_ADDRESSES.includes(initialBusinessDisplayAddress)) {
                const ghostKitchenAddressWarningElement = storeInfoElement.firstChild.cloneNode(true);
                const ghostKitchenAddressWarningElementTestid = 'Ghost Kitchen Warning';
                D.querySelector(`[data-testid="${ghostKitchenAddressWarningElementTestid}"]`)?.remove();
                ghostKitchenAddressWarningElement.innerText = 'Ghost Kitchen';
                ghostKitchenAddressWarningElement.dataset.testid = ghostKitchenAddressWarningElementTestid;
                setColorRecursively(ghostKitchenAddressWarningElement, 'red');
                const helpElement = createQuestionMarkInCircle();
                helpElement.setAttribute('target', '_blank');
                helpElement.setAttribute('href', 'https://en.wikipedia.org/wiki/Virtual_restaurant');
                helpElement.setAttribute('rel', 'noopener noreferrer');
                ghostKitchenAddressWarningElement.appendChild(helpElement);
                storeInfoElement.insertBefore(ghostKitchenAddressWarningElement, storeInfoElement.firstChild);
            }
        }
    };

    const restoreStoreInfo = () => {
        const ghostKitchenAddressWarningElementTestid = 'Ghost Kitchen Warning';
        D.querySelector(`[data-testid="${ghostKitchenAddressWarningElementTestid}"]`)?.remove();
    };

    const installCheckoutPageMagic = () => {
        const timeoutId = setTimeout(() => {
            createToastWithText('Failed to display Fees & Estimated Tax before timeout');
        }, GLOBAL_TIMEOUT);
        const observer = new MutationObserver(async (mutationsList, observer) => {
            try {
                // Iterate over all mutations
                for (let mutation of mutationsList) {
                    // Check if nodes were added to the DOM
                    if (mutation.type === 'childList') {
                        // Look for the element with the specific data-testid
                        const lineItemsElement = findLineItemsElement();
                        if (lineItemsElement instanceof HTMLElement) {
                            // disconnect the observer once the element is found
                            observer.disconnect();
                            try {
                                await updateLineItems();
                                clearTimeout(timeoutId);
                                createToastWithText('Fees & Estimated Tax rate calculated');
                            } catch (err) {
                                console.error(err);
                                restoreLineItems();
                            }

                            // Create new observer to observe changes within lineItemsElement, such as changes to tip etc.
                            const lineItemsElementObserverOptions = {
                                childList: true, // Look for added/removed child nodes
                                subtree: true, // Include all descendants in the search
                                characterData: true,
                            };

                            const lineItemsObserver = new MutationObserver(async (lineItemsMutationsList, lineItemsObserver) => {
                                // Avoid recursive calls
                                lineItemsObserver.disconnect();
                                try {
                                    await updateLineItems();
                                } catch (err) {
                                    console.error(err);
                                    restoreLineItems();
                                }
                                lineItemsObserver.observe(lineItemsElement, lineItemsElementObserverOptions);
                            });

                            lineItemsObserver.observe(lineItemsElement, lineItemsElementObserverOptions);

                            break;
                        }
                    }
                }
            } catch (err) {
                clearTimeout(timeoutId);
                createToastWithText('Failed to display Fees & Estimated Tax due to an error');
                console.error(err);
            }
        });

        // Configure the observer to look for added nodes in the entire document
        observer.observe(D.body, {
            childList: true, // Look for added/removed child nodes
            subtree: true, // Include all descendants in the search
        });

        return () => observer.disconnect();
    };

    const installStorePageMagic = async () => {
        const timeoutId = setTimeout(() => {
            createToastWithText('Failed to display additional store information before timeout');
        }, GLOBAL_TIMEOUT);
        const observerOptions = {
            childList: true, // Look for added/removed child nodes
            subtree: true, // Include all descendants in the search
        };
        const observer = new MutationObserver(async (mutationsList, observer) => {
            observer.disconnect();
            try {
                // Iterate over all mutations
                for (let mutation of mutationsList) {
                    // Check if nodes were added to the DOM
                    if (mutation.type === 'childList') {
                        // Look for the element with the specific data-testid
                        const storeInfoElements = findStoreInfoElements();
                        for (const storeInfoElement of storeInfoElements) {
                            // disconnect the observer once the element is found
                            try {
                                updateStoreInfo();
                                clearTimeout(timeoutId);
                                createToastWithText('Additional store information added');
                            } catch (err) {
                                console.error(err);
                                restoreStoreInfo();
                            }
                        }
                        break;
                    }
                }
            } catch (err) {
                clearTimeout(timeoutId);
                createToastWithText('Failed to display additional store information due to an error');
                console.error(err);
            }
           observer.observe(findMainElement(), observerOptions);
        });

        // Configure the observer to look for added nodes in the entire document
        observer.observe(findMainElement(), observerOptions);

        return () => observer.disconnect();
    };

    const main = () => {
        let currentPageMagicUninstaller = undefined;

        const installPageMagicBaseOnHref = (href = location.href) => {
            // Example: https://www.doordash.com/store/mcdonald's
            // Example: https://www.doordash.com/consumer/checkout/
            if (typeof currentPageMagicUninstaller === 'function') {
                currentPageMagicUninstaller();
            }
            try {
                const u = new URL(href, location.href);
                const pathname = u.pathname;
                if (pathname.startsWith('/store/')) {
                    // currentPageMagicUninstaller = installStorePageMagic(); // Disabled for now due to a bug found
                } else if (pathname.startsWith('/consumer/checkout/')) {
                    currentPageMagicUninstaller = installCheckoutPageMagic();
                }
            } catch (err) {
                console.error(err.toString());
            }
        };

        window.addEventListener('popstate', () => installPageMagicBaseOnHref());

        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                if (typeof argArray[2] === 'string') {
                    installPageMagicBaseOnHref(argArray[2]);
                } else {
                    installPageMagicBaseOnHref();
                }
                return target.apply(thisArg, argArray);
            },
        });

        installPageMagicBaseOnHref();
    };

    main();
})();