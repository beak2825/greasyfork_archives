// ==UserScript==
// @name         KissAnime - AreYouHuman-Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Skips the "Are you human?" captcha's on KissAnime. This will only allow you to watch anime from RapidVideo.
// @icon         https://imgur.com/uUILQXQ.png
// @author       Anonymous
// @match        http://kissanime.ru/Special/AreYouHuman*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/38932/KissAnime%20-%20AreYouHuman-Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/38932/KissAnime%20-%20AreYouHuman-Skipper.meta.js
// ==/UserScript==

if(document.querySelector('form#formVerify .specialButton')) {
GM_addStyle("#formVerify div {display: none !important;}#formVerify:before {content: 'YES I AM!';color:green;}");
document.querySelector('form#formVerify .specialButton').click()
}
else {
GM_addStyle("#formVerify > div:nth-of-type(1) > p:nth-of-type(1):before{content: 'Yikes! It looks like we hit a snag.';font-weight: bold;color: red;}#formVerify > div:nth-of-type(1) > p a:nth-of-type(1) {display: none;}");
}