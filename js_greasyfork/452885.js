// ==UserScript==
// @name         Autofill S3 delete prompt
// @version      0.2
// @description  Auotfill the input for deleting an S3 bucket
// @author       Grey Hixson
// @match        https://s3.console.aws.amazon.com/s3/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-3.6.1.min.js
// @namespace https://greasyfork.org/users/969361
// @downloadURL https://update.greasyfork.org/scripts/452885/Autofill%20S3%20delete%20prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/452885/Autofill%20S3%20delete%20prompt.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if(url.includes("bucket")) {
     onBucketPage();
  }
}).observe(document, {subtree: true, childList: true});

function onBucketPage() {
    $(document).ready(function() {
        setTimeout(function() {
            var textInput = $('input[id^=awsui-input]');
            if($(".delete-bucket")[0]) {
                textInput.val(textInput.attr('placeholder'));
            } else if ($('.empty-bucket')[0]) {
                textInput.val('permanently delete');
            }
            var submitButton = $('.awsui-button.awsui-button-disabled.awsui-button-variant-primary.awsui-hover-child-icons');
            submitButton.attr('disabled', false)
            submitButton.removeClass('awsui-button-disabled')
        }, 500);
    });
}
