// ==UserScript==
// @name            Random Mailinator generator
// @namespace       Morten
// @description     Use shortcut CTRL+ALT+R to insert a random mailinator email in an input field. Then use CTRL+ALT+T to open the previous generated link in a new tab.
// @include         *
// @require         https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?bc893
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/24153/Random%20Mailinator%20generator.user.js
// @updateURL https://update.greasyfork.org/scripts/24153/Random%20Mailinator%20generator.meta.js
// ==/UserScript==

var mousetrap = Mousetrap();
var mailId = "";

mousetrap.stopCallback = function(e, element, combo) {
    return false;
};

mousetrap.bind("ctrl+alt+r", function(e) {
    var element = $(document.activeElement);
    mailId = new Array(10).join().replace(/(.|$)/g, function(){return ((Math.random()*36)|0).toString(36)[Math.random()<0.5?"toString":"toUpperCase"]();});
    element.val(mailId + "@mailinator.com").trigger('input').trigger('change');
});

mousetrap.bind("ctrl+alt+t", function(e) {
    if(mailId !== "") {
        window.open("https://www.mailinator.com/inbox2.jsp?public_to=" + mailId + "#/#public_maildirdiv", "_blank");
    }
});