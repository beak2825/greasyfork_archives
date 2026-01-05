// ==UserScript==
// @name         Subtlepatterns url replacer
// @namespace    https://greasyfork.org/ru/scripts/12797-subtlepatterns-url-replacer/code
// @version      1.0.3
// @author       JusteG
// @match        http://subtlepatterns.com
// @grant        none
// @description enter something useful
// @downloadURL https://update.greasyfork.org/scripts/12797/Subtlepatterns%20url%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/12797/Subtlepatterns%20url%20replacer.meta.js
// ==/UserScript==

$('a.download').each(function(id, a){
    var $a = $(a);
    $a
        .unbind('click')
        .attr('href', ($a.closest('.entry-content').find('.patternpreview').attr('style')).match(/http:\/\/.+(?=')/)[0])
        .attr("download", "img.png");
})