// ==UserScript==
// @name         Brick hill remove purchase modal
// @namespace    http://brick-hill.com/
// @version      0.3
// @description  Removes the confirmation modal when purchasing items
// @author       Dragonian
// @require      https://code.jquery.com/jquery-latest.min.js
// @include      /^https:\/\/www.brick-hill\.com\/shop\/[0-9]+\/$/
// @downloadURL https://update.greasyfork.org/scripts/380529/Brick%20hill%20remove%20purchase%20modal.user.js
// @updateURL https://update.greasyfork.org/scripts/380529/Brick%20hill%20remove%20purchase%20modal.meta.js
// ==/UserScript==

const token = $("meta[name='csrf-token']").attr("content");

function purchaseItem(data) {
    $.post("/shop/purchase", {
        _token: token,
        item_id: data.itemId,
        purchase_type: data.expectedCurrency,
        expected_price: data.expectedPrice,
        expected_seller: data.expectedSeller
    }, () => location.reload());
}

function openSilentPurchaseModal(t) {
    var e = t.data()
      , a = token
      , n = 0 == e.expectedCurrency ? "bucks" : "bits"
      , o = parseInt($("#" + n + "-amount a").attr("title"));

    if (o < e.expectedPrice)
        return openNotEnoughModal(n);
    if (isNaN(o))
        return notLoggedInModal();
    if ($(".owned-check-tri").length > 0)
        return alreadyOwnedModal();

    $(t).unbind("click")

    return purchaseItem(e);
}

$(document).ready(() => {
    $(".item-purchase-buttons button").attr("onclick", null); // Disable button onclick handler
    $(".item-purchase-buttons button").click(function() {
        openSilentPurchaseModal($(this));
    });
})

// Created by Dragonian; https://www.brick-hill.com/user/2760/
