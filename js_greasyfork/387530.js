// ==UserScript==
// @name         WaniKani Smug Girls
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Anime girls despise you every time you are wrong
// @author       Iaro
// @match        https://www.wanikani.com/review/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387530/WaniKani%20Smug%20Girls.user.js
// @updateURL https://update.greasyfork.org/scripts/387530/WaniKani%20Smug%20Girls.meta.js
// ==/UserScript==

var smug = false;
var image;

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
        if (mutationRecord.target.className == "incorrect" && !smug) {
            console.log("Show smug girl!");
            console.log(image);
            image.style.visibility = "visible";
        } else
            image.style.visibility = "hidden";
    });
});

function addStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (head) {
        style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        style.textContent = css;
        head.appendChild(style);
        return style;
    }
    return null;
}

(function() {
    //Does the thing!
    addStyle('#smug-mode.active {color:#f00; opacity:1.0;}');
    smug = localStorage.getItem('smug');
    console.log(smug);
    smug = (smug !== 'false');
    $('#summary-button').append('<a id="smug-mode" href="#"' + (!smug ? ' class="active"' : '') + '><i class="icon-eye-open"></i></a>');
    $('#smug-mode').click(function() {
        smug = !smug;
        console.log('smug mode ' + (smug ? 'en' : 'dis') + 'abled!');
        localStorage.setItem('smug', smug);
        $(this).toggleClass('active', !smug);
        return false;
    });

    var target = document.getElementById("user-response").parentElement;
    observer.observe(target, { attributes: true, attributeFilter: ['class'] });

    $('body').append('<img id="smugImage" src="https://img.fireden.net/a/image/1511/00/1511008288115.jpg">');
    //$('body').append('<div class="fullScreen"><img id="smugImage" src="https://img.fireden.net/a/image/1511/00/1511008288115.jpg"></div>');
    //addStyle('.fullScreen {position:relative; height: 100%; width:100%;}');
    addStyle('body {position:relative;}');
    addStyle('#smugImage {position:absolute; top:3em; left:0; right:0; bottom:0; margin:0 auto; width:24em; z-index:100;}');
    addStyle('#smugImage:hover {opacity: 0.1; filter: alpha(opacity=10);}');
    image = document.getElementById("smugImage");
    image.style.visibility = "hidden";
})();