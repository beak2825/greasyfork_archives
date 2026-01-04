// ==UserScript==
// @name         Torn: Copy Activity Log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Open up the activity log, select the background, select below the scrollbar, hold end, logs appear in a text area, copy and paste.
// @author       Xeno2
// @match        https://www.torn.com/*
// @run-at       document-idle
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/410717/Torn%3A%20Copy%20Activity%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/410717/Torn%3A%20Copy%20Activity%20Log.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var log;
    var observer = new MutationObserver(() => {
        log = [];
        $('div[class^="actionWrapper_"]').each((i,e) => { log.push(e) });
        showPopUp();
    });
    observer.observe(document.querySelector('#recent-history-root'), { childList: true, subtree: true });

    $("body").append('<div id="logPopupBox"><textarea id="logTextArea" rows="5" cols="40"></textarea><br/><button id="logBtn">Hide</button><span id="logLineCount"></span></div>');
    $("#logBtn").click(hideLogPopup);
    function hideLogPopup() {
        log = '';
        $("#logTextArea").empty()
        $("#logPopupBox").hide();
    }
    function showPopUp() {
        $("#logTextArea").empty()
        var s = '';
        log.forEach((e) => {
            s += e.children[0].children[0].innerText + ' '
            s += e.children[0].children[2].innerText + '\r\n'
        });
        $("#logLineCount").text(' ' + log.length + ' lines added.');
        $("#logPopupBox").show();
        $("#logTextArea").append(s);
    }

    GM_addStyle ( `
#logPopupBox {
	display: none;
	position: fixed;
	top: 15%;
	left: 0%;
	background: white;
	z-index: 10000;
}
#logBtn {
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  background-image: -webkit-gradient(linear, left bottom, left top, color-stop(0.16, rgb(207, 207, 207)), color-stop(0.79, rgb(252, 252, 252)));
  background-image: -moz-linear-gradient(center bottom, rgb(207, 207, 207) 16%, rgb(252, 252, 252) 79%);
  background-image: linear-gradient(to top, rgb(207, 207, 207) 16%, rgb(252, 252, 252) 79%);
  padding: 3px;
  border: 1px solid #000;
  color: black;
  text-decoration: none;
}
` );

})();