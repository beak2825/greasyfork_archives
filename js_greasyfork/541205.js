// ==UserScript==
// @name         Neopets Shop Report Autofill
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Detects bot accounts with specific shop banner and reports them, including profile link in report
// @author       God
// @match        *://www.neopets.com/browseshop.phtml?owner=*
// @match        *://www.neopets.com/settings/privacy/report/?offender=*
// @grant        GM_xmlhttpRequest
// @grant        window.focus
// @connect      www.neopets.com
// @connect      images.neopets.com
// @downloadURL https://update.greasyfork.org/scripts/541205/Neopets%20Shop%20Report%20Autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/541205/Neopets%20Shop%20Report%20Autofill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Banner image URL for bot accounts
    const BOT_BANNER_URL = 'https://images.neopets.com/new_shopkeepers/0.gif';
    let hasSubmitted = false; // Flag to prevent multiple submissions
    const MAX_RETRIES = 3; // Max retries for submission
    const SUBMISSION_TIMEOUT = 10000; // Timeout for submission (10s)
    const REPORT_DELAY = 5000; // Delay between reports (5s)

    // Function to observe DOM for an element (using CSS or XPath) and execute callback when found
    function observeForElement(selector, callback, targetNode = document.body, timeout = 30000, isXPath = false) {
        if (!targetNode) {
            console.warn(`Target node not found for ${selector}. Retrying...`);
            setTimeout(() => observeForElement(selector, callback, document.body, timeout, isXPath), 100);
            return;
        }

        let timeoutId;
        const observer = new MutationObserver((mutations, obs) => {
            let element;
            if (isXPath) {
                const result = document.evaluate(selector, targetNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                element = result.singleNodeValue;
            } else {
                element = targetNode.querySelector(selector);
            }
            if (element) {
                obs.disconnect();
                clearTimeout(timeoutId);
                callback(element);
            }
        });

        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });

        // Immediate check
        let element;
        if (isXPath) {
            const result = document.evaluate(selector, targetNode, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            element = result.singleNodeValue;
        } else {
            element = targetNode.querySelector(selector);
        }
        if (element) {
            observer.disconnect();
            callback(element);
            return;
        }

        // Timeout
        timeoutId = setTimeout(() => {
            observer.disconnect();
            console.error(`Timeout: Element ${selector} not found after ${timeout}ms`);
            console.log('App div content:', targetNode.querySelector('#app')?.innerHTML || 'Empty');
            console.log('All forms:', Array.from(targetNode.querySelectorAll('form')).map(form => form.outerHTML));
            console.log('Form inputs:', Array.from(targetNode.querySelectorAll('input')).map(el => ({ id: el.id, name: el.name, type: el.type, class: el.className, value: el.value })));
            console.log('Form selects:', Array.from(targetNode.querySelectorAll('select')).map(el => ({ id: el.id, name: el.name, class: el.className, value: el.value, html: el.outerHTML, options: Array.from(el.options).map(opt => ({ value: opt.value, text: opt.text })) })));
            console.log('Form textareas:', Array.from(targetNode.querySelectorAll('textarea')).map(el => ({ id: el.id, name: el.name, class: el.className, value: el.value })));
            console.log('Form buttons:', Array.from(targetNode.querySelectorAll('button')).map(el => ({ id: el.id, name: el.name, type: el.type, class: el.className })));
            const captcha = targetNode.querySelector('form[id*="captcha"], div[id*="captcha"], [class*="captcha"]');
            if (captcha) {
                console.warn('Possible CAPTCHA or anti-bot prompt detected:', captcha.outerHTML);
            }
            callback(null);
        }, timeout);
    }

    // Function to check if user is logged in
    function isLoggedIn() {
        return !!document.querySelector('a[href="/logout.phtml"]');
    }

    // Function to extract username from shop or report page
    function getUsername() {
        const url = window.location.href;
        if (url.includes('browseshop.phtml')) {
            const reportLink = document.querySelector('a[href*="/autoform_abuse.phtml?abuse=report"]');
            if (reportLink) {
                const match = reportLink.getAttribute('href').match(/offender=([^&]+)/);
                return match ? match[1] : null;
            }
            return null;
        } else if (url.includes('settings/privacy/report')) {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('offender');
        }
        return null;
    }

    // Function to log form state for debugging
    function logFormState(form, stage) {
        console.log(`Form state at ${stage}:`);
        console.log('Inputs:', Array.from(form.querySelectorAll('input')).map(el => ({ id: el.id, name: el.name, type: el.type, class: el.className, value: el.value, checked: el.checked })));
        console.log('Selects:', Array.from(form.querySelectorAll('select')).map(el => ({ id: el.id, name: el.name, class: el.className, value: el.value, options: Array.from(el.options).map(opt => ({ value: opt.value, text: opt.text })) })));
        console.log('Textareas:', Array.from(form.querySelectorAll('textarea')).map(el => ({ id: el.id, name: el.name, class: el.className, value: el.value })));
        console.log('Buttons:', Array.from(form.querySelectorAll('button')).map(el => ({ id: el.id, name: el.name, type: el.type, class: el.className })));
    }

    // Function to check for bot banner in DOM
    function checkBotBanner(callback) {
        observeForElement('div[align="center"] img[src*="new_shopkeepers"]', (img) => {
            if (!img) {
                console.log('No shop banner image found in div[align="center"]. Skipping shop.');
                callback(false);
                return;
            }
            const src = img.getAttribute('src');
            console.log(`Found shop banner: ${src}`);
            if (src === BOT_BANNER_URL) {
                console.log('Bot banner (0.gif) detected.');
                callback(true);
            } else {
                console.log(`Non-bot banner detected (${src}). Skipping shop.`);
                callback(false);
            }
        }, document.body, 15000);
    }

    // Function to generate randomized report comment with profile link
    function getReportComment(username) {
        const profileLink = `https://www.neopets.com/userlookup.phtml?user=${encodeURIComponent(username)}`;
        const comments = [
            `This is a bot account with a default shop banner and minimal shop activity, likely used for automated tasks. Profile: ${profileLink}`,
            `Suspected bot with no shop customization and low item count, possibly for dailies or betting. Profile: ${profileLink}`,
            `This account appears to be a bot shell with a default banner and small shop. Profile: ${profileLink}`
        ];
        return comments[Math.floor(Math.random() * comments.length)];
    }

    // Function to fill and submit the report form
    function fillReportForm(username, reportWindow = window, retryCount = 0) {
        if (hasSubmitted) {
            console.log(`Form already submitted for ${username}. Skipping.`);
            return;
        }
        console.log(`Filling report form for user: ${username} (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        console.log(`Report type from URL: ${new URLSearchParams(reportWindow.location.search).get('reportType') || 'None'}`);
        console.log(`Initial window location: ${reportWindow.location.href}`);

        // Capture JavaScript errors
        reportWindow.onerror = function(message, source, lineno, colno, error) {
            console.error(`Page JavaScript error: ${message} at ${source}:${lineno}:${colno}`, error);
        };

        // Try to focus the window
        try {
            reportWindow.focus();
        } catch (e) {
            console.warn('Failed to focus report window:', e.message);
        }

        // Wait for form to load in #app
        observeForElement('#app form', (form) => {
            if (!form) {
                console.error('Report form not found in #app. Retrying or manual intervention required.');
                if (retryCount < MAX_RETRIES - 1) {
                    setTimeout(() => fillReportForm(username, reportWindow, retryCount + 1), REPORT_DELAY);
                } else {
                    console.error('Max retries reached for form detection. Please fill the form manually.');
                }
                return;
            }
            console.log('Report form found:', form.outerHTML);
            logFormState(form, 'pre-fill');

            // Add submit event listener for debugging
            form.addEventListener('submit', () => {
                console.log('Form submit event triggered');
                console.log('Form data:', Array.from(new FormData(form).entries()).map(([key, value]) => ({ key, value })));
            });

            // Check no_user checkbox
            observeForElement('#no_user', (checkbox) => {
                if (!checkbox) {
                    console.error('No_user checkbox not found, trying XPath');
                    observeForElement('//input[@id="no_user" or @name="no_user"]', (xpathCheckbox) => {
                        if (!xpathCheckbox) {
                            console.error('No_user checkbox not found with XPath. Please fill the form manually.');
                            return;
                        }
                        handleCheckbox(xpathCheckbox);
                    }, reportWindow.document, 30000, true);
                    return;
                }
                handleCheckbox(checkbox);
            }, reportWindow.document, 30000);

            function handleCheckbox(checkbox) {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    console.log('Checked no_user checkbox');
                }

                // Select Other from report_type
                observeForElement('#report_type', (select) => {
                    if (!select) {
                        console.error('Report_type dropdown not found, trying XPath');
                        observeForElement('//select[@id="report_type" or @name="report_type"]', (xpathSelect) => {
                            if (!xpathSelect) {
                                console.error('Report_type dropdown not found with XPath. Please fill the form manually.');
                                return;
                            }
                            handleSelect(xpathSelect, 'report_type');
                        }, reportWindow.document, 30000, true);
                        return;
                    }
                    handleSelect(select, 'report_type');
                }, reportWindow.document, 30000);

                function handleSelect(select, type) {
                    const options = Array.from(select.options).map(opt => ({ value: opt.value, text: opt.text }));
                    console.log(`${type} options:`, options);
                    console.log(`${type} HTML:`, select.outerHTML);
                    if (select.querySelector('option[value="Other"]')) {
                        select.value = 'Other';
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(`Selected Other in ${type}`);
                    } else {
                        console.error(`Option "Other" not found in ${type}, selecting last option as fallback`);
                        select.value = options[options.length - 1].value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        console.log(`Selected fallback option: ${select.value}`);
                    }

                    // Select Other from report_place if report_type was successful
                    if (type === 'report_type') {
                        observeForElement('#report_place', (placeSelect) => {
                            if (!placeSelect) {
                                console.error('Report_place dropdown not found, trying XPath');
                                observeForElement('//select[@id="report_place" or @name="report_place"]', (xpathPlaceSelect) => {
                                    if (!xpathPlaceSelect) {
                                        console.error('Report_place dropdown not found with XPath. Please fill the form manually.');
                                        return;
                                    }
                                    handleSelect(xpathPlaceSelect, 'report_place');
                                }, reportWindow.document, 30000, true);
                                return;
                            }
                            handleSelect(placeSelect, 'report_place');
                        }, reportWindow.document, 30000);
                    }

                    // Try to fill textarea, but proceed if not found
                    if (type === 'report_place') {
                        observeForElement('#report_body', (textarea) => {
                            if (!textarea) {
                                console.error('Report_body textarea not found, trying XPath');
                                observeForElement('//textarea[@id="report_body" or @name="report_body"]', (xpathTextarea) => {
                                    if (!xpathTextarea) {
                                        console.warn('No textarea found, attempting submission without report_body');
                                        submitForm(form);
                                        return;
                                    }
                                    handleTextarea(xpathTextarea, username);
                                }, reportWindow.document, 5000, true);
                                return;
                            }
                            handleTextarea(textarea, username);
                        }, reportWindow.document, 5000);
                    }
                }

                function handleTextarea(textarea, username) {
                    const comment = getReportComment(username);
                    textarea.value = comment;
                    textarea.dispatchEvent(new Event('input', { bubbles: true }));
                    console.log('Filled report_body with comment:', comment);
                    submitForm(form);
                }

                function submitForm(form) {
                    observeForElement('#email_btn', (button) => {
                        if (!button) {
                            console.error('Submit button not found, trying XPath');
                            observeForElement('//button[@id="email_btn" or @name="email_btn" or @type="submit"]', (xpathButton) => {
                                if (!xpathButton) {
                                    console.error('Submit button not found with XPath. Please submit the form manually.');
                                    return;
                                }
                                handleSubmit(form, xpathButton);
                            }, reportWindow.document, 30000, true);
                            return;
                        }
                        handleSubmit(form, button);
                    }, reportWindow.document, 30000);
                }

                function handleSubmit(form, button, submitRetryCount = 0) {
                    if (hasSubmitted) {
                        console.log('Form already submitted. Skipping.');
                        return;
                    }
                    hasSubmitted = true;
                    console.log(`Submitting report (Attempt ${submitRetryCount + 1}/${MAX_RETRIES})`);
                    logFormState(form, 'pre-submit');

                    setTimeout(() => {
                        try {
                            button.click();
                            console.log('Submit button clicked');
                        } catch (e) {
                            console.error('Error clicking submit button:', e.message);
                        }

                        setTimeout(() => {
                            console.log(`Post-submit window location: ${reportWindow.location.href}`);
                            const successDiv = reportWindow.document.querySelector('#submitResponse_report');
                            if (successDiv && successDiv.textContent.includes('Your request has been successfully submitted!')) {
                                console.log('Report submission successful for', username);
                                logFormState(form, 'post-submit-success');
                                let reportedUsers = GM_getValue('reportedUsers', []);
                                reportedUsers.push({ username, timestamp: new Date().toISOString() });
                                GM_setValue('reportedUsers', reportedUsers);
                                console.log('Logged reported user:', username);
                                setTimeout(() => {
                                    try {
                                        reportWindow.close();
                                        console.log('Report tab closed');
                                    } catch (e) {
                                        console.warn('Failed to close report tab:', e.message);
                                        console.log('Please close the report tab manually.');
                                    }
                                }, 1000);
                            } else {
                                console.log('No success message found for', username);
                                console.log('Report page HTML after submission:', reportWindow.document.documentElement.outerHTML);
                                logFormState(form, 'post-submit-failure');
                                const errorMsg = reportWindow.document.querySelector('.error, .alert, [class*="error"], [class*="alert"]');
                                if (errorMsg) {
                                    console.error('Possible submission error detected:', errorMsg.outerHTML);
                                }
                                const captcha = reportWindow.document.querySelector('form[id*="captcha"], div[id*="captcha"], [class*="captcha"]');
                                if (captcha) {
                                    console.warn('CAPTCHA detected. Please complete it manually and resubmit.');
                                    hasSubmitted = false;
                                    return;
                                }
                                if (!reportWindow.location.href.includes('settings/privacy/report')) {
                                    console.error('Possible redirect detected after submission:', reportWindow.location.href);
                                }
                                hasSubmitted = false;
                                if (submitRetryCount < MAX_RETRIES - 1) {
                                    console.log('Retrying submission...');
                                    setTimeout(() => handleSubmit(form, button, submitRetryCount + 1), REPORT_DELAY);
                                } else {
                                    console.error('Max submission retries reached. Please submit the form manually.');
                                }
                            }
                        }, SUBMISSION_TIMEOUT);
                    }, REPORT_DELAY);
                }
            }
        }, reportWindow.document, 30000);
    }

    // Main function to handle both shop and report pages
    function main() {
        console.log('Neopets Shop Report Autofill script started at', new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }));

        // Check for conflicting scripts
        if (window._tampermonkey || window.GM_info) {
            console.warn('Multiple Tampermonkey scripts detected. This may cause conflicts.');
        }

        // Check if user is logged in
        if (!isLoggedIn()) {
            console.error('User not logged in. Please log in to Neopets.');
            return;
        }

        const url = window.location.href;
        if (url.includes('browseshop.phtml')) {
            // Shop page: check for bot banner and item conditions
            checkBotBanner((isBotBanner) => {
                if (!isBotBanner) {
                    console.log('No bot banner detected. Skipping shop.');
                    return;
                }

                // Check for item table or no-items message
                observeForElement('table[align="center"][border="0"][cellpadding="3"], span[style="color: black;"] > b', (element) => {
                    let shouldReport = false;
                    if (element.tagName.toLowerCase() === 'table') {
                        const items = element.querySelectorAll('td').length / 2; // Each item has 2 td elements
                        console.log(`Found ${items} items in shop`);
                        if (items <= 20) {
                            shouldReport = true;
                        }
                    } else if (element.textContent.includes('There are no items for sale in this shop!')) {
                        console.log('No items in shop');
                        shouldReport = true;
                    }

                    if (shouldReport) {
                        const username = getUsername();
                        if (username) {
                            console.log(`Reporting user: ${username}`);
                            const reportUrl = `https://www.neopets.com/settings/privacy/report/?offender=${encodeURIComponent(username)}&reportType=Shops`;
                            console.log(`Opening report URL in new tab: ${reportUrl}`);
                            const reportWindow = window.open(reportUrl, '_blank');
                            if (!reportWindow) {
                                console.error('Failed to open report page. Please allow pop-ups.');
                                return;
                            }
                            const checkWindowLoaded = setInterval(() => {
                                if (reportWindow.document.readyState === 'complete') {
                                    clearInterval(checkWindowLoaded);
                                    console.log(`Report page loaded for ${username}`);
                                    try {
                                        reportWindow.focus();
                                    } catch (e) {
                                        console.warn('Failed to focus report window:', e.message);
                                    }
                                    fillReportForm(username, reportWindow);
                                }
                            }, 500);
                        } else {
                            console.error('Could not extract username from report link');
                        }
                    } else {
                        console.log('Shop has more than 20 items, not reporting');
                    }
                }, document.body, 15000);
            });
        } else if (url.includes('settings/privacy/report')) {
            // Report page: directly fill the form
            const username = getUsername();
            if (username) {
                console.log(`Report type from URL: ${new URLSearchParams(window.location.search).get('reportType') || 'None'}`);
                fillReportForm(username);
            } else {
                console.error('No offender username found in URL');
            }
        }
    }

    // Start script when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();