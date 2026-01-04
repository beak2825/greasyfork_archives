// ==UserScript==
// @name         Yahoo!Mail Highlight important emails
// @namespace    http://tampermonkey.net/
// @version      2024-05-27
// @description  Highlight emails coming from specific senders.
// @author       blaze_125
// @match        https://mail.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496264/Yahoo%21Mail%20Highlight%20important%20emails.user.js
// @updateURL https://update.greasyfork.org/scripts/496264/Yahoo%21Mail%20Highlight%20important%20emails.meta.js
// ==/UserScript==
/*
Add your desired email addresses to the 'emailAddressList' array.
When you're done with it it should look something like this
var emailAddressList = ["someone@somewhere.com", "SomeOneElse@SomePlaceElse.cOm".toLowerCase()];

if you do not want to get an alert, then make 'alertMe' false.
*/
(function () {
    'use strict';
    window.localStorage.setItem("warnedAbout", "");
    document.addEventListener('DOMNodeInserted', function (e) {
        var alertMe = true;
        var warnedAbout = window.localStorage.getItem("warnedAbout").split(";");
        var emailAddressList = ["someone@somewhere.com".toLowerCase()];//always lowercase the addresses in here
        var lst = document.querySelectorAll("div[data-test-id='senders']");
        var foundLst = [];
        for (var i = 0; i < lst.length; i++) {
            var b = lst[i].querySelector("span[data-test-id='senders_list']");
            //console.log(b.title.toLowerCase());
            if (emailAddressList.indexOf(b.title.toLowerCase()) > -1) {
                if (warnedAbout.indexOf(b.title) == -1 && foundLst.indexOf(b.title) == -1) {
                    foundLst.splice(0, 0, b.title);
                }
                b.setAttribute("style", "color: red;")
            }
        }
        if (alertMe) {
            if (foundLst.length > 0) {
                window.localStorage.setItem("warnedAbout", warnedAbout.concat(foundLst).join(";"));
                alert("Found emails you should be interested in. Look carefuly\r\n" + foundLst.join("\n\r"));
            }
        }
    });
})();