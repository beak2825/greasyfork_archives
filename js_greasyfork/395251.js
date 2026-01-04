// ==UserScript==
// @name         Toranoana: no reload
// @namespace    http://darkfader.net/
// @version      0.3
// @description  Do not redirect after action.
// @author       Rafael Vuijk
// @match        https://ec.toranoana.shop/ec/app/mypage/favorite_list/*
// @match        https://ec.toranoana.shop/ec/app/cart/cart/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/395251/Toranoana%3A%20no%20reload.user.js
// @updateURL https://update.greasyfork.org/scripts/395251/Toranoana%3A%20no%20reload.meta.js
// ==/UserScript==

HTMLElement.prototype.remove = function() { this.parentNode.removeChild(this); return this; }

function onReady() {
    const _controlAjaxSuccess = unsafeWindow.controlAjaxSuccess;
    unsafeWindow.controlAjaxSuccess = function(data, successFunction, messageType, messageAdd, formId) {
        if (formId !== undefined && formId != null) {
            console.log("controlAjaxSuccess", data, successFunction, messageType, messageAdd, formId);
            let action = document.getElementById(formId).querySelector("input[name='actionId']").value;
            console.log(data, action);
            if (action == "delete") {
                data.nextUrl = null; // don't go anywhere (and parse transactiontoken from result)
            }
            _controlAjaxSuccess(data, successFunction, messageType, messageAdd, formId);
            if (action == "delete") {
                document.getElementById(formId).remove();
            }
        } else {
            _controlAjaxSuccess(data, successFunction, messageType, messageAdd, formId);
        }
    }
}

// start the onReady...
if (document.readyState !== "loading") {
    setTimeout(onReady, 0);
} else {
    document.addEventListener("DOMContentLoaded", onReady);
}
