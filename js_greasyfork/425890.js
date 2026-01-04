// ==UserScript==
// @name         Redirect AliExpress to correct domain
// @version      1.0
// @description  Automatically redirects you back to your favorite AliExpress domain as well as changes any bad URLs
// @author       mortenmoulder
// @include      /^https?:\/\/(.*)?aliexpress\.\w{2,6}//
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @namespace https://greasyfork.org/users/10802
// @downloadURL https://update.greasyfork.org/scripts/425890/Redirect%20AliExpress%20to%20correct%20domain.user.js
// @updateURL https://update.greasyfork.org/scripts/425890/Redirect%20AliExpress%20to%20correct%20domain.meta.js
// ==/UserScript==

//////////
////////// CONFIG
//////////
const BAD_URL = "aliexpress.ru";
const GOOD_URL = "aliexpress.com";
//////////
////////// END CONFIG
//////////

const currentPageUrl = location.href;

if(currentPageUrl.includes(BAD_URL)) {
    location.href = currentPageUrl.replace(BAD_URL, GOOD_URL);
} else {
    const elements = $(`a[href*="${BAD_URL}"]`);

    for(let element of elements) {
        let link = $(element).attr("href");
        link = link.replace(BAD_URL, GOOD_URL);
        $(element).attr("href", link);
    }
}