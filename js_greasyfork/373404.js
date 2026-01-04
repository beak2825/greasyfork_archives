// ==UserScript==
// @name          Text Highlighter - BrandsEye
// @namespace     elorias
// @author        Daniel Gonzalez
// @version       2.4
// @description   Highlights User-defined Text
// @include       https://rating.brandseye.com/*
// @require       https://cdnjs.cloudflare.com/ajax/libs/mark.js/8.11.1/mark.min.js
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373404/Text%20Highlighter%20-%20BrandsEye.user.js
// @updateURL https://update.greasyfork.org/scripts/373404/Text%20Highlighter%20-%20BrandsEye.meta.js
// ==/UserScript==


(function () { // anonymous function wrapper, used for error checking & limiting scope
    'use strict';

    // Add all words!

    // Customer acquisition and retention:
    var Customer_journey = ["Customer journey", "cancelled", "left", "switching to", "moving to", "changing", "renew", "i love *"]
    var Deciding_whether_to_sign_up_or_purchase = ["", "open an account", "buy", "stock up", "interested"]
    var Thinking_about_cancelling_or_decided_to_cancel = ["", "cancel", "cancelling", "leaving", "leave"]
    var Happy_about_choice_to_leave = [""]
    var Regrets_leaving_or_desires_to_return = ["", "return to"]

    function customerjourney() {
        GM_addStyle("Customer_journeyRS { color: white; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Customer_journey, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Customer_journeyRS",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark(["Customer acquisition and retention","Customer journey"], {
            element: "Customer_journeyRS",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Deciding_whether_to_sign_up_or_purchase { color: #3DFF33; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Deciding_whether_to_sign_up_or_purchase, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Deciding_whether_to_sign_up_or_purchase",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Deciding whether to sign up or purchase", {
            element: "Deciding_whether_to_sign_up_or_purchase",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Thinking_about_cancelling_or_decided_to_cancel { color: #db0000; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Thinking_about_cancelling_or_decided_to_cancel, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Thinking_about_cancelling_or_decided_to_cancel",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Thinking about cancelling or decided to cancel", {
            element: "Thinking_about_cancelling_or_decided_to_cancel",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Happy_about_choice_to_leave { color: #a0ffff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Happy_about_choice_to_leave, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Happy_about_choice_to_leave",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Happy about choice to leave", {
            element: "Happy_about_choice_to_leave",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Regrets_leaving_or_desires_to_return { color: #ff6; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Regrets_leaving_or_desires_to_return, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Regrets_leaving_or_desires_to_return",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Regrets leaving or desires to return", {
            element: "Regrets_leaving_or_desires_to_return",
            "separateWordSearch": false,
            "diacritics": false
        })

    }

    // Customer service:
    var Customer_service = ["reply", "wait", "wait*", "service", "assist", "dm", "request", "complaint", "help", "help*", "reach out", "feedback", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Advice_given_by_a_brand_representative = ["representative advi*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Billing_or_payments = ["", "charge", "overcharge*", "paid", "pay", "charge*", "bill*", "deduct*", "vat", "paying out", "billing", "payment", "payments", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Email_support = ["email", "emails to", "e-mail*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Frozen_blocked_or_suspended = ["frozen", "blocked", "suspend*", "locked out", "deactivated", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Language_of_choice = ["language", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Live_chat_support = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var No_response_received = ["", "respond", "*t heard from", "*t hear from", "No response"]
    var Operating_hours = ["24/7", "close*", "open*", "owerri", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Placed_on_hold = ["on hold", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Queuing = ["queus", "qs", "queu*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Referred_to_wrong_department_person = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Refunds_returns_or_exchanges = ["reimbursed", "refund*", "credited back", "revert", "exchanges", "compensation", "reverse", "reinburse", "return", "returned", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Telephonic_interactions_or_attempts = ["", "call", "rang", "call*", "call center", "phone", "phoned", "telephone", "telephones", "contact cent*", "phoning"]
    var Turn_around_time = ["time", "fast", "quick", "delay", "day ago", "days ago", "weeks ago", "months ago", "been * days", "been * weeks", "been * months", "min", "minutes", "hrs", "hours", "day", "days", "week", "weeks", "month", "months", "for long", "reply time", "slow", "efficient", "*hours", "quickly", "keep wait*", "still wait*", "delay", "delay*", "asap", "haven* revieved", "instantly", "inefficiency"]
    var Unable_to_fulfill_request = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Upgrades_or_downgrades = ["upgrade", "downgrade", "down grade", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var After_sales_service = ["after sales service"]

    function Customerservice() {
        GM_addStyle("After_sales_service { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(After_sales_service, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "After_sales_service",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("After-sales service", {
            element: "After_sales_service",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Customer_service { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Customer_service, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Customer_service",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Customer service", {
            element: "Customer_service",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Advice_given_by_a_brand_representative { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Advice_given_by_a_brand_representative, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Advice_given_by_a_brand_representative",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Advice given by a brand representative", {
            element: "Advice_given_by_a_brand_representative",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Billing_or_payments { color: #0DD5FC; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Billing_or_payments, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Billing_or_payments",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Billing or payments", {
            element: "Billing_or_payments",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Email_support { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Email_support, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Email_support",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Email support", {
            element: "Email_support",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Frozen_blocked_or_suspended { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Frozen_blocked_or_suspended, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Frozen_blocked_or_suspended",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Frozen, blocked or suspended", {
            element: "Frozen_blocked_or_suspended",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Language_of_choice { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Language_of_choice, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Language_of_choice",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Language of choice", {
            element: "Language_of_choice",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Live_chat_support { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Live_chat_support, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Live_chat_support",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Live chat support", {
            element: "Live_chat_support",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("No_response_received { color: #ff6; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(No_response_received, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "No_response_received",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("No response received", {
            element: "No_response_received",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Operating_hours { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Operating_hours, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Operating_hours",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Operating hours", {
            element: "Operating_hours",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Placed_on_hold { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Placed_on_hold, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Placed_on_hold",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Placed on hold", {
            element: "Placed_on_hold",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Queuing { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Queuing, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Queuing",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Queuing", {
            element: "Queuing",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Referred_to_wrong_department_person { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Referred_to_wrong_department_person, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Referred_to_wrong_department_person",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Referred to wrong department / person", {
            element: "Referred_to_wrong_department_person",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Refunds_returns_or_exchanges { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Refunds_returns_or_exchanges, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Refunds_returns_or_exchanges",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Refunds, returns or exchanges", {
            element: "Refunds_returns_or_exchanges",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Telephonic_interactions_or_attempts { color: #ff0000; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Telephonic_interactions_or_attempts, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Telephonic_interactions_or_attempts",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Telephonic interactions or attempts", {
            element: "Telephonic_interactions_or_attempts",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Turn_around_time { color: #3DFF33; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Turn_around_time, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Turn_around_time",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Turn around time", {
            element: "Turn_around_time",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Unable_to_fulfill_request { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Unable_to_fulfill_request, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Unable_to_fulfill_request",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Unable to fulfill request", {
            element: "Unable_to_fulfill_request",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Upgrades_or_downgrades { color: #fff; background-color: #4a4a4a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Upgrades_or_downgrades, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Upgrades_or_downgrades",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Upgrades or downgrades", {
            element: "Upgrades_or_downgrades",
            "separateWordSearch": false,
            "diacritics": false
        })

    }

    // Ethics or reputation:
    var Ethics_or_reputation = ["haccp", "sue", "spineless", "protection", "privacy", "abusing", "scum", "crooks", "this is a misleading", "misleading", "gimic", "gimmick", "respect", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Accusations_of_unethical_behavior = ["lie", "cheated", "assault", "lying", "ripoff", "lyer"]
    var Animal_rights = ["honey badger", "fur", "leather", "cruelty free", "", "", "", "", "", "", "", "", ""]
    var Business_or_technological_innovation = ["innovat*", "sophisticated", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Charity_or_outreach_programmes = ["donat*", "collaboration", "rmhc sa", "need for help", "rmhc s.a", "rmhc", "?VaxTheNation", "social responsability", "charit*", "", "", "", ""]
    var Company_financial_performance = ["profit*", "netprofit*", "invest", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Comparing_brands_to_brands = ["best", "worst", "better", "worse", "cheaper than", "more expensive", "*t beat", "are the same", "not * different", "unlike", "biggest", "", ""]
    var Handling_of_personal_information = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Discrimination_or_equality = ["black", "white", "black people", "white people", "mud people", "equality", "apartheid", "discrimina*", "negro", "nigga", "nigger", "black tax", "blf", "black land fit", "biased", "", "", "", "", "", "", "", "", "", ""]
    var Environmental_impact = ["recycl*", "envirome*", "plastic", "pollution", "eco friend*", "eco*friend*", "go green", "green life", "paper waste", "water waste", "renewable energy", "renewable", "sustainability", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Fraud_corruption_or_scams_monetary = ["fraud", "corruption", "steal", "steal*", "scam", "scam*", "thieves", "thives", "fraudulent", "unathorized", "scum", "hoax", "heist", "defrauded"]
    var Protests_or_boycotts = ["strike", "protest*", "boycott*", "looted", "bomb", "march", "* boycott", "* strike", "disrrupt", "disrupt", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Reaction_to_advertising = ["ad", "advert", "advert*", "ab", "", "", "", "", "", "", "", "", ""]
    var Referral_or_dissuasion = ["spread the word", "recommend", "recommend*", "rt to", "plugging", "discourage", "", "", "", "", "", "", ""]
    var Spam_or_unsolicited_contact = ["spam", "harrasing", "harrasment", "unwanted", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Valuing_loyal_customers = ["loyal customer", "loyalty", "faithful customer", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    function EthicsOrReputation() {
        GM_addStyle("Ethics_or_reputation { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Ethics_or_reputation, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Ethics_or_reputation",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Ethics or reputation", {
            element: "Ethics_or_reputation",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Accusations_of_unethical_behavior { color: #a0ffff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Accusations_of_unethical_behavior, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Accusations_of_unethical_behavior",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Accusations of unethical behavior", {
            element: "Accusations_of_unethical_behavior",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Animal_rights { color: #141414; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Animal_rights, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Animal_rights",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Animal rights", {
            element: "Animal_rights",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Business_or_technological_innovation { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Business_or_technological_innovation, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Business_or_technological_innovation",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Business or technological innovation", {
            element: "Business_or_technological_innovation",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Charity_or_outreach_programmes { color: #0000b7; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Charity_or_outreach_programmes, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Charity_or_outreach_programmes",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Charity or outreach programmes (CSI", {
            element: "Charity_or_outreach_programmes",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Company_financial_performance { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Company_financial_performance, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Charity_or_outreach_programmes",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Company financial performance", {
            element: "Company_financial_performance",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Comparing_brands_to_brands { color: #FF9933; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Comparing_brands_to_brands, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Comparing_brands_to_brands",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Comparing brands to brands/industries", {
            element: "Comparing_brands_to_brands",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Handling_of_personal_information { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Handling_of_personal_information, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Handling_of_personal_information",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark(["Handling of personal information", "Digital safety or security"], {
            element: "Handling_of_personal_information",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Discrimination_or_equality { color: #ffff00; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Discrimination_or_equality, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Discrimination_or_equality",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Discrimination or equality", {
            element: "Discrimination_or_equality",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Environmental_impact { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Environmental_impact, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Environmental_impact",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Environmental impact", {
            element: "Environmental_impact",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Fraud_corruption_or_scams_monetary { color: #ff0000; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Fraud_corruption_or_scams_monetary, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Fraud_corruption_or_scams_monetary",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark(["Fraud, corruption or scams (monetary", "Fraud or scams"], {
            element: "Fraud_corruption_or_scams_monetary",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Protests_or_boycotts { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Protests_or_boycotts, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Protests_or_boycotts",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Protests or boycotts", {
            element: "Protests_or_boycotts",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reaction_to_advertising { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reaction_to_advertising, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reaction_to_advertising",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reaction to advertising", {
            element: "Reaction_to_advertising",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Referral_or_dissuasion { color: #ff2492; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Referral_or_dissuasion, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Referral_or_dissuasion",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Referral or dissuasion directly from one consumer to another consumer", {
            element: "Referral_or_dissuasion",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Spam_or_unsolicited_contact { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Spam_or_unsolicited_contact, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Spam_or_unsolicited_contact",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Spam or unsolicited contact", {
            element: "Spam_or_unsolicited_contact",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Valuing_loyal_customers { color: #fff; background-color: #93004a; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Valuing_loyal_customers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Valuing_loyal_customers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Valuing loyal customers", {
            element: "Valuing_loyal_customers",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Pricing:
    var Pricing = ["pric*", "cost*", "cost", "fee", "fees", "sav*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Affordability = ["Afford*", "cheap", "expens*", "cheap*", "cost-cutt*", "cost cutt*", "costcutt*", "yo", "accessible", "prices are low", "bargain", "inexpensive", ""]
    var Changes_in_pricing = ["increas*", "decreas*", "chang* pric*", "pric* chang*", "surge", "lowered", "", "", "", "", "", "", ""]
    var Hidden_costs = ["hidden cost*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Special_offers = ["% off", "%off", "promo", "discoun*", "deal", "save", "promo*", "promo", "sale", "sale*", "vaild until", "a special", "free", "% less", "%less", "promocode", "promo code", "%less", "promo-code", "specials", "mo*nice", "mo*nique", "more nice", "monice", "freeuberboda"]

    function Pricingf() {
        GM_addStyle("Changes_in_pricing { color: #ff6; background-color: #930093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Changes_in_pricing, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Changes_in_pricing",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Changes in pricing", {
            element: "Changes_in_pricing",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Pricing { color: #fff; background-color: #930093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Pricing, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Pricing",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Pricing", {
            exclude: [
                "Changes_in_pricing"
            ],
            element: "Pricing",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Affordability { color: #3DFF33; background-color: #930093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Affordability, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Affordability",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Affordability", {
            element: "Affordability",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Hidden_costs { color: #ff0000; background-color: #930093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Hidden_costs, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Hidden_costs",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Hidden costs", {
            element: "Hidden_costs",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Special_offers { color: #0DD5FC; background-color: #930093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Special_offers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Special_offers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Special offers", {
            element: "Special_offers",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Staff or HR:
    var Staff_or_HR = ["guy", "agent*", "advisor*", "cashier*", "officer*", "consultant*", "staff", "team*", "employee*", "worker*", "teller*", "attendant*", "panelbeater?", "pointm?n", "point m?n", "ee?s", "consultant*", "assistant", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var How_a_company_treats_its_staff = ["employee strike", "employees strike", "", "", ""]
    var Job_availability_or_offers = ["hire", "hiri*", "job offer", "job offer*", "", "", "", "", "", "", "", "", ""]
    var Management_and_or_supervisors = ["manager", "manager*", "management", "supervisor", "supervisor*", "chief", "ceo", "cfo", "reneotto5901", "head of brand", "", "", ""]
    var Staff_competency = ["professiona*", "knowledgable", "train", "train*", "competent", "well informed delivery guy", "untrained", "patience", "unprofressional", "useless", "incompetence", "appalling", "unhelp*"]
    var Staff_conduct = ["friendly *", "conduct", "mean", "bitter", "aggressive", "rude", "polite", "patient", "behav*", "staffconduct", "helpfull", "attitud", "angry", "yell*", "unfriendly", "badly", "", "", "", "", "", "", "", "", ""]
    var Staff_dismissals_or_retrenchments = ["laid off", "fired", "", "", "", "", "", "", "", "", "", "", ""]

    function StaffOrHr() {
        GM_addStyle("Staff_or_HR { color: #000; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_or_HR, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_or_HR",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff or HR", {
            element: "Staff_or_HR",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("How_a_company_treats_its_staff { color: #ffff24; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(How_a_company_treats_its_staff, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "How_a_company_treats_its_staff",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("How a company treats its staff", {
            element: "How_a_company_treats_its_staff",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Job_availability_or_offers { color: #0000b7; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Job_availability_or_offers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Job_availability_or_offers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Job availability or offers", {
            element: "Job_availability_or_offers",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Management_and_or_supervisors { color: #934a00; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Management_and_or_supervisors, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Management_and_or_supervisors",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Management and/or supervisors", {
            element: "Management_and_or_supervisors",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Staff_competency { color: #009300; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_competency, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_competency",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff competency", {
            element: "Staff_competency",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Staff_conduct { color: #db0000; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_conduct, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_conduct",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff conduct", {
            element: "Staff_conduct",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Staff_dismissals_or_retrenchments { color: #930093; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_dismissals_or_retrenchments, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_dismissals_or_retrenchments",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff dismissals or retrenchments", {
            element: "Staff_dismissals_or_retrenchments",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // None Of The Above:
    var None_Of_The_Above = ["*lfdriving", "*lf*ing", "*licopter*", "ShopRite", "*ictory*spar", "*r. *ibb", "", "", "", "", "", "", ""]

    function NoneOfTheAbove() {
        GM_addStyle("None_Of_The_Above { color: #fff; background-color: #FF9933; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(None_Of_The_Above, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "None_Of_The_Above",
            "separateWordSearch": false,
            "diacritics": false,
            "caseSensitive": true
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("None Of The Above", {
            element: "None_Of_The_Above",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Investment facilities:
    var Investment_facilities = [""]
    var Alerts_and_notificationsinvest = [""]
    var Branch_or_store_otherinvest = [""]
    var Mobile_appinvest = [""]
    var Website_feedbackinvest = [""]

    function InvestmentFacilities() {
        GM_addStyle("Investment_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Investment_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Investment_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Investment_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Alerts_and_notificationsinvest { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Alerts_and_notificationsinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Alerts_and_notificationsinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "Alerts_and_notificationsinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_otherinvest { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_otherinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_otherinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store (other", {
            element: "Branch_or_store_otherinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_appinvest { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_appinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_appinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile app", {
            element: "Mobile_appinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Website_feedbackinvest { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Website_feedbackinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Website_feedbackinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Website feedback", {
            element: "Website_feedbackinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

    }

    // Investment products:
    var Investment_productsinvest = ["cover", "annuit*", "bond*", "pension*", "invest*", "invest* fund", "retir* plan", "greenlight", "unit trusts", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Annuities = [""]
    var Bonds = [""]
    var Commodities = [""]
    var Investment_funds = [""]
    var Insuranceinvest = [""]
    var Pensions = [""]
    var Stocks = [""]

    function InvestmentProducts() {
        GM_addStyle("Investment_productsinvest { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Investment_productsinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Investment_productsinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Investment products", {
            element: "Investment_productsinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Annuities { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Annuities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Annuities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Annuities", {
            element: "Annuities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Bonds { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Bonds, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Bonds",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Bonds", {
            element: "Bonds",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Commodities { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Commodities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Commodities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Commodities", {
            element: "Commodities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Investment_funds { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Investment_funds, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Investment_funds",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Investment funds", {
            element: "Investment_funds",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insuranceinvest { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insuranceinvest, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insuranceinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance", {
            element: "Insuranceinvest",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Pensions { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Pensions, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Pensions",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Pensions", {
            element: "Pensions",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Stocks { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Stocks, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Stocks",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Stocks", {
            element: "Stocks",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Network coverage or quality:
    var Network_coverage_or_quality = ["network", "internet"]
    var Area_coverage = [""]
    var Call_quality = [""]
    var Connection_speeds = [""]
    var Roaming = [""]

    function CoverageQuality() {
        GM_addStyle("Network_coverage_or_quality { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Network_coverage_or_quality, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Network_coverage_or_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Network coverage", {
            element: "Network_coverage_or_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Area_coverage { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Area_coverage, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Network_coverage_or_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Area coverage", {
            element: "Area_coverage",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Call_quality { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Call_quality, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Call_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Call quality", {
            element: "Call_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Connection_speeds { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Connection_speeds, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Connection_speeds",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Connection speeds", {
            element: "Connection_speeds",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Roaming { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Roaming, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Roaming",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Roaming", {
            element: "Roaming",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Telecommunications facilities:
    var Telecommunications_facilities = [""]
    var Alerts_and_notificationsTele = [""]
    var Telecommunications_company_app = [""]
    var Telecommunications_company_website = [""]
    var Branches_or_stores = [""]

    function TelecommunicationsFacilities() {
        GM_addStyle("Telecommunications_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Telecommunications_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Telecommunications_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Telecommunications_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Alerts_and_notificationsTele { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Alerts_and_notificationsTele, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Alerts_and_notificationsTele",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "Alerts_and_notificationsTele",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Telecommunications_company_app { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Telecommunications_company_app, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Telecommunications_company_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Telecommunications company app", {
            element: "Telecommunications_company_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Telecommunications_company_website { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Telecommunications_company_website, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Telecommunications_company_website",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Telecommunications company website", {
            element: "Telecommunications_company_website",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branches_or_stores { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branches_or_stores, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branches_or_stores",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branches or stores", {
            element: "Branches_or_stores",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Telecommunications products:
    var Telecommunications_products = ["xperia"]
    var Airtime = [""]
    var Comparing_mobile_products_or_services = [""]
    var Mobile_data = [""]
    var Mobile_device_insurance = [""]
    var Range_of_products_product_mixTele = [""]
    var SIM_card = [""]
    var Reward_programmestele = [""]

    function TelecommunicationsProducts() {
        GM_addStyle("Telecommunications_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Telecommunications_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Telecommunications_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Telecommunications products", {
            element: "Telecommunications_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Airtime { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Airtime, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Airtime",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Airtime", {
            element: "Airtime",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Comparing_mobile_products_or_services { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Comparing_mobile_products_or_services, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Comparing_mobile_products_or_services",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Comparing mobile products or services", {
            element: "Comparing_mobile_products_or_services",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_data { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_data, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_data",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile data", {
            element: "Mobile_data",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_device_insurance { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_device_insurance, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_device_insurance",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile device insurance", {
            element: "Mobile_device_insurance",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Range_of_products_product_mixTele { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Range_of_products_product_mixTele, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Range_of_products_product_mixTele",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Range of products / product mix", {
            element: "Range_of_products_product_mixTele",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("SIM_card { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(SIM_card, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "SIM_card",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("SIM card", {
            element: "SIM_card",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reward_programmestele { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reward_programmestele, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reward_programmestele",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reward programmes", {
            element: "Reward_programmestele",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Claims process:
    var Claims_process = ["claim*"]
    var Approved_or_rejected_claims = [""]
    var Paying_out_replacing_items = ["pa* out"]
    var Status_of_claim = [""]

    function ClaimsProcess() {
        GM_addStyle("Claims_process { color: #fff; background-color: #4b4b00; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Claims_process, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Claims_process",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Claims process", {
            element: "Claims_process",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Approved_or_rejected_claims { color: #0DD5FC; background-color: #4b4b00; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Approved_or_rejected_claims, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Approved_or_rejected_claims",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Approved or rejected claims", {
            element: "Approved_or_rejected_claims",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Paying_out_replacing_items { color: #3DFF33; background-color: #4b4b00; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Paying_out_replacing_items, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Paying_out_replacing_items",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Paying out replacing items", {
            element: "Paying_out_replacing_items",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Status_of_claim { color: #db0000; background-color: #4b4b00; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Status_of_claim, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Status_of_claim",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Status of claim", {
            element: "Status_of_claim",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Insurance facilities:
    var Insurance_facilities = [""]
    var Courtesy_vehicles = [""]
    var Insurance_company_app = [""]
    var Insurance_company_website = [""]
    var Referral_bonuses_or_cash_reward_referrals = [""]

    function Insurancefacilities() {
        GM_addStyle("Insurance_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Insurance_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Courtesy_vehicles { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Courtesy_vehicles, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Courtesy_vehicles",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Courtesy vehicles", {
            element: "Courtesy_vehicles",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insurance_company_app { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_company_app, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_company_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance company app", {
            element: "Insurance_company_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insurance_company_website { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_company_website, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_company_website",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance company website", {
            element: "Insurance_company_website",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Referral_bonuses_or_cash_reward_referrals { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Referral_bonuses_or_cash_reward_referrals, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Referral_bonuses_or_cash_reward_referrals",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Referral bonuses or cash reward referrals", {
            element: "Referral_bonuses_or_cash_reward_referrals",
            "separateWordSearch": false,
            "diacritics": false
        })



    }

    // Insurance products:
    var Insurance_products = ["policy", "insurance", "loan?", "premiun?", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Application_process = [""]
    var Changing_cover = [""]
    var Insurance_features_or_coverage = [""]
    var Insurance_excess = ["co?payment back", "co?payment", "back access", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Investments_others = [""]
    var Quotes = [""]
    var Roadside_assistance = ["roadside", "road assistance", "tow", "towtruck", "tow*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    function InsuranceProducts() {
        GM_addStyle("Insurance_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance products", {
            element: "Insurance_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Application_process { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Application_process, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Application_process",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Application process", {
            element: "Application_process",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Changing_cover { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Changing_cover, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Changing_cover",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Changing cover", {
            element: "Changing_cover",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insurance_features_or_coverage { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_features_or_coverage, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_features_or_coverage",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance features or coverage", {
            element: "Insurance_features_or_coverage",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insurance_excess { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_excess, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_excess",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance excess", {
            element: "Insurance_excess",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Investments_others { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Investments_others, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Investments_others",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Investments (other", {
            element: "Investments_others",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Quotes { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Quotes, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Quotes",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Quotes", {
            element: "Quotes",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Roadside_assistance { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Roadside_assistance, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Roadside_assistance",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Roadside assistance", {
            element: "Roadside_assistance",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Insurance staff or contractors:
    var Insurance_staff_or_contractors = [""]
    var Assessors_or_investigative_staff = [""]
    var Brokers = [""]
    var Repair_or_installation_workers = [""]
    var Sales_agents = [""]
    var Staff_competencyInsu = ["professiona*", "knowledgable", "train", "train*", "competent", "well informed delivery guy", "untrained", "patience", "unprofressional", "useless", "incompetence", "appalling", "unhelp*"]
    var Staff_conductInsu = ["friendly *", "conduct", "mean", "bitter", "aggressive", "rude", "polite", "patient", "behav*", "staffconduct", "helpfull", "attitud", "angry", "yell*", "unfriendly", "badly"]

    function InsuranceStaffOrContractors() {
        GM_addStyle("Insurance_staff_or_contractors { color: #000; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurance_staff_or_contractors, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_staff_or_contractors",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance staff or contractors", {
            element: "Insurance_staff_or_contractors",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Assessors_or_investigative_staff { color: #4848ff; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Assessors_or_investigative_staff, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurance_staff_or_contractors",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Assessors or investigative staff", {
            element: "Assessors_or_investigative_staff",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Brokers { color: #5c5c5c; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Brokers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Brokers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Brokers", {
            element: "Brokers",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Repair_or_installation_workers { color: #ffff24; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Repair_or_installation_workers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Repair_or_installation_workers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Repair or installation workers", {
            element: "Repair_or_installation_workers",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Sales_agents { color: #6f006f; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Sales_agents, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Sales_agents",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Sales agents", {
            element: "Sales_agents",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Staff_competencyInsu { color: #009300; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_competencyInsu, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_competencyInsu",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff competency", {
            element: "Staff_competencyInsu",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Staff_conductInsu { color: #db0000; background-color: #f99; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Staff_conductInsu, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Staff_conductInsu",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Staff conduct", {
            element: "Staff_conductInsu",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Retail Facilities:
    var Retail_Facilities = ["", "", "", "", "", "", "", "", "", "", "", "", ""]
    var alerts_notificationsretail = ["", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Branch_or_store_hygieneretail = ["dirty", "clean", "", "", "", "", "", "", "", "", "", "", ""]
    var Branch_or_store_layoutretail = ["", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Branch_or_storesretail = ["branch", "store", "branchs", "stores", "supermarket", "", "", "", "", "", "", "", ""]
    var Courier_or_delivery_serviceretail = ["delivery", "courrier", "courries", "", "", "", "", "", "", "", "", "", ""]
    var Extra_facilities_in_branch_or_storeretail = ["trulley", "toiled", "outlet", "outlets", "PickanPay", "PnP", "woolies", "checkers", "woolworth", "via", "till", "money market", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Mobile_appretail = ["", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Online_shopping_ordering = ["", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Physical_safetyretail = ["", "", "", "", "", "", "", "", "", "", "", "", ""]

    function RetailFacilities() {
        GM_addStyle("Extra_facilities_in_branch_or_storeretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Extra_facilities_in_branch_or_storeretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Extra_facilities_in_branch_or_storeretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Extra facilities in branch or store", {
            element: "Extra_facilities_in_branch_or_storeretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Retail_Facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Retail_Facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Retail_Facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Facilities", {
            element: "Retail_Facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("alerts_notificationsretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(alerts_notificationsretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "alerts_notificationsretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "alerts_notificationsretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_hygieneretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_hygieneretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_hygieneretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store hygiene", {
            element: "Branch_or_store_hygieneretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_layoutretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_layoutretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_layoutretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store layout", {
            element: "Branch_or_store_layoutretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_storesretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_storesretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_storesretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or stores", {
            element: "Branch_or_storesretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Courier_or_delivery_serviceretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Courier_or_delivery_serviceretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Courier_or_delivery_serviceretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Courier or delivery service", {
            element: "Courier_or_delivery_serviceretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_appretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_appretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_appretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile app", {
            element: "Mobile_appretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Online_shopping_ordering { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Online_shopping_ordering, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Online_shopping_ordering",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Online shopping/ordering", {
            element: "Online_shopping_ordering",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Physical_safetyretail { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Physical_safetyretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Physical_safetyretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Physical safety", {
            element: "Physical_safetyretail",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Retail products:
    var Retail_products = ["giftcard", "product", "products", "item", "items", "oros", "fashion", "buy it", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Expired_or_past_sell_by_dateretail = ["expired", "expires", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Handling_or_packingretail = ["pack", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var House_brands = ["bag", "bags", "spar fresh line products", "freshliving magazine", "*cake", "* cake", "PnPscratchcards", "gifcard", "shopping vouchers", "pick and pay scratch card*", "gourmet ribs", "*ultrex", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_or_portion_sizeretail = ["size", "portion", "enough for *", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_out_of_stockretail = ["out of stock", "stock", "available", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_packagingretail = ["packaging", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_qualityretail = ["quality", "damaged", "spoiled", "fresh", "defective", "styling", "unfresh", "crap", "great meal", "gorgeous", "amaizing", "rust", "pre-used", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_tasteretail = ["yummy", "tasty", "delicious", "spicy", "taste*", "sweet", "tasteless", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Range_of_products = ["range of *", "existing range", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Reward_programmesretail = ["reward", "smartshopper cards", "reward card", "smartshopper", "shoprite scratch cards", "e-bucks", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    function RetailProducts() {
        GM_addStyle("Retail_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Retail_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Retail_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Retail products", {
            element: "Retail_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Expired_or_past_sell_by_dateretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Expired_or_past_sell_by_dateretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Expired_or_past_sell_by_dateretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Expired or past sell by date", {
            element: "Expired_or_past_sell_by_dateretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Handling_or_packingretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Handling_or_packingretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Handling_or_packingretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Handling or packing", {
            element: "Handling_or_packingretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("House_brands { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(House_brands, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "House_brands",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("House brands", {
            element: "House_brands",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_or_portion_sizeretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_or_portion_sizeretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_or_portion_sizeretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product or portion size", {
            element: "Product_or_portion_sizeretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_out_of_stockretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_out_of_stockretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_out_of_stockretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product out of stock", {
            element: "Product_out_of_stockretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_packagingretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_packagingretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_packagingretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product packaging", {
            element: "Product_packagingretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_qualityretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_qualityretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_qualityretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product quality", {
            element: "Product_qualityretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_tasteretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_tasteretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_tasteretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product taste", {
            element: "Product_tasteretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Range_of_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Range_of_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Range_of_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Range of products * product mix", {
            wildcards: "enabled",
            element: "Range_of_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reward_programmesretail { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reward_programmesretail, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reward_programmesretail",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reward programmes", {
            element: "Reward_programmesretail",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Banking products:
    var Banking_products = ["wallet", "e*wallet", "account?", "acct", "alc", "student achiever account", "guptaaccount?", "credit? offer?", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Credit_cards = ["credit card", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Debit_cards_or_other_cards = ["cards", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Foreign_exchange = ["authoriz* currenc*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Insurancebank = ["policy", "insurance", "loan?", "premiun?", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Investment_productsbank = ["cover", "annuit*", "bond*", "pension", "invest*", "investment fund", "retirement plan", "greenlight", "unit trusts", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Mortgage_or_home_loan = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Overdraft = [""]
    var Personal_loans = ["loans", "bonds"]
    var Reward_programmesbank = ["greenbacks", "e?bucks"]

    function BankingProducts() {
        GM_addStyle("Debit_cards_or_other_cards { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Debit_cards_or_other_cards, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Debit_cards_or_other_cards",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Debit cards or other cards (not Credit cards", {
            element: "Debit_cards_or_other_cards",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Banking_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Banking_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Retail_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Banking products", {
            element: "Banking_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Credit_cards { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Credit_cards, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Credit_cards",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Credit cards", {
            element: "Credit_cards",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Foreign_exchange { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Foreign_exchange, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Foreign_exchange",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Foreign exchange", {
            element: "Foreign_exchange",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Insurancebank { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Insurancebank, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Insurancebank",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Insurance", {
            element: "Insurancebank",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Investment_productsbank { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Investment_productsbank, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Investment_productsbank",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Investment products", {
            element: "Investment_productsbank",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mortgage_or_home_loan { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mortgage_or_home_loan, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mortgage_or_home_loan",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mortgage or home loan", {
            element: "Mortgage_or_home_loan",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Overdraft { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Overdraft, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Overdraft",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Overdraft", {
            element: "Overdraft",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Personal_loans { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Personal_loans, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Personal_loans",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Personal loans", {
            element: "Personal_loans",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reward_programmesbank { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reward_programmesbank, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reward_programmesbank",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reward programmes", {
            element: "Reward_programmesbank",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Bank facilities:
    var Bank_facilities = ["statement*", "speedpoints"]
    var Alerts_and_notificationsBank = ["otp*"]
    var ATMs = ["atm*"]
    var Banking_app = ["app"]
    var Branch_or_store_otherbank = [""]
    var Cellphone_Banking = ["*120*"]
    var Debit_orders = ["d/o", "d/ord*", "naedo transaction", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Online_banking = ["website"]
    var Transfers_between_own_accounts_or_friends_or_other_banks = ["transfer*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    function BankFacilities() {
        GM_addStyle("Bank_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Bank_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Bank_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Bank_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Alerts_and_notificationsBank { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Alerts_and_notificationsBank, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Alerts_and_notificationsBank",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "Alerts_and_notificationsBank",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("ATMs { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(ATMs, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "ATMs",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("ATMs", {
            element: "ATMs",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Banking_app { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Banking_app, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Banking_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Banking app", {
            element: "Banking_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_otherbank { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_otherbank, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_otherbank",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store (other", {
            element: "Branch_or_store_otherbank",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Cellphone_Banking { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Cellphone_Banking, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Cellphone_Banking",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Cellphone Banking", {
            element: "Cellphone_Banking",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Debit_orders { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Debit_orders, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Debit_orders",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Debit orders", {
            element: "Debit_orders",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Online_banking { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Online_banking, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Online_banking",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Online banking", {
            element: "Online_banking",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Transfers_between_own_accounts_or_friends_or_other_banks { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Transfers_between_own_accounts_or_friends_or_other_banks, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Transfers_between_own_accounts_or_friends_or_other_banks",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Transfers between own accounts or friends or other banks", {
            element: "Transfers_between_own_accounts_or_friends_or_other_banks",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Drivers:
    var Drivers = ["driver*", "my uber", "uber guy", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Driver_earnings = ["earning*", "commission*", "tip*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Driver_recruitment = ["hir*", "recrui*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Driver_safety = [""]
    var Driver_support = [""]

    function DriversT() {
        GM_addStyle("Drivers { color: #fff; background-color: #6f3800; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Drivers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Drivers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Drivers", {
            element: "Drivers",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Driver_earnings { color: #ff6; background-color: #6f3800; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Driver_earnings, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Driver_earnings",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Driver earnings", {
            element: "Driver_earnings",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Driver_recruitment { color: #0DD5FC; background-color: #6f3800; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Driver_recruitment, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Driver_recruitment",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Driver recruitment", {
            element: "Driver_recruitment",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Driver_safety { color: #b700b7; background-color: #6f3800; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Driver_safety, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Driver_safety",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Driver safety", {
            element: "Driver_safety",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Driver_support { color: #3DFF33; background-color: #6f3800; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Driver_support, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Driver_support",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Driver support", {
            element: "Driver_support",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Transport experience:
    var Transport_experience = [""]
    var Other_passengers = [""]
    var Passenger_safety = [""]
    var Route = ["route*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Transport_app = ["app*", "app* riders", "map", "gps", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Transport_services_coverage = [""]
    var Vehicle_quality = ["dirty"]

    function TransportExperience() {
        GM_addStyle("Transport_experience { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Transport_experience, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Transport_experience",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("experience", {
            element: "Transport_experience",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Other_passengers { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Other_passengers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Other_passengers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Other passengers", {
            element: "Other_passengers",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Passenger_safety { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Passenger_safety, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Passenger_safety",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Passenger safety", {
            element: "Passenger_safety",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Route { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Route, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Route",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Route", {
            element: "Route",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Transport_app { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Transport_app, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Transport_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Transport app", {
            element: "Transport_app",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Transport_services_coverage { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Transport_services_coverage, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Transport_services_coverage",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Transport services coverage", {
            element: "Transport_services_coverage",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Vehicle_quality { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Vehicle_quality, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Vehicle_quality",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Vehicle quality", {
            element: "Vehicle_quality",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Ecommerce facilities:
    var Ecommerce_facilities = [""]
    var Alerts_and_notificationsecommerce = [""]
    var Collections = [""]
    var Courier_or_delivery_serviceecommerce = [""]
    var Mobile_appecommerce = [""]
    var Order_status = [""]
    var Pre_orders = [""]
    var Website_feedbackecommerce = [""]

    function EcommerceFacilities() {
        GM_addStyle("Ecommerce_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Ecommerce_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Ecommerce_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Ecommerce_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Alerts_and_notificationsecommerce { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Alerts_and_notificationsecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Alerts_and_notificationsecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "Alerts_and_notificationsecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Collections { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Collections, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Collections",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Collections", {
            element: "Collections",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Courier_or_delivery_serviceecommerce { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Courier_or_delivery_serviceecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Courier_or_delivery_serviceecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Courier or delivery service", {
            element: "Courier_or_delivery_serviceecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_appecommerce { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_appecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_appecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile app", {
            element: "Mobile_appecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Order_status { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Order_status, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Order_status",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Order status", {
            element: "Order_status",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Pre_orders { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Pre_orders, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Pre_orders",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Pre-orders", {
            element: "Pre_orders",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Website_feedbackecommerce { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Website_feedbackecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Website_feedbackecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Website feedback", {
            element: "Website_feedbackecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Ecommerce products:
    var Ecommerce_products = [""]
    var Product_out_of_stockecommerce = [""]
    var Product_packagingecommerce = [""]
    var Product_qualityecommerce = [""]
    var Range_of_products_product_mixecommerce = [""]
    var Reward_programmesecommerce = [""]

    function EcommerceProducts() {
        GM_addStyle("Ecommerce_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Ecommerce_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Ecommerce_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Ecommerce products", {
            element: "Ecommerce_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_out_of_stockecommerce { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_out_of_stockecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_out_of_stockecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product out of stock", {
            element: "Product_out_of_stockecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_packagingecommerce { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_packagingecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_packagingecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product packaging", {
            element: "Product_packagingecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_qualityecommerce { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_qualityecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_qualityecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product quality", {
            element: "Product_qualityecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Range_of_products_product_mixecommerce { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Range_of_products_product_mixecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Range_of_products_product_mixecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Range of products / product mix", {
            element: "Range_of_products_product_mixecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reward_programmesecommerce { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reward_programmesecommerce, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reward_programmesecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reward programmes", {
            element: "Reward_programmesecommerce",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Medical departments:
    var Medical_departments = [""]
    var Anesthesiology = [""]
    var Emergency_or_casualty = [""]
    var Intensive_care_unit = [""]
    var Obstetrics_or_Gynecology = [""]
    var Pediatrics = [""]
    var Pharmacy = [""]
    var Surgery = [""]
    var Xray_or_imaging = [""]

    function MedicalDepartments() {
        GM_addStyle("Medical_departments { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Medical_departments, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Medical_departments",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Medical departments", {
            element: "Medical_departments",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Anesthesiology { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Anesthesiology, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Anesthesiology",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Anesthesiology", {
            element: "Anesthesiology",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Emergency_or_casualty { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Emergency_or_casualty, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Emergency_or_casualty",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Emergency or casualty", {
            element: "Emergency_or_casualty",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Intensive_care_unit { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Intensive_care_unit, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Intensive_care_unit",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Intensive care unit", {
            element: "Intensive_care_unit",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Obstetrics_or_Gynecology { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Obstetrics_or_Gynecology, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Obstetrics_or_Gynecology",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Obstetrics or Gynecology", {
            element: "Obstetrics_or_Gynecology",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Pediatrics { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Pediatrics, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Pediatrics",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Pediatrics", {
            element: "Pediatrics",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Pharmacy { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Pharmacy, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Pharmacy",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Pharmacy", {
            element: "Pharmacy",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Surgery { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Surgery, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Surgery",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Surgery", {
            element: "Surgery",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Xray_or_imaging { color: #fff; background-color: #141414; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Xray_or_imaging, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Xray_or_imaging",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Xray or imaging", {
            element: "Xray_or_imaging",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Patient journey:
    var Patient_journey = [""]
    var Admissions = [""]
    var Amenities = [""]
    var Diagnostics_or_medical_tests = [""]
    var Discharged_from_care = [""]
    var Food_or_beverages = [""]
    var Follow_up_care = [""]
    var Hygiene_or_cleanliness = [""]
    var Medical_insurance = [""]
    var Patient_comfort = [""]
    var Comparing_healthcare_providers = [""]

    function PatientJourney() {
        GM_addStyle("Patient_journey { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Patient_journey, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Patient_journey",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Patient journey", {
            element: "Patient_journey",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Admissions { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Admissions, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Admissions",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Admissions", {
            element: "Admissions",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Amenities { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Amenities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Amenities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Amenities", {
            element: "Amenities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Diagnostics_or_medical_tests { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Diagnostics_or_medical_tests, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Diagnostics_or_medical_tests",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Diagnostics or medical tests", {
            element: "Diagnostics_or_medical_tests",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Discharged_from_care { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Discharged_from_care, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Discharged_from_care",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Discharged from care", {
            element: "Discharged_from_care",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Food_or_beverages { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Food_or_beverages, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Food_or_beverages",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Food or beverages", {
            element: "Food_or_beverages",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Follow_up_care { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Follow_up_care, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Follow_up_care",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Follow up care", {
            element: "Follow_up_care",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Hygiene_or_cleanliness { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Hygiene_or_cleanliness, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Hygiene_or_cleanliness",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Hygiene or cleanliness", {
            element: "Hygiene_or_cleanliness",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Medical_insurance { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Medical_insurance, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Medical_insurance",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Medical insurance", {
            element: "Medical_insurance",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Patient_comfort { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Patient_comfort, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Patient_comfort",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Patient comfort", {
            element: "Patient_comfort",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Comparing_healthcare_providers { color: #fff; background-color: #000093; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Comparing_healthcare_providers, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Comparing_healthcare_providers",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Comparing healthcare providers", {
            element: "Comparing_healthcare_providers",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Fast food facilities:
    var Fast_food_facilities = [""]
    var Alerts_and_notificationsfstfood = [""]
    var Booking = [""]
    var Branch_or_store_hygienefstfood = [""]
    var Branch_or_store_layoutfstfood = [""]
    var Branch_or_store_otherfstfood = [""]
    var Courier_or_delivery_servicefstfood = [""]
    var Customization = [""]
    var Drive_thru = [""]
    var Extra_facilities_in_branch_or_storefstfood = [""]
    var Mobile_appfstfood = [""]
    var Online_purchasing_or_ordering = [""]
    var Physical_safetyfstfood = [""]
    var Website_feedbackfstfood = [""]

    function FastFoodFacilities() {
        GM_addStyle("Extra_facilities_in_branch_or_storefstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Extra_facilities_in_branch_or_storefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Extra_facilities_in_branch_or_storefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Extra facilities in branch or store", {
            element: "Extra_facilities_in_branch_or_storefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Fast_food_facilities { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Fast_food_facilities, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Fast_food_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("facilities", {
            element: "Fast_food_facilities",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Booking { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Booking, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Booking",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Booking", {
            element: "Booking",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Alerts_and_notificationsfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Alerts_and_notificationsfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Alerts_and_notificationsfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Alerts and notifications", {
            element: "Alerts_and_notificationsfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_hygienefstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_hygienefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_hygienefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store hygiene", {
            element: "Branch_or_store_hygienefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_layoutfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_layoutfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_layoutfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store layout", {
            element: "Branch_or_store_layoutfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Branch_or_store_otherfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Branch_or_store_otherfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Branch_or_store_otherfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Branch or store", {
            element: "Branch_or_store_otherfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Courier_or_delivery_servicefstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Courier_or_delivery_servicefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Courier_or_delivery_servicefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Courier or delivery service", {
            element: "Courier_or_delivery_servicefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Customization { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Customization, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Customization",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Customization", {
            element: "Customization",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Drive_thru { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Drive_thru, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Drive_thru",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Drive-thru", {
            element: "Drive_thru",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Extra_facilities_in_branch_or_storefstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Extra_facilities_in_branch_or_storefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Extra_facilities_in_branch_or_storefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Extra facilities in branch or store", {
            element: "Extra_facilities_in_branch_or_storefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Mobile_appfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Mobile_appfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Mobile_appfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Mobile app", {
            element: "Mobile_appfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Online_purchasing_or_ordering { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Online_purchasing_or_ordering, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Online_purchasing_or_ordering",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Online purchasing or ordering", {
            element: "Online_purchasing_or_ordering",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Physical_safetyfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Physical_safetyfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Physical_safetyfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Physical safety", {
            element: "Physical_safetyfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Website_feedbackfstfood { color: #fff; background-color: #00b700; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Website_feedbackfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Website_feedbackfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Website feedback", {
            element: "Website_feedbackfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Fast food products:
    var Fast_food_products = ["bigmac", "big mac", "mcflurry", "quarter pound", "fries", "burger", "craving mcdonalds", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Expected_extras_available_with_fast_food_meals = ["sauce*", "mustard", "mayonaise", "ketchup", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Expired_or_past_sell_by_datefstfood = [""]
    var Handling_or_packingfstfood = [""]
    var Kids_meal = ["happy meal", "nuggets", "toy*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Product_or_portion_sizefstfood = [""]
    var Product_out_of_stockfstfood = [""]
    var Product_packagingfstfood = [""]
    var Product_qualityfstfood = [""]
    var Product_tastefstfood = [""]
    var Range_of_products_product_mixfstfood = [""]
    var Reward_programmesfstfood = [""]

    function FastFoodProducts() {
        GM_addStyle("Fast_food_products { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Fast_food_products, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Fast_food_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Fast food products", {
            element: "Fast_food_products",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Expected_extras_available_with_fast_food_meals { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Expected_extras_available_with_fast_food_meals, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Expected_extras_available_with_fast_food_meals",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Expected extras available with fast food meals", {
            element: "Expected_extras_available_with_fast_food_meals",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Expired_or_past_sell_by_datefstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Expired_or_past_sell_by_datefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Expired_or_past_sell_by_datefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Expired or past sell by date", {
            element: "Expired_or_past_sell_by_datefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Handling_or_packingfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Handling_or_packingfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Handling_or_packingfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Handling or packing", {
            element: "Handling_or_packingfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Kids_meal { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Kids_meal, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Kids_meal",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Kid?s meal", {
            wildcards: "enabled",
            element: "Kids_meal",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_or_portion_sizefstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_or_portion_sizefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_or_portion_sizefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product or portion size", {
            element: "Product_or_portion_sizefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_out_of_stockfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_out_of_stockfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_out_of_stockfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product out of stock", {
            element: "Product_out_of_stockfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_packagingfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_packagingfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_packagingfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product packaging", {
            element: "Product_packagingfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_qualityfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_qualityfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_qualityfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product quality", {
            element: "Product_qualityfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Product_tastefstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Product_tastefstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Product_tastefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Product taste", {
            element: "Product_tastefstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Range_of_products_product_mixfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Range_of_products_product_mixfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Range_of_products_product_mixfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Range of products * product mix", {
            wildcards: "enabled",
            element: "Range_of_products_product_mixfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        GM_addStyle("Reward_programmesfstfood { color: #fff; background-color: #009393; } img { border: 0; }"); //cambiar el background-color para el fondo y cambiar color para el color de la letra.
        // create an element, replace the text node with an element
        var instance = new Mark(document.querySelectorAll('div.BRANDSEYE.job-body'));
        instance.mark(Reward_programmesfstfood, {
            ignorePunctuation: ":;.,-–—‒_(){}[]!'\"+=".split(""),
            wildcards: "enabled",
            accuracy: {
                "value": "exactly",
                "limiters": [",", ".", ";", ":", "?", "!"]
            },
            element: "Reward_programmesfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })

        var instance = new Mark(document.querySelectorAll('span'));
        instance.mark("Reward programmes", {
            element: "Reward_programmesfstfood",
            "separateWordSearch": false,
            "diacritics": false
        })
    }

    // Safety and Security:
    var Safety_and_Security = ["bomb", "denotation*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Crime = ["crime*", "murder*", "burn*", "loot*", "rape*", "raping", "corruption", "criminal", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Fires_Fire_department = ["fire*", "fire department", "fire hazard*", "fire report", "burn", "explosion", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Police = ["police", "police officer*", "patrol*", "cop*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Traffic_department = ["traffic officer*", "traffic dep*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Social Services:
    var Social_Services = ["pension*"]
    var Animal_welfare = ["animal right*"]
    var Education_social_services = ["education", "*school*", "college*", "kinder garden", "kinder*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Charity_and_CSI = ["social upliftment"]
    var Healthcare_Hospitals = ["healthcare", "hospital*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Immigrants = ["immigrants", "refuge*", "exile", "asylum seeker", "asylum", "emigre*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Homeless_individuals = ["homeles*"]
    var Places_of_Worship = ["church", "mosque", "synagogue", "temple", "", "worship", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Town/City management:
    var Town_City_management = ["city council"]
    var Billing_and_Accounts = ["tax*", "bill*", "paid", "charge", "deduct*", "pay", "overcharge*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Careers_with_the_City = ["job application"]
    var City_Councillors = ["councill*", "mec", "*alanwinde", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var City_Staff = ["city staff"]
    var City_website = ["city website"]
    var Mayor = ["mayor", "patricia de lille", "auntie pat", "aunt pat", "aunt patty", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Transport:
    var Transport = ["motorcycle", "transportation", "vehic*", "taxi", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Cycling_in_the_city = ["cyclist*", "bike*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Public_transport = ["bus*", "public transport", "train", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Traffic_and_congestion = ["vehicular congestion"]
    var Traffic_lights = [""]
    var Vehicle_registrations_licensing = ["vehicle registration*", "licens*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Urban development and management:
    var Urban_development_and_management = ["building stadium"]
    var Access_to_housing = ["housing", "accesstohousing", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Electricity = ["electricity"]
    var Electricity_meter = ["meter", "prepaid electricity meter", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Environmental_impacttown = [""]
    var Parks = ["park*"]
    var Roads = ["road*", "street*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Storm_Drains = ["storm", "drains", "waterdrain", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Water & Waste management:
    var Water_Waste_management = [""]
    var Access_to_water = ["access to water", "water delivery", "cutoff", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Flooding = ["flood*", "flood warning*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Fly_tipping_Dumping_of_waste = ["flytipping"]
    var Sanitation = ["sanitation"]
    var Solid_waste = ["dumping of waste", "dumped", "garbage", "solid waste", "waste management", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Sewage = ["sewag*", "sewages drains", "sewage leak*", "excrement", "sewerage sewer", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Water_leaks = ["water leak*", "water drain*", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Water_meter = ["water meter", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]

    // Academics:
    var Academics = [""]
    var Academic_venues = [""]
    var Campus_reference = [""]
    var Courses_course_structure = [""]
    var Exams = [""]
    var Language_accessibility = [""]

    // Student life and experiences:
    var Student_life_and_experiences = [""]
    var Alumni_graduates_or_past_students = [""]
    var Campus_events = [""]
    var Healthcare_services = [""]
    var International_students = [""]
    var Parking_and_transport = [""]
    var Part_time_students = [""]
    var Political_affiliation_or_views = [""]
    var Residence_or_accomodation = [""]
    var Student_organisations_or_societies = [""]
    var University_sports = [""]

    // University administration:
    var University_administration = [""]
    var Applying_to_University = [""]
    var Communicating_with_students = [""]
    var Counselling = [""]
    var Fees = [""]
    var Financial_aid = [""]
    var Infrastructure = [""]
    var Open_day = [""]
    var Registrations = [""]

    // University ethics or reputation:
    var University_ethics_or_reputation = [""]
    var Ethnicity_or_racial_concerns_issues = [""]
    var Gender_concerns_issues = [""]
    var Intimidation_and_Violence = [""]
    var Personal_safety_security = [""]
    var Plagiarism = [""]
    var Protests_or_boycottsUni = [""]
    var Religious_concerns_issues = [""]
    var University_or_campus_ranking = [""]

    // University staff or HR:
    var University_staff_or_HR = [""]
    var How_a_company_treats_its_staffUni = [""]
    var Lecturers_academic_staff = ["tutor", "teach*", "professor", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]
    var Non_academic_staff = [""]
    var Staff_competencyUni = [""]
    var Staff_conductUni = [""]
    var Staff_dismissals_or_retrenchmentsUni = [""]

    // Cast:
    var Cast = [""]
    var Interviews_with_the_cast = [""]
    var Special_guests_cameos = [""]

    // Elements of the show
    var Elements_of_the_show = [""]
    var Adaptation = [""]
    var Characters = [""]
    var Opening_sequence_credits = [""]
    var Pop_culture_references_Easter_eggs = [""]
    var Premiers_finales = [""]
    var Storyline = [""]
    var Theme_song = [""]

    // Ethics or reputation - shows / movies
    var Ethics_or_reputation_shows_movies = [""]
    var Awards = [""]
    var Comparisons_to_other_shows = [""]
    var Fans_cult_following = [""]
    var Innovation_of_show = [""]
    var Ratings = [""]
    var Recommendation_or_dissuasion = [""]
    var Scores_and_critiques = [""]
    var Show_ranking = [""]
    var Social_awareness_discrimination_equality = [""]

    // Production team
    var Production_team = [""]
    var Art_director = [""]
    var Casting_choice = [""]
    var Cinematographer = [""]
    var Director = [""]
    var Editor = [""]
    var Executive_producer = [""]
    var Screenwriters = [""]

    // Production values
    var Production_values = [""]
    var Acting = [""]
    var Art_direction = [""]
    var Casting = [""]
    var Cinematography = [""]
    var Costumes = [""]
    var Direction = [""]
    var Editing = [""]
    var Music_soundtrack = [""]
    var Special_effects = [""]
    var Writing = [""]

    // Show journey (aka customer journey)
    var Show_journey_customer_journey = [""]
    var Intent_to_start_watching_the_show = [""]
    var Reasons_for_watching = [""]
    var Intent_to_keep_watching_the_show = [""]
    var Intent_to_stop_watching_the_show = [""]
    var Reasons_for_not_watching = [""]
    var Intent_to_never_watch_the_show = [""]
    var Intent_to_subscribe_to_SkyAtlantic_due_to_the_show = [""]
    var Request_for_opinions_on_the_show = [""]

    // Show-related content or products
    var Show_related_content_or_products = [""]
    var Advertisement_of_the_show = [""]
    var How_the_show_influences_real_life = [""]
    var Memes = [""]
    var Merchandise = [""]
    var Plot_theories = [""]
    var Spoilers = [""]
    var Trailers_teasers_promos = [""]

    // Technical quality
    var Technical_quality = [""]
    var Decoder = [""]
    var Image = [""]
    var Sound = [""]
    var Subtitles = [""]

    // Viewing experience
    var Viewing_experience = [""]
    var Advertisements_during_on_the_show = [""]
    var Bingewatching = [""]
    var Group_viewing_or_viewing_events = [""]
    var Hiatus = [""]
    var Schedule = [""]
    var Season_episode_length = [""]
    var Streaming_on_demand = [""]
    var Torrenting_Piracy = [""]

    // Customer service - Expo2020
    var Customer_service_Expo2020 = [""]
    var Ticketing = [""]
    var Turn_around_time_TAT = [""]
    var Ethics_or_reputation_Expo2020 = [""]
    var Boycotts_or_protests_Expo2020 = [""]
    var Corruption_or_bribery_Expo2020 = [""]
    var Environmental_impact_Expo2020 = [""]
    var Human_rights_Expo2020 = [""]

    // Infrastructure
    var Infrastructure = [""]
    var Aesthetics = [""]
    var Construction_Expo2020 = [""]

    // Partnerships or initiatives - Expo2020
    var Partnerships_or_initiatives_Expo2020 = [""]
    var Appearances_at_promotional_events = [""]
    var Grant_programmes = [""]
    var Multinational_companies = [""]
    var Tenders_Expo2020 = [""]
    var Volunteers = [""]
    var Youth_programmes = [""]

    // UAE Government - Expo2020
    var UAE_Government_Expo2020
    var Comparison_to_other_events_Expo2020 = [""]
    var References_to_the_UAE_or_Dubai_governments = [""]
    var Relationship_with_foreign_countries = [""]

    // Buyers and sellers
    var Buyers_and_sellers = [""]
    var Feedback_about_a_buyer = [""]
    var Feedback_about_a_seller = [""]
    var People_wanting_to_buy = [""]
    var People_wanting_to_sell = [""]

    // Online classified facilities
    var Online_classified_facilities = [""]
    var Editing_an_advertisement = [""]
    var Feature_requests_or_suggestions = [""]
    var Mobile_appOnlClassif = [""]
    var Posting_an_advertisement = [""]
    var Website_feedbackOnlClassif = [""]

    // Attributes of vehicles that influence their purchase or not
    var Attributes_of_vehicles_that_influence_their_purchase_or_not = [""]
    var Availability_of_parts_or_spares = [""]
    var Cost_of_maintenance_or_upkeep = [""]
    var Electric_or_hybrid_vehicles = [""]
    var Fuel_efficiency = [""]
    var Maintenance_plans_packages = [""]
    var Practicality_of_vehicle = [""]
    var Safety_specifications = [""]
    var Vehicle_aesthetics = [""]
    var Warranty = [""]

    // Vehicle sales offices or dealerships
    var Vehicle_sales_offices_or_dealerships = [""]
    var Comparing_dealerships = [""]
    var Look_and_feel_of_dealership = [""]
    var Quality_of_workmanship = [""]
    var Vehicle_delivery_or_collections = [""]
    var Vehicle_service_department = [""]

    // Vehicle purchase journey
    var Vehicle_purchase_journey = [""]
    var After_sales_serviceVL = [""]
    var Comparing_vehicles = [""]
    var Desire_to_own_a_vehicle = [""]
    var Financing_a_vehicle = [""]
    var No_longer_purchasingv
    var Selling_or_trading_in_a_vehicle = [""]
    var Warranty_claims_process = [""]

    // Advertising or promotions
    var Advertising_or_promotions = [""]
    var Brands_advertising = [""]
    var Promotions = [""]
    var Sponsorships_or_Events = [""]
    var Product_launches = [""]

    // Alcohol products
    var Alcohol_products = [""]
    var Expired_or_past_sell_by_datealcohol = [""]
    var Handling_or_packingalcohol = [""]
    var Product_out_of_stockalcohol = [""]
    var Product_packagingalcohol = [""]
    var Product_qualityalcohol = [""]
    var Product_tastealcohol = [""]
    var Range_of_products_product_mixalcohol = [""]
    var Reward_programmesalcohol = [""]

    // Alcohol suppliers for offsite consumption
    var Alcohol_suppliers_for_offsite_consumption = [""]
    var Apps = [""]
    var Deliveries = [""]
    var Online_shopping = [""]
    var Point_of_sale_experience = [""]
    var Store_branch = [""]

    // Alcohol units / sizes
    var Alcohol_units_sizes = [""]
    var Bottle_dumpy = [""]
    var Box = [""]
    var Can = [""]
    var Case_x12_x24 = [""]
    var Glass_carafe = [""]
    var Keg = [""]
    var Quart = [""]

    // Occasionality of drinking
    var Occasionality_of_drinking = [""]
    var At_home = [""]
    var Bars_pubs_nightclubs_or_restaurants = [""]
    var Drinking_at_an_event = [""]
    var Drinking_at_work = [""]
    var Shebeen_informal = [""]
    var Production_site_wine_farm_etc = [""]

    // Health, safety and legal
    var Health_safety_and_legal = [""]
    var Alcoholism = [""]
    var Alcohol_content_level_or_strength = [""]
    var Drink_driving = [""]
    var Dop_system = [""]
    var Health_complications = [""]
    var Liquor_license = [""]
    var Socio_economic_implications = [""]
    var Underage_drinking = [""]
    var Regulations_and_by_laws = [""]
    /*
    var Trees1 = ["Customer_journey", "After_sales_service", "Deciding_whether_to_sign_up_or_purchase", "Thinking_about_cancelling_or_decided_to_cancel", "Happy_about_choice_to_leave", "Regrets_leaving_or_desires_to_return", "Customer_service", "Advice_given_by_a_brand_representative", "Billing_or_payments", "Email_support", "Frozen_blocked_or_suspended", "Language_of_choice", "Live_chat_support", "No_response_received", "Operating_hours", "Placed_on_hold", "Queuing", "Referred_to_wrong_department_person", "Refunds_returns_or_exchanges", "Telephonic_interactions_or_attempts", "Turn_around_time", "Unable_to_fulfill_request", "Upgrades_or_downgrades", "Ethics_or_reputation", "Accusations_of_unethical_behavior", "Animal_rights", "Business_or_technological_innovation", "Charity_or_outreach_programmes", "Company_financial_performance", "Comparing_brands_to_brands", "Digital_safety_or_security", "Discrimination_or_equality", "Environmental_impact", "Fraud_or_scams", "Protests_or_boycotts", "Reaction_to_advertising", "Referral_or_dissuasion", "Spam_or_unsolicited_contact", "Valuing_loyal_customers", "Pricing", "Affordability", "Changes_in_pricing", "Hidden_costs", "Special_offers", "Staff_or_HR", "How_a_company_treats_its_staff", "Job_availability_or_offers", "Management_and_or_supervisors", "Staff_competency", "Staff_conduct", "Staff_dismissals_or_retrenchmentsUni", "None_Of_The_Above", "Investment_facilities", "Alerts_and_notificationsinvest", "Branch_or_store_otherinvest", "Mobile_appinvest", "Website_feedbackinvest", "Investment_productsinvest", "Annuities", "Bonds", "Commodities", "Investment_funds", "Insuranceinvest", "Pensions", "Stocks", "Network_coverage_or_quality", "Area_coverage", "Call_quality", "Connection_speeds", "Roaming", "Telecommunications_facilities", "Alerts_and_notificationsTele", "Telecommunications_company_app", "Telecommunications_company_website", "Branches_or_stores", "Telecommunications_products", "Airtime", "Comparing_mobile_products_or_services", "Mobile_data", "Mobile_device_insurance", "Range_of_products_product_mixTele", "SIM_card", "Reward_programmestele", "Claims_process", "Approved_or_rejected_claims", "Paying_out_replacing_items", "Status_of_claim", "Insurance_facilities", "Courtesy_vehicles", "Insurance_company_app", "Insurance_company_website", "Referral_bonuses_or_cash_reward_referrals", "Insurance_products", "Application_process", "Changing_cover", "Insurance_features_or_coverage", "Insurance_excess", "Investments_others", "Quotes", "Roadside_assistance", "Insurance_staff_or_contractors", "Assessors_or_investigative_staff", "Brokers", "Repair_or_installation_workers", "Sales_agents", "Staff_competencyInsu", "Staff_conductInsu", "Retail_Facilities", "alerts_notificationsretail", "Branch_or_store_hygieneretail", "", "Branch_or_store_layoutretail", "Branch_or_storesretail", "Courier_or_delivery_serviceretail", "Extra_facilities_in_branch_or_storeretail", "Mobile_appretail", "Online_shopping_ordering", "Physical_safetyretail", "Retail_products", "Expired_or_past_sell_by_dateretail", "Handling_or_packingretail", "House_brands", "Product_or_portion_sizeretail", "Product_out_of_stockretail", "Product_packagingretail", "Product_qualityretail", "Product_tasteretail", "Range_of_products", "Reward_programmesretail", "Banking_products", "Credit_cards", "Debit_cards_or_other_cards", "Foreign_exchange", "Insurancebank", "Investment_productsbank", "Mortgage_or_home_loan", "Overdraft", "Personal_loans", "Reward_programmesbank", "Bank_facilities", "Alerts_and_notificationsBank", "ATMs", "Banking_app", "Branch_or_store_otherbank", "Cellphone_Banking", "Debit_orders", "Online_banking", "Transfers_between_own_accounts_or_friends_or_other_banks", "Drivers", "Driver_earnings", "Driver_recruitment", "Driver_safety", "Driver_support", "Transport_experience", "Other_passengers", "Passenger_safety", "Route", "Transport_app", "Transport_services_coverage", "Vehicle_quality", "Ecommerce_facilities", "Alerts_and_notificationsecommerce", "Collections", "Courier_or_delivery_serviceecommerce", "Mobile_appecommerce", "Order_status", "Pre_orders", "Website_feedbackecommerce", "Ecommerce_products", "Product_out_of_stockecommerce", "Product_packagingecommerce", "Product_qualityecommerce", "Range_of_products_product_mixecommerce", "Reward_programmesecommerce", "Medical_departments", "Anesthesiology", "Emergency_or_casualty", "Intensive_care_unit", "Obstetrics_or_Gynecology", "Pediatrics", "Pharmacy", "Surgery", "Xray_or_imaging", "Patient_journey", "Admissions", "Amenities", "Diagnostics_or_medical_tests", "Discharged_from_care", "Food_or_beverages", "Follow_up_care", "Hygiene_or_cleanliness", "Medical_insurance", "Patient_comfort", "Comparing_healthcare_providers", "Fast_food_facilities", "Alerts_and_notificationsfstfood", "Booking", "Branch_or_store_hygienefstfood", "Branch_or_store_layoutfstfood", "Branch_or_store_otherfstfood", "Courier_or_delivery_servicefstfood", "Customization", "Drive_thru", "Extra_facilities_in_branch_or_storefstfood", "Mobile_appfstfood", "Online_purchasing_or_ordering", "Physical_safetyfstfood", "Website_feedbackfstfood", "Fast_food_products", "Expected_extras_available_with_fast_food_meals", "Expired_or_past_sell_by_datefstfood", "Handling_or_packingfstfood", "Kids_meal", "Product_or_portion_sizefstfood", "Product_out_of_stockfstfood", "Product_packagingfstfood", "Product_qualityfstfood", "Product_tastefstfood", "Range_of_products_product_mixfstfood", "Reward_programmesfstfood", "Safety_and_Security", "Crime", "Fires_Fire_department", "Police", "Traffic_department", "Social_Services", "Animal_welfare", "Education_social_services", "Charity_and_CSI", "Healthcare_Hospitals", "Immigrants", "Homeless_individuals", "Places_of_Worship", "Town_City_management", "Billing_and_Accounts", "Careers_with_the_City", "City_Councillors", "City_Staff", "City_website", "Mayor", "Transport", "Cycling_in_the_city", "Public_transport", "Traffic_and_congestion", "Traffic_lights", "Vehicle_registrations_licensing", "Urban_development_and_management", "Access_to_housing", "Electricity", "Electricity_meter", "Environmental_impacttown", "Parks", "Roads", "Storm_Drains", "Water_Waste_management", "Access_to_water", "Flooding", "Fly_tipping_Dumping_of_waste", "Sanitation", "Solid_waste", "Sewage", "Water_leaks", "Water_meter", "Academics", "Academic_venues", "Campus_reference", "Courses_course_structure", "Exams", "Language_accessibility", "Student_life_and_experiences", "Alumni_graduates_or_past_students", "Campus_events", "Healthcare_services", "International_students", "Parking_and_transport", "Part_time_students", "Political_affiliation_or_views", "Residence_or_accomodation", "Student_organisations_or_societies", "University_sports", "University_administration", "Applying_to_University", "Communicating_with_students", "Counselling", "Fees", "Financial_aid", "Infrastructure", "Open_day", "Registrations", "University_ethics_or_reputation", "Ethnicity_or_racial_concerns_issues", "Gender_concerns_issues", "Intimidation_and_Violence", "Personal_safety_security", "Plagiarism", "Protests_or_boycottsUni", "Religious_concerns_issues", "University_or_campus_ranking", "University_staff_or_HR", "How_a_company_treats_its_staffUni", "Lecturers_academic_staff", "Non_academic_staff", "Staff_competencyUni", "Staff_conductUni", "Staff_dismissals_or_retrenchmentsUni", "Cast", "Interviews_with_the_cast", "Special_guests_cameos", "Elements_of_the_show", "Adaptation", "Characters", "Opening_sequence_credits", "Pop_culture_references_Easter_eggs", "Premiers_finales", "Storyline", "Theme_song", "Ethics_or_reputation_shows_movies", "Awards", "Comparisons_to_other_shows", "Fans_cult_following", "Innovation_of_show", "Ratings", "Recommendation_or_dissuasion", "Scores_and_critiques", "Show_ranking", "Social_awareness_discrimination_equality", "Production_team", "Art_director", "Casting_choice", "Cinematographer", "Director", "Editor", "Executive_producer", "Screenwriters", "Production_values", "Acting", "Art_direction", "Casting", "Cinematography", "Costumes", "Direction", "Editing", "Music_soundtrack", "Special_effects", "Writing", "Show_journey_customer_journey", "Intent_to_start_watching_the_show", "Reasons_for_watching", "Intent_to_keep_watching_the_show", "Intent_to_stop_watching_the_show", "Reasons_for_not_watching", "Intent_to_never_watch_the_show", "Intent_to_subscribe_to_SkyAtlantic_due_to_the_show", "Request_for_opinions_on_the_show", "Show_related_content_or_products", "Advertisement_of_the_show", "How_the_show_influences_real_life", "Memes", "Merchandise", "Plot_theories", "Spoilers", "Trailers_teasers_promos", "Technical_quality", "Decoder", "Image", "Sound", "Subtitles", "Viewing_experience", "Advertisements_during_on_the_show", "Bingewatching", "Group_viewing_or_viewing_events", "Hiatus", "Schedule", "Season_episode_length", "Streaming_on_demand", "Torrenting_Piracy", "Customer_service_Expo2020", "Ticketing", "Turn_around_time_TAT", "Ethics_or_reputation_Expo2020", "Boycotts_or_protests_Expo2020", "Corruption_or_bribery_Expo2020", "Environmental_impact_Expo2020", "Human_rights_Expo2020", "Infrastructure", "Aesthetics", "Construction_Expo2020", "Partnerships_or_initiatives_Expo2020", "Appearances_at_promotional_events", "Grant_programmes", "Multinational_companies", "Tenders_Expo2020", "Volunteers", "Youth_programmes", "UAE_Government_Expo2020", "Comparison_to_other_events_Expo2020", "References_to_the_UAE_or_Dubai_governments", "Relationship_with_foreign_countries", "Buyers_and_sellers", "Feedback_about_a_buyer", "Feedback_about_a_seller", "People_wanting_to_buy", "People_wanting_to_sell", "Online_classified_facilities", "Editing_an_advertisement", "Feature_requests_or_suggestions", "Mobile_appOnlClassif", "Posting_an_advertisement", "Website_feedbackOnlClassif", "Attributes_of_vehicles_that_influence_their_purchase_or_not", "Availability_of_parts_or_spares", "Cost_of_maintenance_or_upkeep", "Electric_or_hybrid_vehicles", "Fuel_efficiency", "Maintenance_plans_packages", "Practicality_of_vehicle", "Safety_specifications", "Vehicle_aesthetics", "Warranty", "Vehicle_sales_offices_or_dealerships", "Comparing_dealerships", "Look_and_feel_of_dealership", "Quality_of_workmanship", "Vehicle_delivery_or_collections", "Vehicle_service_department", "Vehicle_purchase_journey", "After_sales_serviceVL", "Comparing_vehicles", "Desire_to_own_a_vehicle", "Financing_a_vehicle", "No_longer_purchasingv", "Selling_or_trading_in_a_vehicle", "Warranty_claims_process", "Advertising_or_promotions", "Brands_advertising", "Promotions", "Sponsorships_or_Events", "Product_launches", "Alcohol_products", "Expired_or_past_sell_by_datealcohol", "Handling_or_packingalcohol", "Product_out_of_stockalcohol", "Product_packagingalcohol", "Product_qualityalcohol", "Product_tastealcohol", "Range_of_products_product_mixalcohol", "Reward_programmesalcohol", "Alcohol_suppliers_for_offsite_consumption", "Apps", "Deliveries", "Online_shopping", "Point_of_sale_experience", "Store_branch", "Alcohol_units_sizes", "Bottle_dumpy", "Box", "Can", "Case_x12_x24", "Glass_carafe", "Keg", "Quart", "Occasionality_of_drinking", "At_home", "Bars_pubs_nightclubs_or_restaurants", "Drinking_at_an_event", "Drinking_at_work", "Shebeen_informal", "Production_site_wine_farm_etc", "Health_safety_and_legal", "Alcoholism", "Alcohol_content_level_or_strength", "Drink_driving", "Dop_system", "Health_complications", "Liquor_license", "Socio_economic_implications", "Underage_drinking", "Regulations_and_by_laws"]

    add this in care some words get re highlighted:
    instance.mark(Customer_journey, {
        exclude: [
            Trees1
        ],

    replacing: instance.mark(Customer_journey, {



       var instance = new Mark(document.querySelectorAll('span'));
       instance.unmark(options);

    */

    // Add MutationObserver to catch content added dynamically
    var THmo_MutOb = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
    if (THmo_MutOb) {
        var THmo_chgMon = new THmo_MutOb(function (mutationSet) {
            mutationSet.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if (mutation.addedNodes[i].nodeType == 1) {
                        NO_doHighlight(mutation.addedNodes[i]);
                        Insurance_doHighlight(mutation.addedNodes[i]);
                        Bank_doHighlight(mutation.addedNodes[i]);
                        Telkom_doHighlight(mutation.addedNodes[i]);
                        Investment_doHighlight(mutation.addedNodes[i]);
                        RetailStores_doHighlight(mutation.addedNodes[i]);
                        Transport_doHighlight(mutation.addedNodes[i]);
                        Ecommerce_doHighlight(mutation.addedNodes[i]);
                        Medical_doHighlight(mutation.addedNodes[i]);
                        FastFood_doHighlight(mutation.addedNodes[i]);
                        CapeTown_doHighlight(mutation.addedNodes[i]);
                        University_doHighlight(mutation.addedNodes[i]);
                        TvShows_doHighlight(mutation.addedNodes[i]);
                        Expo2020_doHighlight(mutation.addedNodes[i]);
                        OnlineCommerce_doHighlight(mutation.addedNodes[i]);
                        Alcohol_doHighlight(mutation.addedNodes[i]);
                        Cars_doHighlight(mutation.addedNodes[i]);
                    }
                }
            });
        });
        // attach chgMon to document.body
        var opts = { childList: true, subtree: true };
        THmo_chgMon.observe(document.body, opts);
    }
    // Main workhorse routine
    function Bank_doHighlight(el) {

        var keywords = ["Bank facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                BankingProducts()
                BankFacilities()
                customerjourney()
                Customerservice()
                EthicsOrReputation()
                Pricingf()
                StaffOrHr()
                NoneOfTheAbove()
            }
        }
    }
    function Insurance_doHighlight(el) {

        var keywords = ["Insurance facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                ClaimsProcess()
                customerjourney()
                Customerservice()
                EthicsOrReputation()
                Insurancefacilities()
                InsuranceProducts()
                InsuranceStaffOrContractors()
                Pricingf()
                NoneOfTheAbove()
            }





        }
    }
    function Telkom_doHighlight(el) {

        var keywords = ["Network coverage or quality"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney();
                Customerservice();
                EthicsOrReputation();
                Pricingf();
                StaffOrHr();
                CoverageQuality();
                TelecommunicationsFacilities();
                TelecommunicationsProducts();
                NoneOfTheAbove();
            }
        }
    }
    function Investment_doHighlight(el) {

        var keywords = ["Investment facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
                EthicsOrReputation()
                InvestmentFacilities()
                InvestmentProducts()
                Pricingf()
                StaffOrHr()
                NoneOfTheAbove()
            }





        }
    }
    function RetailStores_doHighlight(el) {

        var keywords = ["Retail Facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
                EthicsOrReputation()
                Pricingf()
                RetailFacilities()
                RetailProducts()
                StaffOrHr()
                NoneOfTheAbove()
            }





        }
    }
    function Transport_doHighlight(el) {

        var keywords = ["Transport experience"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
                DriversT()
                EthicsOrReputation()
                Pricingf()
                TransportExperience()
                NoneOfTheAbove()
            }





        }
    }
    function Ecommerce_doHighlight(el) {

        var keywords = ["Ecommerce facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
                EcommerceFacilities()
                EcommerceProducts()
                EthicsOrReputation()
                Pricingf()
                StaffOrHr()
                NoneOfTheAbove()
            }





        }
    }
    function Medical_doHighlight(el) {

        var keywords = ["Medical departments"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
            }





        }
    }
    function FastFood_doHighlight(el) {

        var keywords = ["Fast food facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
                Customerservice()
                FastFoodFacilities()
                FastFoodProducts()
                EthicsOrReputation()
                Pricingf()
                StaffOrHr()
                NoneOfTheAbove()
            }





        }
    }
    function CapeTown_doHighlight(el) {

        var keywords = ["Urban development and management"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function University_doHighlight(el) {

        var keywords = ["Student life and experiences"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function TvShows_doHighlight(el) {

        var keywords = ["Elements of the show"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function Expo2020_doHighlight(el) {

        var keywords = ["Partnerships or initiatives - Expo2020"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function OnlineCommerce_doHighlight(el) {

        var keywords = ["Online classified facilities"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                Customerservice()
                EthicsOrReputation()
                Pricingf()
                StaffOrHr()
                NoneOfTheAbove()
            }





        }
    }
    function Alcohol_doHighlight(el) {

        var keywords = ["Alcohol products"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function Cars_doHighlight(el) {

        var keywords = ["Vehicle purchase journey"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                customerjourney()
            }





        }
    }
    function NO_doHighlight(el) {

        var keywords = ["VaxTheNation"]
        var pat = new RegExp('(' + keywords + ')', 'gi');
        // getting all text nodes with a few exceptions
        var snapElements = document.evaluate(
            './/text()[normalize-space() != "" ' +
            'and not(ancestor::style) ' +
            'and not(ancestor::script) ' +
            'and not(ancestor::textarea) ' +
            'and not(ancestor::code) ' +
            'and not(ancestor::pre)]',
            el, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

        if (!snapElements.snapshotItem(0)) { return; }  // end execution if not found

        for (var i = 0, len = snapElements.snapshotLength; i < len; i++) {
            var node = snapElements.snapshotItem(i);
            // check if it contains the keywords
            if (pat.test(node.nodeValue)) {
                var instance = new Mark(document.querySelectorAll('body'));
                instance.unmark();
            }





        }
    }

    // first run
    Insurance_doHighlight(document.body);
    Bank_doHighlight(document.body);
    Telkom_doHighlight(document.body);
    Investment_doHighlight(document.body);
    RetailStores_doHighlight(document.body);
    Transport_doHighlight(document.body);
    Ecommerce_doHighlight(document.body);
    Medical_doHighlight(document.body);
    FastFood_doHighlight(document.body);
    CapeTown_doHighlight(document.body);
    University_doHighlight(document.body);
    TvShows_doHighlight(document.body);
    Expo2020_doHighlight(document.body);
    OnlineCommerce_doHighlight(document.body);
    Alcohol_doHighlight(document.body);
    Cars_doHighlight(document.body);
    NO_doHighlight(document.body);










})(); // end of anonymous function