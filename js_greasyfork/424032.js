// ==UserScript==
// @name         Vajehyab Premium
// @version      0.1
// @author       Soheyl
// @description  Make the Vajehyab.com website even better! with enable half of premium features, for free :)
// @homepage     https://github.com/Soheyl
// @namespace    M.Khani
// @include      http*://*vajehyab.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424032/Vajehyab%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/424032/Vajehyab%20Premium.meta.js
// ==/UserScript==


(function () {
    'use strict'
    var isPremium = document.getElementById('is_premium')
    var adsID = document.getElementsByClassName('vyads')[0]
    var magicword = document.getElementById('magicword')

    if (isPremium) {
        isPremium.value = 1
    }

    if (adsID) {
        adsID.remove()
    }

    if (magicword) {
        magicword.classList.replace('nopremium', 'premium')
    }

})()
