// ==UserScript==
// @name        artefacts by ctsigma
// @namespace   virtonomica
// @include     https://*virtonomic*.*/*/main/company/view/*/unit_list
// @description shows artefacts on unit list
// @version     1.01
// @author      ctsigma
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/40816/artefacts%20by%20ctsigma.user.js
// @updateURL https://update.greasyfork.org/scripts/40816/artefacts%20by%20ctsigma.meta.js
// ==/UserScript==
var run = function () {
    var win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    var $ = win.$;
    var art = $('<img style="cursor:pointer;vertical-align:middle;" width="32" src="/img/artefact/icons/color/other.gif" title="инновации">').click(function () {artefacts()});
    $('img[src="/img/icon/unit_build.png"]').parents('td').prepend(art);

    function artefacts() {
        $('.info.i-lab').each(function(){
            var url = $('a',this).attr('href');
            var art = [];
            $.ajax({
                type: 'GET',
                url: url,
                async: false,
                success: function (data) {$('.artf_slots img',data).each(function(){art[art.length] = $(this);})}
            });
            var alerts = $(this).nextAll('.alerts');
            art.forEach(function(o){alerts.append(o.attr('width',24));})
        })}
}
if (window.top == window) {
    var script = document.createElement('script');
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}
