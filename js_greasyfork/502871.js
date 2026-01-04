// ==UserScript==
// @name         Apple Accept program license agreement
// @namespace    http://tampermonkey.net/
// @version      2024-08-06
// @description  Accepts the updated program license agreement automatically.
// @author       Marc PEREZ
// @match        https://developer.apple.com/account*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=apple.com
// @license      MIT
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://update.greasyfork.org/scripts/383527/701631/Wait_for_key_elements.js
// @downloadURL https://update.greasyfork.org/scripts/502871/Apple%20Accept%20program%20license%20agreement.user.js
// @updateURL https://update.greasyfork.org/scripts/502871/Apple%20Accept%20program%20license%20agreement.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function click(buttons) {
    buttons[0].click();
}

// Find the "Review Agreement" button and click it
waitForKeyElements("html body.dmf div#__next div.App.background div main#main.main div.Overview_Overview__4hiqf.Overview div.Overview_OverviewGrid__oysjU.grid div.BannerList_BannerList__MQG1f.BannerList ul.BannerListItems.no-bullet.no-margin-left.padding-bottom-small li.BannerList_BannerListItem__oyMAT.BannerListItem.row.BannerListItem-enter-done div.Banner_Banner__PsaWf.column.large-12 div.Banner_BannerButtons__c2PCh button.button", click);

// Find the "Agree" button and click it
waitForKeyElements("html body.dmf.no-scroll div#__next div.App.background div main#main.main div.Overview_Overview__4hiqf.Overview div.AgreementTermsModal div.AgreementModal_AgreementModal__Rq6Zz div.Modal.modal.Modal_Modal__BqzEV.Modal_DimmedModal__EmThY div.view.Modal_ModalView__3ZoZL div.Modal_ModalButtons__2_WNG.buttons button.button.button-block", click);