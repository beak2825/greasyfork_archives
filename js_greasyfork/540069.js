// ==UserScript==
// @name     BestBuy-GottaCatchEmAll-Bot
// @include  https://www.bestbuy.com/*
// @version      4.5
// @description  Best Buy - Gotta Catch Em All - Bot - ImaBeRicheyyRichhh Edition
// @author       ImaBeRicheyyRichhh 
// @grant        window.close
// @license MIT

// @namespace https://greasyfork.org/users/1485915
// @downloadURL https://update.greasyfork.org/scripts/540069/BestBuy-GottaCatchEmAll-Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/540069/BestBuy-GottaCatchEmAll-Bot.meta.js
// ==/UserScript==

//rgb(197, 203, 213) pleasewait
//rgb(255, 224, 0) add to cart
//rgb(0, 70, 190) verify your account

/*
          (                            )           )
   (      )\ )  *   )     (         ( /(     (  ( /(   *   )
 ( )\ (  (()/(` )  /(   ( )\    (   )\())  ( )\ )\())` )  /(
 )((_))\  /(_))( )(_))  )((_)   )\ ((_)\   )((_|(_)\  ( )(_))
((_)_((_)(_)) (_(_())  ((_)_ _ ((_)_ ((_) ((_)_  ((_)(_(_())
 | _ ) __/ __||_   _|   | _ ) | | \ \ / /  | _ )/ _ \|_   _|
 | _ \ _|\__ \  | |     | _ \ |_| |\ V /   | _ \ (_) | | |
 |___/___|___/  |_|     |___/\___/  |_|    |___/\___/  |_|

                                                                  */
"use strict";
//________________________________________________________________________

//  CONSTANTS
// [ Do not add/remove quotation marks when updating]
//________________________________________________________________________

//____ REQUIRED FLAGS ____________________________________________________

const ITEM_KEYWORD = "Ultra"; // NO SPACES IN KEYWORD - ONLY ONE WORD
const CREDITCARD_CVV = "420"; // BOT will run without changing this value.
const TESTMODE = "Yes"; // TESTMODE = "No" will buy the card
const SMS_DIGITS = "5461"; // Enter last 4 digits of phone # for SMS verification (required for verification)
const PREFERRED_SHIPPING = "Yes"; // "Yes" will select shipping option if available

//____ PLEASE WAIT FLAGS : ADVANCED OPTIONS _____________________________

//const QUEUE_TIME_CUTOFF = 0 // (in Minutes) Keep retrying until queue time is below.
//onst NEW_QUEUE_TIME_DELAY = 5 // (in Seconds) Ask new queue time set seconds
const OOS_REFRESH = 10; // (in Seconds) Refresh rate on OOS item.

//____ LAZY FLAGS : WILL NOT AFFECT BOT PERFORMACE _____________________

const MAX_RETRIES = "500"; // Fossil of EARTH

//________________________________________________________________________

// Chime Sound
//________________________________________________________________________

// Play a chime sound to notify the user
function playChime() {
    // You can choose any online sound file.
    const chimeUrl =
        "https://github.com/ImaBeRicheyyRichhh/BestBuy-GottaCatchEmAll-Bot/raw/main/resources/alert.mp3";
    const audio = new Audio(chimeUrl);
    audio.play().catch((err) => console.error("Audio play failed:", err));
}

//________________________________________________________________________

// Queue Timer Functions
//________________________________________________________________________

function n(e, t) {
    return parseInt(e, t);
}

function r(e, t) {
    return e[t];
}

function getQueueTimeFromEncodedString(e) {
    var t = ("-", e.split("-")),
        l = t.map(function (e) {
            return n(e, 16);
        });
    return (function (e) {
        return 1e3 * e;
    })(
        (function (e, t) {
            return e / t;
        })(
            n(
                (function (e, t) {
                    return e + t;
                })(r(t, 2), r(t, 3)),
                16
            ),
            r(l, 1)
        )
    );
}

function getRecordForSku(sku) {
    const queues = JSON.parse(atob(localStorage.getItem("purchaseTracker")));
    console.log(queues);

    const skuQueue = queues[sku];
    if (!skuQueue) {
        return null;
    }
    return skuQueue;
}

