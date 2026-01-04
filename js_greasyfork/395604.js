// ==UserScript==
// @name         generated remover
// @version      5
// @match https://github.com/*
// @description  Removes generated code from diff view on GitHub
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @namespace https://greasyfork.org/users/437950
// @downloadURL https://update.greasyfork.org/scripts/395604/generated%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/395604/generated%20remover.meta.js
// ==/UserScript==

function apply() {
    $('.js-file-header[data-path*=generated] .js-reviewed-checkbox:not(:checked)').click()
    $('.js-file-header[data-path*=Generated] .js-reviewed-checkbox:not(:checked)').click()
}

$(document).ready(function () {
    apply();
});

$(document).on('DOMSubtreeModified', function () {
    apply();
});
