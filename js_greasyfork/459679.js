// ==UserScript==
// @name         Imgur.com - copy uploaded image URL to clipboard
// @name:pl      Imgur.com - skopiuj adres URL przesłanego obrazka do schowka
// @namespace    http://konieckropka.eu
// @version      1.0.1
// @description  Upload image to imgur.com. It's full URL will be automatically copied to clipboard. Simple.
// @description:pl  Ten prosty skrypcik pozwala zautomatyzować wgrywanie grafik na imgur.com. Po wysłaniu zdjęcia jego przesłany adres URL skopiuje się do schowka, gotowy do użycia. Proste.
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @match        https://imgur.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imgur.com
// @license      No license
// @downloadURL https://update.greasyfork.org/scripts/459679/Imgurcom%20-%20copy%20uploaded%20image%20URL%20to%20clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/459679/Imgurcom%20-%20copy%20uploaded%20image%20URL%20to%20clipboard.meta.js
// ==/UserScript==

(function () {
    'use strict';
    waitForKeyElements(`div.UploadPost-file img[src^="https://"]`, copyImageUrlToClipboard);
})();

function copyImageUrlToClipboard() {
    let imageUrl = $("div.UploadPost-file img").attr("src");
    navigator.clipboard.writeText(imageUrl);
    $("div.ToastContainer").css({
        "background-color": "rgba(0, 0, 0, 0.6)",
        "height": "fit-content",
        "padding": "30px",
        "bottom": "70px",
        "top": "unset"
    }).html(`<div>Image URL: ${ imageUrl } copied to Clipboard</div>`);
}