function getQueueTimeStartMs(sku) {
    return getRecordForSku(sku)[0];
}

function getQueueDurationMs(sku) {
    return getQueueTimeFromEncodedString(getRecordForSku(sku)[2]);
}

var sku = location.search.split("=")[1];
console.log("found sku", sku);

// This function will be called when Please wait is detected to return queue time
let checkQueueTimeRemaining = () => {
    try {
        var startMs = getQueueTimeStartMs(sku);
        var durationMs = getQueueDurationMs(sku);
        var durationMin = Math.trunc(durationMs / 60000);
        var durationSec = Math.trunc(durationMs / 1000 - durationMin * 60);
        var remainingMs = startMs + durationMs - new Date().getTime();
        var remainingMin = Math.trunc(remainingMs / 60000);
        var remainingSec = Math.trunc(remainingMs / 1000 - remainingMin * 60);

        return [remainingMin, remainingSec];
    } catch (e) { }
};

//________________________________________________________________________

// Create Floating Status Bar
//________________________________________________________________________

function createFloatingBadge(mode, status) {
    const iconUrl = "https://github.com/ImaBeRicheyyRichhh/BestBuy-GottaCatchEmAll-Bot/blob/main/resources/gengar.png?raw=true";
    const $container = document.createElement("div");
    const $bg = document.createElement("div");
    const $link = document.createElement("a");
    const $img = document.createElement("img");
    const $text = document.createElement("P");
    const $mode = document.createElement("P");
    const $status1 = document.createElement("P");

    $link.setAttribute("href", "https://github.com/ImaBeRicheyyRichhh");
    $link.setAttribute("target", "_blank");
    $link.setAttribute("title", "RefreshNoBot");
    $img.setAttribute("src", iconUrl);
    var MAIN_TITLE =
        " GottaCatchEmAll | BestBuyBot v4.5 | ◻️TESTMODE: " +
        TESTMODE +
        "◻️ITEM KEYWORD: " +
        ITEM_KEYWORD +
        "◻️OOS REFRESH: " +
        OOS_REFRESH;
    $text.innerText = MAIN_TITLE;
    $mode.innerText = mode;
    $status1.innerText = status;

    $container.style.cssText =
        "position:fixed;left:0;bottom:0;width:850px;height:75px;background: black;";
    $bg.style.cssText =
        "position:absolute;left:-100%;top:0;width:60px;height:55px;background:#1111;box-shadow: 0px 0 10px #060303; border: 1px solid #FFF;";
    $link.style.cssText =
        "position:absolute;display:block;top:11px;left: 0px; z-index:10;width: 50px;height:50px;border-radius: 1px;overflow:hidden;";
    $img.style.cssText = "display:block;width:100%";
    $text.style.cssText =
        "position:absolute;display:block;top:3px;left: 50px;background: transperant; color: white;";
    $mode.style.cssText =
        "position:absolute;display:block;top:22px;left: 50px;background: transperant; color: white;";
    $status1.style.cssText =
        "position:absolute;display:block;top:43px;left: 50px;background: transperant; color: white;";

    $link.appendChild($img);
    $container.appendChild($bg);
    $container.appendChild($link);
    $container.appendChild($text);
    $container.appendChild($mode);
    $container.appendChild($status1);

    return $container;
}

//________________________________________________________________________

//  FUNCTIONS | Writing seperate EventHandlers so we can prevent memory leak for long running bots
//________________________________________________________________________

// Ideas developed based on : https://stackoverflow.com/questions/13677589/addeventlistener-memory-leak-due-to-frames/13702786#13702786
//________________________________________________________________________

//    CART PAGE EventHandler
//________________________________________________________________________

