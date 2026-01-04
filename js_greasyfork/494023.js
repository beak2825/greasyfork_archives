// ==UserScript==
// @name         ChatGPT Widescreen Ultra Fast
// @id           ChatGPT_Widescreen_Ultra_Fast@https://github.com/BabylonOne/ChatGPT-Widescreen-Ultra-Fast
// @version      2024.8.22.0
// @match        *://chatgpt.com/*
// @author       Alex Yam
// @license      MIT; https://spdx.org/licenses/MIT.html
// @description  The fastest ChatGPT widescreen userscript. Just one line, you don't even have to install a script. Create a bookmark and activate with one click.
// @namespace    https://github.com/BabylonOne
// @homepage     https://github.com/BabylonOne/ChatGPT-Widescreen-Ultra-Fast
// @homepageURL  https://github.com/BabylonOne/ChatGPT-Widescreen-Ultra-Fast
// @supportURL   https://github.com/BabylonOne/ChatGPT-Widescreen-Ultra-Fast/issues
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494023/ChatGPT%20Widescreen%20Ultra%20Fast.user.js
// @updateURL https://update.greasyfork.org/scripts/494023/ChatGPT%20Widescreen%20Ultra%20Fast.meta.js
// ==/UserScript==

/*
/ *** No-Install One-Click Bookmark Activation Method ***
/
/ If you don't want to install a script, create a bookmark named "Expand ChatGPT" with the following URL:
/
/     javascript:document.styleSheets[0].insertRule('.text-token-text-primary>div>div{max-width:100%!important}',0);
/
/ Click the bookmark and all ChatGPT chat boxes should expand instantly.
*/

/*
/ *** No-Install URL Copy and Paste Activation Method ***
/
/ You can also copy and paste the same URL directly into the URL bar and press enter:
/
/     javascript:document.styleSheets[0].insertRule('.text-token-text-primary>div>div{max-width:100%!important}',0);
/
/ Note: Some browsers remove the "javascript:" from the URL for security reasons, you may need to manually enter "javascript:"
/       in front of the URL before pressing Enter. Upon pressing Enter, all ChatGPT chat boxes should expand instantly.
*/

/*
/ *** Simplicity is the ultimate sophistication ***
/
/ * Don't use 10 pages of JavaScript when you can use one line
/ * Don't use JavaScript when you can use pure CSS
/ * Don't wait for elements to show when you do not need to
/ * No addEventListener()
/ * No find()
/ * No forEach()
/ * No getElementById()
/ * No matchAll()
/ * No MutationObserver()
/ * No Promise()
/ * No querySelector()
/ * No setAttribute()
/ * No setTimeout()
/ * No window.onload()
/ * No xmlHttpRequest()
/ * No other CPU burning and scroll jittering callback nonsense
/
/ *** How it works ***
/
/ ChatGPT uses the following TailwindCSS to limit box widths under different screen sizes:
/     "md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]"
/
/ This script inserts the following CSS rule into the master style sheet:
/
/     .text-token-text-primary > div > div {max-width:100% !important;}`
/
/ It overrides TailwindCSS and keeps chat boxes at 100% max-width on all screen sizes, before they are even created.
/
/ JavaScript is used only to insert the CSS rule. Once the rule is inserted, it applies to all current and future
/ chat boxes on the same page, no further JavaScript processing is required.
/
/ This approach functions without relying on constant page element monitoring, resulting in less rendering lag,
/ especially in lengthy conversations and on less powerful hardware.
/
/ OpenAI: How about spend $100 and hire a high school student to add a max-width setting,
/ or ask ChatGPT 3.5 how to do it, it's not hard.
*/

// Expand general responses to 100% of the available width.
GM_addStyle(".text-token-text-primary>div>div{max-width:100%!important}");

// For "Which response do you prefer? [Response 1 | Response 2]"
// expand both responses to 50% of the available width.
GM_addStyle(".min-w-fit>div{max-width:100%!important}");