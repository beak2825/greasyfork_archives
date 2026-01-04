// ==UserScript==
// @name        Kanji Koohii Stroke Order - Review section
// @namespace   koohiireview
// @description Adds Kanji Stroke Order to the Review section
// @include     http://kanji.koohii.com/review*
// @include     https://kanji.koohii.com/review*
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/416043/Kanji%20Koohii%20Stroke%20Order%20-%20Review%20section.user.js
// @updateURL https://update.greasyfork.org/scripts/416043/Kanji%20Koohii%20Stroke%20Order%20-%20Review%20section.meta.js
// ==/UserScript==

var target = document.querySelector('#uiFcMain');
var inject_container = document.createElement("div");
inject_container.style.fontFamily = 'KanjiStrokeOrders';
inject_container.style.fontSize = '175px';
inject_container.style.backgroundColor = 'white';
document.querySelector("#rd-side").appendChild(inject_container);

var observer = new MutationObserver(function(mutations) {
    var targetCard = document.querySelector('#uiFcMain>div.uiFcCard');
    if (targetCard.classList.contains("uiFcState-1")) {
        inject_container.innerHTML = document.querySelector('.d-kanji>div>div>span>span').textContent;
    }
    else {
        inject_container.innerHTML = '';
    }
});

var config = { attributes: true, childList: true, subtree: true };
observer.observe(target, config);