// Create a configuration object for button classes
const BUTTON_CLASSES = {
    outOfStock: {
        L1: "c-button c-button-disabled c-button-lg c-button-block add-to-cart-button",
        L2: "btn btn-disabled btn-lg btn-block add-to-cart-button",
        L3: "c-button c-button-disabled c-button-lg c-button-block add-to-cart-button",
    },
    inStock: {
        L1: "btn btn-primary btn-lg btn-block btn-leading-ficon add-to-cart-button",
        L2: "c-button c-button-primary c-button-lg c-button-block c-button-icon c-button-icon-leading add-to-cart-button",
        L3: "bg-comp-surface-secondary-emphasis border-comp-outline-secondary-muted",
    },
    goToCart: {
        L1: "c-button c-button-secondary btn btn-secondary btn-sm c-button-sm btn-block c-button-block",
        L2: "c-button c-button-secondary c-button-sm c-button-block",
        L3: "c-button c-button-secondary c-button-md c-button-block",
    },
    continue: {
        L1: "btn btn-secondary btn-lg btn-block c-button-icon c-button-icon-leading cia-form__controls__submit",
        L2: "c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit",
        L3: "c-button c-button-secondary c-button-md c-button-block"
    }
};

// Helper function to find button by classes
function findButton(buttonType) {
    const classes = BUTTON_CLASSES[buttonType];
    console.log(`Checking for ${buttonType} Button`);
    for (const [key, className] of Object.entries(classes)) {
        const button = document.getElementsByClassName(className);
        if (button.length > 0) {
            console.log(`${buttonType} Button Class ${key}: ${className}`);
            return button;
        }
    }
    console.log(`No ${buttonType} Button Found`);
    return null;
}


function cartpageoperationsEvenHandler(evt) {
    setTimeout(() => {
        if (location.href.includes("www.bestbuy.com/cart")) {
            // Create and display the badge
            const $badge = createFloatingBadge(
                "Cart Page 🛑 Do Not Refresh. Only one item can be carted per account.",
                "Verfying that first item in CART has KEYWORD"
            );
            document.body.appendChild($badge);
            $badge.style.transform = "translate(0, 0)";

            // Wait 3 seconds on Cart Page
            setTimeout(() => {
                const CartItemCheck = document.getElementsByClassName(
                    "cart-item__title focus-item-0"
                );
                if (
                    CartItemCheck[0] &&
                    CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)
                ) {
                    console.log("Item Has been Confirmed!");

                    // Select the shipping button universally using an attribute selector
                    const shippingButton = document.querySelector(
                        "input[id^='fulfillment-shipping-']"
                    );
                    if (shippingButton && PREFERRED_SHIPPING === "Yes") {
                        console.log(
                            "Shipping button found. Waiting 3 seconds before clicking it."
                        );
                        // Delay shipping button click by 3 seconds
                        setTimeout(() => {
                            shippingButton.click();
                            console.log(
                                "Shipping button clicked. Waiting 3 seconds before clicking checkout."
                            );

                            // Wait an additional 3 seconds after clicking shipping button
                            setTimeout(() => {
                                const CheckoutButton = document.getElementsByClassName(
                                    "btn btn-lg btn-block btn-primary"
                                );
                                if (CheckoutButton[0]) {
                                    console.log("Clicking Checkout");
                                    CheckoutButton[0].click();
                                }
                            }, 3000);
                        }, 3000);
                    } else {
                        console.log(
                            "Shipping button not found. Clicking Checkout immediately."
                        );
                        const CheckoutButton = document.getElementsByClassName(
                            "btn btn-lg btn-block btn-primary"
                        );
                        if (CheckoutButton[0]) {
                            CheckoutButton[0].click();
                        }
                    }
                }
            }, 3000);
        }
    }, 5000);
}

//________________________________________________________________________

//    VERIFICATION PAGE EventHandler
//________________________________________________________________________

function verificationpageEventHandler(evt) {
    console.log("Verification Step Reached");
    playChime();

    setTimeout(() => {
        if (location.href.indexOf("identity/signin/recoveryOptions") > -1) {
            const $badge = createFloatingBadge(
                "Get Ready To Verify 🛑 Do Not Refresh",
                "Validating and Entering SMS Digits | It will error if you haven't updated SMS_DIGITS"
            );
            document.body.appendChild($badge);
            $badge.style.transform = "translate(0, 0)";

            setTimeout(() => {
                const ContinueButton = findButton('continue');
                const smsInput = document.getElementById("smsDigits");

                if (smsInput) {
                    smsInput.focus();
                    smsInput.select();
                    if (!document.execCommand("insertText", false, SMS_DIGITS)) {
                        smsInput.value = SMS_DIGITS;
                    }
                }

                if (ContinueButton && ContinueButton.length === 1) {
                    ContinueButton[0].click();
                }
            }, 2500);
        }
    }, 3000);
}

