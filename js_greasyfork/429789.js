// ==UserScript==
// @name         [Deprecated] Kanka Summernote Code View Save Fix
// @namespace    http://tampermonkey.net/
// @version      5
// @description  Correctly saves changes made while in code view in the Summernote editor.
// @author       Salvatos
// @match        https://kanka.io/*
// @match        https://marketplace.kanka.io/*
// @icon         https://www.google.com/s2/favicons?domain=kanka.io
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429789/%5BDeprecated%5D%20Kanka%20Summernote%20Code%20View%20Save%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/429789/%5BDeprecated%5D%20Kanka%20Summernote%20Code%20View%20Save%20Fix.meta.js
// ==/UserScript==

$('#entry').on('summernote.change.codeview', function(we, contents, $editable) {
    $('#entry').val(contents);
});