// ==UserScript==
// @name            Skipper for ouo.io by IMBA
// @namespace       https://altenen.is/members/imba.559517/
// @version         1.*
// @description     You can bypass countdown after reCAPTCHA, even reCAPTCHA can be bypassed
// @author          IMBA
// @match           https://ouo.io/*
// @match           https://ouo.press/*
// @match           https://ouo.io/go/*
// @match           https://ouo.press/go/*
// @run-at          document-end
// @exclude         https://ouo.io/manage/*
// @exclude         https://ouo.io/rates
// @exclude         https://ouo.io/
// @exclude         https://ouo.io/auth/signin
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/419509/Skipper%20for%20ouoio%20by%20IMBA.user.js
// @updateURL https://update.greasyfork.org/scripts/419509/Skipper%20for%20ouoio%20by%20IMBA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document.getElementById("form-captcha") === null) {
        document.getElementsByTagName("form")[0].submit();
    }
       if (document.getElementById("form-captcha").click) {
        document.getElementsByTagName("form")[0].submit();
    }
})();