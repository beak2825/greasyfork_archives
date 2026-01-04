// ==UserScript==
// @name         New Team Auto-Fill
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically fills all inputs when creating a new team
// @author       https://github.com/cgriebel
// @match        *://*.corpayone.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atlassian.net
// @grant        unsafeWindow
// @sandbox      DOM
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/480073/New%20Team%20Auto-Fill.user.js
// @updateURL https://update.greasyfork.org/scripts/480073/New%20Team%20Auto-Fill.meta.js
// ==/UserScript==
/* global $ */

(function () {
    'use strict';
    if (window.self !== window.top) {
        return;
    }

    let initializedStep;

    const observeUrlChange = () => {
        let oldHref = document.location.href;
        const body = document.querySelector("body");
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                window.dispatchEvent(new Event('popstate'));
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    };

    window.onload = observeUrlChange;
    window.jQuery = $;

    const hosts = {
        cp1: {
            web: [
                "localhost:3000",
                "staging-web.corpayone.com",
                /pr-[0-9]+.playgrounds.corpayone.com/
            ]
        }
    }

    function init() {
        signup.init();
    }

    const shared = (() => {
        return {
            isHost(expected) {
                if (typeof expected === "string") {
                    expected = [expected];
                }
                const current = window.location.host;
                return expected.some(h => typeof h === 'string' ? h === current : h.test(current));
            },
            isPath: (path, host) => {
                return window.location.pathname === path && shared.isHost(host)
            },
            setInputValue(selector, value) {
                const input = document.querySelector(selector)
                if (!input) return;
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                nativeInputValueSetter.call(input, value);

                var event = new Event('input', { bubbles: true });
                input.dispatchEvent(event);
            },
            setSelectValue(selector, value) {
                shared.setInputValue(selector, value)
                const option = document.querySelector('[id^="react-select-2-option"]') || document.querySelector('[id^="react-select"][id*="-option-"]');
                if (!option) return;
                var event = new Event('click', { bubbles: true });
                option.dispatchEvent(event);
            },
            clickRadioButton(selector) {
                const element = document.querySelector(selector);
                const reactClick = window.HTMLDivElement.prototype.click;
                reactClick.call(element.parentElement);
            },
            clickElement(selector, clickFn) {
                const element = document.querySelector(selector);
                const reactClick = clickFn || window.HTMLDivElement.prototype.click;
                reactClick.call(element);
            }
        }
    })()

    const signup = (() => {
        const isSignup = () => shared.isPath("/signup", hosts.cp1.web)

        function init() {
            if (isSignup()) {
                fillSignupForm();
            }

            setInterval(() => {
                if (!isSignup()) {
                    initializedStep = undefined;
                    return;
                }

                fillSignupForm()
            }, 200)
        }

        function fillSignupForm() {
            const values = [
                ['input', '#name', 'Test Team'],
                ['select', '#industry', 'Professional, scientific, and technical services'],
                ['input', '#address', '440 Bryant Drive'],
                ['input', '#city', 'Pittsburgh'],
                ['input', '#postalCode', '15235'],
                ['input', '#einNumber', '123456789'],
                ['select', '#state', 'Pennsylvania'],
                ['select', '#preferredAccountingSystem', 'QuickBooks Online'],
                ['select', '#projectedAnnualRevenue', '< $500K'],
                ['select', '#projectedMontlyExpenses', '< $25K'],
                ['select', '#monthlyCreditCardExpenses', '< $10K'],
                ['select', '#employeeCount', '< 10'],
                ['input', '#phone-input', '8005551111'],
                ['input', '#first', '1'],
                ['input', '#second', '1'],
                ['input', '#third', '1'],
                ['input', '#fourth', '1'],
                ['select', '#bookkeepingClientCount', '1 - 10'],
                ['select', '#billpayClientCount', '1 - 10'],
                ['radio', '#text'],
                ['radio', '[class^=FormikAccountType] [class^=Radio__RadioInput]'],
                ['select-element', '[data-cy=Product-Experience-0]'],
            ]

            const targets = values
                .map(([type, selector, value]) => ({ selector, value, type, element: $(selector) }))
                .filter(({ element }) => element.length);

            const currentStep = $('[class^="ProgressBar__StyledFill"]').attr('width')
            if (
                (!initializedStep || initializedStep < currentStep) &&
                targets.length
                && !targets.some((config) => {
                    const { element, type, value } = config;
                    return type === 'radio' ? element.prop('checked')
                        : type === 'select-element' ? getComputedStyle(element[0])["outline-color"] !== 'rgb(0, 0, 0)'
                            : element.val()
                })
            ) {
                initializedStep = currentStep;
                targets.forEach(({ selector, value, type }) => {
                    switch (type) {
                        case 'input':
                            shared.setInputValue(selector, value);
                            break;
                        case 'select':
                            shared.setSelectValue(selector, value);
                            break;
                        case 'radio':
                            shared.clickRadioButton(selector);
                            break;
                        case 'select-element':
                            shared.clickElement(selector);
                            break;
                    }
                })
            }
        }

        return {
            init
        }
    })()

    init();
})();