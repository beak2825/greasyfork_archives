// ==UserScript==
// @name         Google translation replace
// @version      2024-06-22
// @author       Sokranotes
// @namespace    http://tampermonkey.net/
// @description  Automatically replace the \n and -\n in the content when you use Google Translate
// @license      MIT
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/426792/Google%20translation%20replace.user.js
// @updateURL https://update.greasyfork.org/scripts/426792/Google%20translation%20replace.meta.js
// ==/UserScript==

document.getElementsByTagName("textarea")[0].addEventListener('input',
    function() {
        var curtxt = "";
        curtxt = document.getElementsByTagName("textarea")[0].value;
        //alert(curtxt);
        for (var i=0;i<curtxt.length;i++)
        {
            if(curtxt.indexOf("\n"))
            {
                curtxt = curtxt.replace("\n"," ");
            }
        }
        document.getElementsByTagName("textarea")[0].value = curtxt;
    }
);

