// ==UserScript==
// @name         Steno Universe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  changes IDM button to steno button
// @author       keegant
// @match        https://play.typeracer.com/
// @match        https://play.typeracer.com/?universe=*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/406012/Steno%20Universe.user.js
// @updateURL https://update.greasyfork.org/scripts/406012/Steno%20Universe.meta.js
// ==/UserScript==

var style = `
.DialogBox.trPopupDialog.practiceViewScoresPopup, .DialogBox.trPopupDialog.GameResultInfoPopup, .DialogBox.trPopupDialog.ErrorMessagePopup {
    display: none;
}
`

var styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = style;
document.head.appendChild(styleSheet);

var loaded = false;

function checkLoad()
{
    if(loaded == false)
    {
        if(document.querySelector(".OptionsWidgetBody > li:nth-child(2) > span").innerHTML != null)
        {
            loaded = true;
            if(window.location.href.indexOf("universe=steno") == -1)document.querySelector(".OptionsWidgetBody > li:nth-child(2) > span").innerHTML = '<span class="gwt-InlineLabel">Steno Universe: </span><a class="gwt-Anchor off" href="https://play.typeracer.com?universe=steno" title="enter Steno Universe">off</a>';
            if(window.location.href.indexOf("universe=steno") != -1)document.querySelector(".OptionsWidgetBody > li:nth-child(2) > span").innerHTML = '<span class="gwt-InlineLabel">Steno Universe: </span><a class="gwt-Anchor off" href="https://play.typeracer.com/" title="leave Steno Universe">on</a>';
            clearInterval(interval);
        }
    }
}

var interval = setInterval(checkLoad,1);