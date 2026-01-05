// ==UserScript==
// @name         Outlook Add-Free
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes right ads panel.
// @author       infloper@gmail.com
// @match        https://outlook.live.com/owa/?path=/mail/inbox
// @include      https://outlook.live.com/*
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://cdn.jsdelivr.net/mutationobserver/0.3.1/mutationobserver.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/20635/Outlook%20Add-Free.user.js
// @updateURL https://update.greasyfork.org/scripts/20635/Outlook%20Add-Free.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        setWidth();
    });
});

$(window).load(function(){
    $('#primaryContainer ._n_p').remove();
    setWidth();

    var target = $($($('#primaryContainer ._n_n')).next('div'))[0];
    if(target) {
        observer.observe(target, { attributes : true, attributeFilter : ['style'] });
    }
});

function setWidth() {
    $($($('#primaryContainer ._n_n')).next('div')).css('right', '0px');
}