//________________________________________________________________________

//  SECOND ADD TO CART EventHandler
//________________________________________________________________________

function pleasewaitcompletedEventHandler(evt) {
    setTimeout(() => {
        const GotoCartButton = findButton('goToCart');
        if (!GotoCartButton) {
            console.log("Go to Cart Button not found");
            return;
        }

        // Find and click the button that links to the cart page
        for (let i = 0; i < GotoCartButton.length; i++) {
            if (GotoCartButton[i].href === "https://www.bestbuy.com/cart" ||
                GotoCartButton[i].href === "/cart") {
                GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                GotoCartButton[i].addEventListener('click', cartpageoperationsEvenHandler, false);
                GotoCartButton[i].click();
                break;
            }
        }
    }, 4000);
}

//________________________________________________________________________

//  ITEM IN STOCK EventHandler
//________________________________________________________________________

function instockEventHandler(evt) {
    setTimeout(() => {
        const InStockButton = findButton('inStock');
        if (!InStockButton) {
            console.log("In Stock Button not found");
            return;
        }

        let MainButtonColor = window.getComputedStyle(InStockButton[0]).backgroundColor;
        console.log("Confirming Button Color : " + MainButtonColor);

        if (MainButtonColor === "rgb(197, 203, 213)") {
            console.log("Button Color Gray. Is it still Adding ?");

            setTimeout(() => {
                const REALLY_PLEASE_WAIT = window.getComputedStyle(InStockButton[0]).backgroundColor;

                if (REALLY_PLEASE_WAIT === "rgb(197, 203, 213)") {
                    console.log("Its really Please Wait.");

                    const MODE = "Do not Refresh 🛑 For new queue time open this link in new firefox container tab";
                    let RETRY_QUEUE_COUNT = 0;
                    let QUEUE_TRY_COUNT = 0;

                    setInterval(() => {
                        const [remainingMin, remainingSec] = checkQueueTimeRemaining();
                        const queueBadge = "Queue Time : " + remainingMin + "m : " + remainingSec + "s";
                        const $badge = createFloatingBadge(MODE, queueBadge);
                        document.body.appendChild($badge);
                        $badge.style.transform = "translate(0, 0)";

                        setTimeout(() => {
                            const PleaseWait = findButton('inStock');
                            if (!PleaseWait) return;

                            let currentButtonColor = window.getComputedStyle(PleaseWait[0]).backgroundColor;
                            console.log("Please Wait Button Detected :" + currentButtonColor + " | Lets keep trying ..");

                            if (currentButtonColor === "rgb(255, 224, 0)" || currentButtonColor === "rgb(0, 70, 190)") {
                                console.log("Add to Cart is available:" + currentButtonColor + " | Lets Bag This ! ");

                                const ATCYellowButton = findButton('inStock');
                                if (ATCYellowButton) {
                                    ATCYellowButton[0].onclick = pleasewaitcompletedEventHandler;
                                    ATCYellowButton[0].addEventListener('click', pleasewaitcompletedEventHandler, false);
                                    ATCYellowButton[0].click();
                                }
                            }
                        }, 20000);
                    }, 5000);
                }
            }, 3000);
        } else {
            setTimeout(() => {
                console.log("Level 1 | Blue Cart Button Appears");
                const GotoCartButton = findButton('goToCart');

                if (GotoCartButton) {
                    for (let i = 0; i < GotoCartButton.length; i++) {
                        if (GotoCartButton[i].href === "https://www.bestbuy.com/cart" ||
                            GotoCartButton[i].href === "/cart") {
                            GotoCartButton[i].onclick = cartpageoperationsEvenHandler;
                            GotoCartButton[i].addEventListener('click', cartpageoperationsEvenHandler, false);
                            GotoCartButton[i].click();
                            break;
                        }
                    }
                }
            }, 3000);
        }
    }, 2000);
}
//________________________________________________________________________

//  Main Code
//________________________________________________________________________

function contains(a, b) {
    let counter = 0;
    for (var i = 0; i < b.length; i++) {
        if (a.includes(b[i])) counter++;
    }
    if (counter === b.length) return true;
    return false;
}

