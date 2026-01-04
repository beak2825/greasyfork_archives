// ==UserScript==
// @name         JD Helper
// @namespace    https://greasyfork.org/en/users/318347
// @version      0.3
// @description  JD Helper Description
// @author       LambertQin
// @match        https://item.jd.com/*
// @match        https://cart.jd.com/*
// @match        https://trade.jd.com/*
// @connect-src  www.jd.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419099/JD%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/419099/JD%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var itemMaxCount = 2;

    var executeOrDelayUntilConditionMeet = function (condition, callback, timeout) {
        if(!timeout) { timeout = 25 }
        setTimeout(function(){
            if (condition()) {
                callback();
            }else {
                executeOrDelayUntilConditionMeet(condition, callback);
            }
        }, timeout);
    }
    var AddToCart = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#InitCartUrl').length
                },
                function(){
                    var addToCartElement = $('#InitCartUrl');
                    window.location = addToCartElement.prop('href');
                }
            )
        }()
        var exec = function () {
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var AddToCart1 = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#btn-reservation').length && '抢购' === $('#btn-reservation').text()
                },
                function(){
                    var addToCartElement = $('#btn-reservation');
                    window.location = addToCartElement.prop('href');
                }
            )
        }()
        var exec = function () {
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var GoToCart = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#GotoShoppingCart').length
                },
                function(){
                    var goToCartElement = $('#GotoShoppingCart');
                    window.location = goToCartElement.prop('href');
                }
            )
        }()
        var exec = function () {
        }
        return {
            'init': init,
            'exec': exec
        }
    }

    var SubmitCart = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('.common-submit-btn').length
                },
                function(){
                    var submitCartElement = $('.common-submit-btn');
                    window.location = 'https://trade.jd.com/shopping/order/getOrderInfo.action'
                }
            )
        }()
        var exec = function () {
        }
        return {
            'init': init,
            'exec': exec
        }
    }

    var SubmitOrder = function () {
        var init = function () {
            executeOrDelayUntilConditionMeet(
                function () {
                    return $('#order-submit').length
                },
                function(){
                    var submitOrderElement = $('#order-submit');
                    submitOrderElement.click();
                }
            )
        }()
        var exec = function (showNewerFirst) {
        }
        return {
            'init': init,
            'exec': exec
        }
    }
    var appInit = function () {
        switch (top.location.hostname) {
            case 'item.jd.com':
                AddToCart1();
                break;
            case 'cart.jd.com':
                if (true === top.location.pathname.startsWith('/cart_index/')) {
                    SubmitCart();
                } else {
                    GoToCart();
                }
                break;
            case 'trade.jd.com':
                if (true === top.location.pathname.startsWith('/shopping/order')) {
                    SubmitOrder();
                }
                break;
            default:
        }
    }
    setInterval(appInit, 100);
})();
