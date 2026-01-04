// ==UserScript==
// @name        Check text on page and if so do something
// @namespace   Violentmonkey Scripts
// @include     *example.com*
// @grant       none
// @version     1.0
// @author      -
// @description 19/03/2022 18:08:31
// @downloadURL https://update.greasyfork.org/scripts/448457/Check%20text%20on%20page%20and%20if%20so%20do%20something.user.js
// @updateURL https://update.greasyfork.org/scripts/448457/Check%20text%20on%20page%20and%20if%20so%20do%20something.meta.js
// ==/UserScript==

if (/THIS IS AN EXAMPLE OK 10/i.test (document.documentElement.textContent || document.documentElement.innerText) )
{
    window.open(document.location.href,"_self");
}