// Get Page Title
var pagetitle = String(document.title);

if (location.href.includes("www.bestbuy.com/cart")) {
    cartpageoperationsEvenHandler();
}

// Refresh page if Sign In page is encountered to recheck for Verification Page
if (pagetitle.includes("Sign In to Best Buy")) {
    setInterval(function () {
        console.log("Waiting for Sign in");
        var Recovery_pagetitle = String(document.title);
        if (Recovery_pagetitle.includes("Recovery")) {
            verificationpageEventHandler();
        }
    }, 1000);
}

// Check for Verification Page
if (pagetitle.includes("Recovery")) {
    verificationpageEventHandler();
}

if (pagetitle.includes(ITEM_KEYWORD)) {
    const $badge = createFloatingBadge("Auto Detecting Mode", "Initializing ..");
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)";

    // Replace the old OOS button detection with:
    const OOSButton = findButton("outOfStock");
    console.log(OOSButton);

    if (OOSButton != null) {
        const $badge = createFloatingBadge(
            "No Stock Found | Note: Run bot only during a drop ",
            "Working on refreshing, make sure you have pop-ups enabled"
        );
        document.body.appendChild($badge);
        $badge.style.transform = "translate(0, 0)";

        console.log("Out of Stock Button is Found: Just Refreshing !");

        // setTimeout(function () {
        //     window.open(window.location.href, "_blank");
        //     window.close();
        // }, OOS_REFRESH * 1000);
    } else {
        console.log("Out of Stock Button Not Found: Lets Check for ATC Button");

        // Replace the old InStock button detection with:
        const InStockButton = findButton("inStock");

        if (InStockButton) {
            console.log("Add to Cart Found");
            let ATC_Color = window.getComputedStyle(InStockButton[0]).backgroundColor;

            if (ATC_Color === "rgb(197, 203, 213)") {
                console.log(
                    "ATC is grey ! You have already pressed please wait for this item. Lets wait until we can bag this."
                );
                instockEventHandler();
            } else {
                setTimeout(function () {
                    console.log("ATC button is yellow ! Pressing it ! ");
                    InStockButton[0].onclick = instockEventHandler;
                    InStockButton[0].addEventListener(
                        "click",
                        instockEventHandler,
                        false
                    );
                    InStockButton[0].click(instockEventHandler);
                }, 2000);
            }
        }
    }
}

// CART PAGE OPERATIONS
else if (
    location.href.includes("www.bestbuy.com/checkout/r/fast-track") ||
    location.href.includes("www.bestbuy.com/checkout/c/fast-track")
) {
    //Create Custom Badge
    //
    const $badge = createFloatingBadge(
        "Final CheckPoint",
        "Verifying and Submitting"
    );
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)";
    //
    //
    setTimeout(function () {
        //We will verify that the item in final checkout screen matches the Keyword so we don't have any issues when running multiple scripts for multiple keyword.
        //In that case the Place Order button is clicked.
        //
        var CartItemCheck = document.getElementsByClassName(
            "d-flex items-start flex-column gap-100"
        );
        //console.log(CartItemCheck[0])
        //
        //
        if (CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)) {
            //
            console.log("Item Has been Confirmed !");
            //console.log('Click Place Order')

            //
            //document.getElementById("blah").src = "http://......"
            // CVV Number of Saved Card
            // Bug fix: by craz3drunner (discord member)

            // CVV Field ID Layers
            var CVV_ID;
            const CVV_ID_L1 = "cvv";
            const CVV_ID_L2 = "credit-card-cvv";

            if (document.getElementById(CVV_ID_L1) != null) {
                CVV_ID = CVV_ID_L1;
                console.log("CVV ID 1 : " + CVV_ID_L1);
            } else if (document.getElementById(CVV_ID_L2) != null) {
                CVV_ID = CVV_ID_L2;
                console.log("CVV ID 2 :" + CVV_ID_L2);
            }
            if (document.getElementById(CVV_ID) != null) {
                document.getElementById(CVV_ID).focus();
                document.getElementById(CVV_ID).select();
                if (!document.execCommand("insertText", false, CREDITCARD_CVV)) {
                    document.getElementById(CVV_ID).value = CREDITCARD_CVV;
                    console.log("CVV Entered");
                }
            }

            if (document.getElementById("text-updates") != null) {
                //
                var TextUpdates = document.getElementById("text-updates").click();
                console.log("Text Updates checked");
            }
            if (document.getElementById("smsOptIn") != null) {
                //
                var SMSUpdates = document.getElementById("smsOptIn").click();
                console.log("SMS Updates checked");
            }
            if (TESTMODE === "No") {
                //Is test mode is OFF go press place order button
                //
                console.log("Placing order ...");
                document
                    .getElementsByClassName(
                        "c-button-unstyled rounded-lg border-comp-outline-secondary h-600 bg-comp-surface-secondary-emphasis px-400"
                    )[0]
                    .click();
                //
            } else {
                console.log("Test Mode is ON.  Ready to Place Order Manually");
            }
            //
            //
        }
    }, 3000); //Three seconds will elapse and Code will execute.
}
// SIGN IN OPERATIONS
else if (location.href.includes("www.bestbuy.com/identity/signin")) {
    const $badge = createFloatingBadge(
        "Sign-In Page Detected | Please have your credentials saved ",
        "Clicking Sign-In in 5 Seconds"
    );
    document.body.appendChild($badge);
    $badge.style.transform = "translate(0, 0)";

    setTimeout(function () {
        var signInButton = document.getElementsByClassName(
            "c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit"
        )[0];
        signInButton.click();

        //
        //
    }, 5000);
}


