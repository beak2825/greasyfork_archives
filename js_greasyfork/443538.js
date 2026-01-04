// ==UserScript==
// @name         nationwide.co.uk autofill enabler
// @namespace    https://greasyfork.org/users/903639-kurimizumi
// @version      0.1
// @description  A script to replace the passnumber dropdowns with a fillable password field
// @author       kurimizumi
// @copyright    17 April 2022, kurimizumi
// @license      GNU AGPLv3
// @match        https://onlinebanking.nationwide.co.uk/AccessManagement/Login/IdentifyCustomerForLogin
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/443538/nationwidecouk%20autofill%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/443538/nationwidecouk%20autofill%20enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;

    function enableContinueButton(enabled) {
        $("div.mem-data-section-holder > div.media-group > div.media-group__main > div.action.action--primary.action--authentication > button.action__button").eq(1).prop("disabled", !enabled).css("visibility", enabled ? "visible" : "hidden");
    }

    enableContinueButton(false);

    $(".control-group:has(> .passnumber-partial-entry)")
    .css("visibility", "hidden")
    .before(`
        <div class="control-group">
            <div class="control control--no-description control--enabled control--loaded">
                <label class="control__label" for="tampermonkey-full-passnumber">
                    <span class="control__label__title">
                        <h3>Enter your full passnumber</h3>
                    </span>
                </label>
                <div class="control__input">
                    <input type="password" id="tampermonkey-full-passnumber" name="tampermonkey-full-passnumber" data-com-onepassword-filled="light" aria-invalid="false">
                </div>
            </div>
        </div>
    `);

    // $("li.digit_entry > div > div > div > select").eq(2).val("5").change();
    $("#tampermonkey-full-passnumber").on("input", function(event) {
        var passnumberValue = $("#tampermonkey-full-passnumber").val();
        var correctFormat = /[0-9]{6}/.test(passnumberValue);
        if(correctFormat) {
            enableContinueButton(true);
            var passnumberArray = passnumberValue.split("");
            passnumberArray.forEach(function (digit, index) {
                var digitElement = $(".digitsRow > li").eq(index);
                if(digitElement.hasClass("digit_entry")) {
                    digitElement.find("div > div > div > select").eq(0).val(digit).change();
                }
            });
        } else {
            enableContinueButton(false);
        }
    });
})();