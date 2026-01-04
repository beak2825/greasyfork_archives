// ==UserScript==
// https://stackoverflow.com/questions/6480082/add-a-javascript-button-using-greasemonkey-or-tampermonkey
// @name         Intercom Unassign & Close
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Button that allows you to unassign & then close a conversation
// @author       Waclock
// @match        https://app.intercom.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require https://greasyfork.org/scripts/6250-waitforkeyelements/code/waitForKeyElements.js?version=23756
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408755/Intercom%20Unassign%20%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/408755/Intercom%20Unassign%20%20Close.meta.js
// ==/UserScript==

waitForKeyElements (".conversation__card__actions-wrapper.u__ml__10.u__cf", setCAUButton);
waitForKeyElements (".inbox__card__header__actions:not([data-intercom-target='close-conversaton']) button", disableCAUButton);
waitForKeyElements ("[data-intercom-target='close-conversaton'] button", enableCAUButton);

function enableCAUButton(){
  if($("[data-intercom-target='close-conversaton'] button").length > 0){
      $('#cau-button').removeClass('o__disabled');
  }
}

function disableCAUButton(){
 if($(".inbox__card__header__actions button").length > 0){
     $('#cau-button').addClass('o__disabled');
 }
}

function setCAUButton(){
    var $ = unsafeWindow.jQuery;
    var zNode = document.createElement ('div');
    zNode.innerHTML = '<button class="btn o__primary" id="cau-button" type="button">'
        + 'Close & Unassign</button>';
    zNode.setAttribute ('id', 'close-and-unassign-container');

    var userOptionsDiv = document.getElementsByClassName("conversation__card__actions-wrapper u__ml__10 u__cf")[0];
    userOptionsDiv.appendChild(zNode);

    $('#cau-button').on('click', ButtonClickAction);


    function ButtonClickAction (zEvent) {
        $("button [data-assignee]").click();
        $('body').addClass('cau-hide');
        setTimeout(() => {
            $("[data-dropdown-item='Unassigned']").click();
            $("[data-intercom-target='close-conversaton'] button").click();
            $('body').removeClass('cau-hide');
        }, 100)
    }
}

//--- Style our newly added elements using CSS.
GM_addStyle ( `
    .cau-hide .popover__content-container {
       opacity: 0.01 !important;
       cursor: default !important;
    }

    #close-and-unassign-container {
        display:               inline-block;
    }
    #cau-button {
        cursor:                 pointer;
    }
` );