class QueueMonitor {
    constructor() {
        this.lastCheck = 0;
        this.checkInterval = 5000; // 5 seconds
    }

    checkQueueTime() {
        const now = Date.now();
        if (now - this.lastCheck < this.checkInterval) {
            return null;
        }

        try {
            const startMs = getQueueTimeStartMs(sku);
            const durationMs = getQueueDurationMs(sku);
            const remainingMs = startMs + durationMs - now;

            return {
                minutes: Math.trunc(remainingMs / 60000),
                seconds: Math.trunc((remainingMs / 1000) % 60),
            };
        } catch (e) {
            console.error("Queue time check failed:", e);
            return null;
        } finally {
            this.lastCheck = now;
        }
    }
}

class EventManager {
    constructor() {
        this.handlers = new Map();
    }

    addHandler(element, eventType, handler) {
        if (!element) return;

        // Remove existing handler if present
        this.removeHandler(element, eventType);

        // Add new handler
        element.addEventListener(eventType, handler);
        this.handlers.set(`${element.id}-${eventType}`, {
            element,
            eventType,
            handler,
        });
    }

    removeHandler(element, eventType) {
        const key = `${element.id}-${eventType}`;
        const existing = this.handlers.get(key);
        if (existing) {
            existing.element.removeEventListener(
                existing.eventType,
                existing.handler
            );
            this.handlers.delete(key);
        }
    }

    clearAll() {
        this.handlers.forEach(({ element, eventType, handler }) => {
            element.removeEventListener(eventType, handler);
        });
        this.handlers.clear();
    }
}

class RateLimiter {
    constructor(maxRequests = 10, timeWindow = 1000) {
        this.requests = [];
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
    }

    canMakeRequest() {
        const now = Date.now();
        // Remove old requests
        this.requests = this.requests.filter(
            (time) => now - time < this.timeWindow
        );

        if (this.requests.length < this.maxRequests) {
            this.requests.push(now);
            return true;
        }
        return false;
    }

    async waitForAvailability() {
        while (!this.canMakeRequest()) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }
}

class ErrorHandler {
    constructor(maxRetries = 3) {
        this.maxRetries = maxRetries;
        this.retryDelays = [1000, 2000, 5000]; // Progressive delays
    }

    async withRetry(operation, context) {
        let lastError;

        for (let i = 0; i < this.maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                console.error(`Attempt ${i + 1} failed:`, error);

                if (i < this.maxRetries - 1) {
                    await new Promise((resolve) =>
                        setTimeout(
                            resolve,
                            this.retryDelays[i] ||
                            this.retryDelays[this.retryDelays.length - 1]
                        )
                    );
                }
            }
        }

