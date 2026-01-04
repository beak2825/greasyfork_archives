// ==UserScript==
// @name        Add Quality Score to C.AI
// @author      Redacted Basilisk
// @namespace   c.ai quality score
// @description this userscript adds a 'quality' score to characters. it's based on the actions/likes ratio. this way you can be more informed when choosing a character to talk to
// @match       https://beta.character.ai/*
// @version     1.0
// @license     GPLv3
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/484297/Add%20Quality%20Score%20to%20CAI.user.js
// @updateURL https://update.greasyfork.org/scripts/484297/Add%20Quality%20Score%20to%20CAI.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

window.onload = function() {
    (new MutationObserver(check)).observe(document, { childList: true, subtree: true });
};

const convertToNumber = str => (isNaN(parseFloat(str)) ? 1 : parseFloat(str)) * (str.endsWith('m') ? 1e6 : (str.endsWith('k') ? 1e3 : 1));
function check(changes, observer) {
    observer.disconnect();

  if(document.querySelector('.MuiToggleButtonGroup-root button[value="like"]')) {
        observer.disconnect();
        var likesCount = convertToNumber($('.MuiToggleButtonGroup-root button[value="like"] div').text());
        var actionsCount = convertToNumber($('[style="font-size: 12px; margin-left: 8px; font-weight: 400; display: flex; gap: 2px; align-items: center;"]').text());
        var result = Math.round(0.6*Math.log(actionsCount+1) / 1.2*Math.log(likesCount+1));
        var color = result < 18 ? "#b82f0d" : result < 28 ? "#ba8b0b" : "#258a00"; //change colors if you want. the order is red yellow green
        //console.log(likesCount, actionsCount);

        var lastButton = $('.MuiToggleButtonGroup-root[aria-label="Vote"]>button:last-child');
        lastButton.after('<div id="quality" style="color: ' + color + '!important; padding-top: 4px; padding-left: 8px;">' + result + '</div>');
    }

    observer.observe(document, { childList: true, attributes: true, characterData: true, subtree: true,  attributeFilter: ['class'] });
}