// ==UserScript==
// @name         Shopee.PH login on visit
// @namespace    https://www.codegrepper.com/profile/andro-marces
// @version      1.2
// @description  Open the login page on visit and login if fields are filled
// @author       https://www.codegrepper.com/profile/andro-marces
// @include        http*://shopee.ph
// @include        http*://shopee.ph/*
// @icon         https://www.google.com/s2/favicons?domain=shopee.ph
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435175/ShopeePH%20login%20on%20visit.user.js
// @updateURL https://update.greasyfork.org/scripts/435175/ShopeePH%20login%20on%20visit.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("start");
    let a;
    let j = 0;
    let k;
    let inputs;
    let buttons;
    let observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (!mutation.addedNodes) {
                j++;
                return;
            }

            for (let i = 0; i < mutation.addedNodes.length; i++) {
                // console.log(mutation.addedNodes[i].textContent);

                /* look for the login or sign up and click the login tag to get to the login page */
                if (/(?=.*Sign Up)(?=.*Login)/.test(mutation.addedNodes[i].textContent)) {
                    console.log("found login page link");
                    a = mutation.addedNodes[i].querySelectorAll("a");
                    console.log(j);
                    k = (j + 2);
                }
                if (a && j == k) {
                    console.log(j);
                    setTimeout(() => {
                        for (let i = 0, length = a.length; i < length; i++) {
                            if (a[i].textContent == "Login") {
                                a[i].click();
                            }
                        }
                    }, 1000);
                }

                /* check input fields if filled and click "LOG IN" button to log in */
                if (mutation.addedNodes[i].textContent.includes("Forgot Password")) {
                    inputs = mutation.addedNodes[i].querySelectorAll("input");
                    buttons = mutation.addedNodes[i].querySelectorAll("button");
                }
                if (mutation.addedNodes[i].textContent.includes("Please enter this field.")) {
                    observer.disconnect();
                    let loginButton;
                    for (let i = 0, length = buttons.length; i < length; i++) {
                        console.log("found login form");
                        if (buttons[i].innerText == "LOG IN") {
                            loginButton = buttons[i];
                            loginButton.disabled = false;
                            break;
                        }
                    }
                    setTimeout(function () {
                        for (let i = 0, length = inputs.length; i < length; i++) {
                            if (inputs[i].value) {
                                if (checkInputs(inputs, loginButton)) {
                                    break;
                                }
                            }
                        }
                    }, 1000);

                    function checkInputs(inputs, loginButton) {
                        let empty;
                        for (let i = 0, length = inputs.length; i < length; i++) {
                            if (!inputs[i].value) {
                                empty = true;
                                break;
                            }
                        }
                        if (!empty) {
                            console.log("fields filled");
                            loginButton.click();
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            }
            j++;
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();