        throw new Error(
            `Operation failed after ${this.maxRetries} attempts. Last error: ${lastError}`
        );
    }
}

// Initialize utility classes
const eventManager = new EventManager();
const rateLimiter = new RateLimiter(5, 1000); // 5 requests per second
const errorHandler = new ErrorHandler(3);
const queueMonitor = new QueueMonitor();

// Modify the cart page operations to use the new utilities
async function cartPageOperations() {
    return errorHandler.withRetry(async () => {
        await rateLimiter.waitForAvailability();

        const CartItemCheck = document.getElementsByClassName(
            "cart-item__title focus-item-0"
        );
        if (CartItemCheck[0] && CartItemCheck[0].innerHTML.includes(ITEM_KEYWORD)) {
            console.log("Item Has been Confirmed!");

            // Handle CVV input with error handling
            await handleCVVInput();

            // Handle updates checkboxes
            handleUpdatesCheckboxes();

            // Place order if not in test mode
            if (TESTMODE === "No") {
                const placeOrderButton = document.getElementsByClassName(
                    "c-button-unstyled rounded-lg border-comp-outline-secondary h-600 bg-comp-surface-secondary-emphasis px-400"
                )[0];
                if (placeOrderButton) {
                    await rateLimiter.waitForAvailability();
                    placeOrderButton.click();
                }
            } else {
                console.log("Test Mode is ON. Ready to Place Order Manually");
            }
        }
    });
}

// Helper function for CVV input
async function handleCVVInput() {
    // Find the CVV input using the specific class and id
    const cvvField = document.querySelector('.tb-input.v-large.payment-input--cvv#cvv');

    if (cvvField) {
        await rateLimiter.waitForAvailability();

        // Focus and select the field
        cvvField.focus();
        cvvField.select();

        // Try to set the value using different methods
        try {
            // Method 1: Try execCommand
            if (!document.execCommand('insertText', false, CREDITCARD_CVV)) {
                // Method 2: Direct value assignment
                cvvField.value = CREDITCARD_CVV;

                // Method 3: Trigger input event to ensure value is registered
                cvvField.dispatchEvent(new Event('input', { bubbles: true }));
            }

            console.log('CVV Entered Successfully');
        } catch (error) {
            console.error('Failed to enter CVV:', error);
        }
    } else {
        console.log('CVV field not found');
    }
}

// Helper function for updates checkboxes
function handleUpdatesCheckboxes() {
    const checkboxes = {
        "text-updates": "Text Updates",
        smsOptIn: "SMS Updates",
    };

    Object.entries(checkboxes).forEach(([id, label]) => {
        const checkbox = document.getElementById(id);
        if (checkbox) {
            checkbox.click();
            console.log(`${label} checked`);
        }
    });
}

// Modify sign-in operations to use the new utilities
async function signInOperations() {
    return errorHandler.withRetry(async () => {
        await rateLimiter.waitForAvailability();

        const signInButton = document.getElementsByClassName(
            "c-button c-button-secondary c-button-lg c-button-block c-button-icon c-button-icon-leading cia-form__controls__submit"
        )[0];
        if (signInButton) {
            // Use EventManager for click handling
            eventManager.addHandler(signInButton, "click", () => {
                console.log("Sign in button clicked");
            });
            signInButton.click();
        }
    });
}

// Queue monitoring integration
function monitorQueue() {
    setInterval(() => {
        const queueTime = queueMonitor.checkQueueTime();
        if (queueTime) {
            const queueBadge = `Queue Time: ${queueTime.minutes}m : ${queueTime.seconds}s`;
            const $badge = createFloatingBadge("Queue Status", queueBadge);
            document.body.appendChild($badge);
            $badge.style.transform = "translate(0, 0)";
        }
    }, 5000);
}

// Modify the main execution flow
if (
    location.href.includes("www.bestbuy.com/checkout/r/fast-track") ||
    location.href.includes("www.bestbuy.com/checkout/c/fast-track")
) {
    cartPageOperations().catch(console.error);
} else if (location.href.includes("www.bestbuy.com/identity/signin")) {
    signInOperations().catch(console.error);
}

// Clean up event listeners when needed
window.addEventListener("beforeunload", () => {
    eventManager.clearAll();
});