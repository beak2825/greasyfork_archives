// ==UserScript==
// @name         TD clean
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @author       You
// @match        https://www.torrentday.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370654/TD%20clean.user.js
// @updateURL https://update.greasyfork.org/scripts/370654/TD%20clean.meta.js
// ==/UserScript==
/* jshint asi: true, multistr: true */

(function() {
    var style = '\
.browseSectionLink.xXx,\
.browseSectionLink.xXx + .browseSectionGap,\
#pageWrapper>table:first-child,\
#pageWrapper>br,\
#pageWrapper>iframe {\
    display: none;\
}'
    GM_addStyle(style);

    var recommendationTable = document.querySelector('table.topTen')
    if (!recommendationTable) return

    var maxHeight = recommendationTable.offsetHeight
    recommendationTable.setAttribute('data-max-height', maxHeight)
    recommendationTable.classList.add('recTable')
    if (window.localStorage.getItem('collapsedRecTable')) {
        recommendationTable.classList.add('collapsed')
    }

    var toggleButton = document.createElement('input')
    toggleButton.type = "button"
    toggleButton.classList = 'recTableToggleButton btn'
    toggleButton.value = "show/hide recs"
    recommendationTable.insertAdjacentElement('afterEnd',toggleButton)

    toggleButton.onclick = function(e) {
        if (recommendationTable.classList.contains('collapsed')) {
            recommendationTable.classList.remove('collapsed')
            window.localStorage.removeItem('collapsedRecTable')
        } else {
            recommendationTable.classList.add('collapsed')
            window.localStorage.setItem('collapsedRecTable', true)
        }
    }

    GM_addStyle('\
.recTable {\
    display: inline-block;\
    overflow: hidden;\
    transition: max-height 400ms;\
    max-height: ' + maxHeight + 'px;\
}\
.recTable.collapsed {\
    max-height: 30px;\
}\
.recTableToggleButton {\
    margin-bottom: 2em;\
}')

})();

;(function() {
    document.querySelector('cloudflare-app').setAttribute('data-position', 'bottom-right')
})();