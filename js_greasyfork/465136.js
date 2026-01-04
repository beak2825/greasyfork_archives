// ==UserScript==
// @name         Open New Frame - Preview View - Magnews
// @version      0.1
// @description  Script to open email iframe in new window
// @author       Piego
// @namespace    https://www.diegopavan.com
// @match        https://be-mn1.mag-news.it/be/cms/giotto/newsletterpreview.do*
// @match        https://be-mn1.mag-news.it/be/cms/previewnewsletter.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magnews.it
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465136/Open%20New%20Frame%20-%20Preview%20View%20-%20Magnews.user.js
// @updateURL https://update.greasyfork.org/scripts/465136/Open%20New%20Frame%20-%20Preview%20View%20-%20Magnews.meta.js
// ==/UserScript==

(function() {

    document.getElementById('mnbtn1').insertAdjacentHTML('beforebegin','<a style="margin-right: 4px" onclick="window.open(document.getElementById(\'layouthtml\').src, \'_blank\')" id="capture-screenshot" class="ct_button"><span style="background-image:url(\'/be/themes/classic/icons/ico_view.png\')"> </span><strong>Screenshot</strong></a>');

})();