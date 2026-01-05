// ==UserScript==
// @name         Sentient 1
// @namespace    saqfish
// @version      1.0
// @description  Sentient - Shoe Similarity
// @description  Validate an image. 
// @author       saqfish
// @include      https://www.mturkcontent.com/dynamic/hit*
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/14203/Sentient%201.user.js
// @updateURL https://update.greasyfork.org/scripts/14203/Sentient%201.meta.js
// ==/UserScript==

$('label[for^=checkbox]').on('click', function(e) {
    setTimeout(function(a){
    $('#submitButton').click();},100);
});