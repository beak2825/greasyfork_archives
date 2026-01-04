// ==UserScript==
// @name         多邻国 Super付费会员全功能实现 听力练习 口语 单词等专属功能
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Duolingo Super付费会员全功能实现 听力练习 口语 单词等专属功能
// @author       Your Name
// @match        *://www.duolingo.com/*
// @match        *://www.duolingo.cn/*
// @grant        none

// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/521554/%E5%A4%9A%E9%82%BB%E5%9B%BD%20Super%E4%BB%98%E8%B4%B9%E4%BC%9A%E5%91%98%E5%85%A8%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0%20%E5%90%AC%E5%8A%9B%E7%BB%83%E4%B9%A0%20%E5%8F%A3%E8%AF%AD%20%E5%8D%95%E8%AF%8D%E7%AD%89%E4%B8%93%E5%B1%9E%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/521554/%E5%A4%9A%E9%82%BB%E5%9B%BD%20Super%E4%BB%98%E8%B4%B9%E4%BC%9A%E5%91%98%E5%85%A8%E5%8A%9F%E8%83%BD%E5%AE%9E%E7%8E%B0%20%E5%90%AC%E5%8A%9B%E7%BB%83%E4%B9%A0%20%E5%8F%A3%E8%AF%AD%20%E5%8D%95%E8%AF%8D%E7%AD%89%E4%B8%93%E5%B1%9E%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Helper function to intercept and modify fetch responses
    const interceptFetch = (urlPattern, modifyResponse) => {
        const originalFetch = window.fetch;
        window.fetch = async function(resource, config) {
            if (typeof resource === 'string' && resource.match(urlPattern)) {
                const response = await originalFetch(resource, config);
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();
                const modifiedData = modifyResponse(data);
                return new Response(JSON.stringify(modifiedData), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }
            return originalFetch(resource, config);
        };
    };

    // Intercept and modify hasPlus-related responses
    interceptFetch(/\/2017-06-30\/users\/\d+\?fields=acquisitionSurveyReason.*/, data => {
        if (data.hasOwnProperty('hasPlus')) {
            data.hasPlus = true;
        }
        if (data.hasOwnProperty('has_item_premium_subscription')) {
            data.has_item_premium_subscription = true;
        }
        return data;
    });

    // Intercept and modify shopItems-related responses
    interceptFetch(/\/2017-06-30\/users\/\d+\?fields=shopItems.*/, () => {
        return {
            "shopItems": [
                {
                    "purchaseId": "535b19eca2a886a6c31d44d18eb54117",
                    "purchaseDate": 1732463247,
                    "purchasePrice": 0,
                    "itemName": "streak_freeze",
                    "quantity": 2
                },
                {
                    "purchaseId": "e0337288091b19ed4dfee6d76003bd49",
                    "purchaseDate": 1732532851,
                    "purchasePrice": 0,
                    "itemName": "duo_streak_freeze",
                    "quantity": 1
                },
                {
                    "purchaseId": "1996eeae29f0e4d8e131a8b4c2b09cc1",
                    "purchaseDate": 1728206660,
                    "purchasePrice": 11999,
                    "itemName": "premium_subscription",
                    "subscriptionInfo": {
                        "currency": "EGP",
                        "expectedExpiration": 2050482940,
                        "isFreeTrialPeriod": false,
                        "periodLength": 12,
                        "price": 56999,
                        "renewer": "DUOLINGO",
                        "renewing": false,
                        "vendorPurchaseId": "sub_1Q6qhMCr1cvUccnXMT7IKquW"
                    },
                    "familyPlanInfo": {
                        "ownerId": 1392167741,
                        "secondaryMembers": [
                        ],
                        "pendingInvites": []
                    }
                },
                {
                    "purchaseId": "bf6660ed070dfd5029cbb1ac8d631b09",
                    "purchaseDate": 1734843808,
                    "purchasePrice": 0,
                    "itemName": "streak_repair"
                }
            ]
        };
    });

    // Intercept and modify subscription-catalog-related responses
    interceptFetch(/\/2017-06-30\/users\/\d+\/subscription-catalog\?billingCountryCode=.*/, () => {
        return {
            "layout": "STANDARD",
            "productExperiments": [],
            "plusPackageViewModels": [],
            "subscriptionFeatureGroupId": 0,
            "currentPlan": {
                "productId": "com_duolingo_stripe_subscription_premium_fam_twelvemonth_2024q2_eg_egp_inclusive_56999",
                "isFamilyPlan": true,
                "trackingProperties": {
                    "subscription_tier": "twelve_month",
                    "is_family_plan": true,
                    "free_trial_length": 0,
                    "free_trial_period": false
                },
                "type": "premium",
                "advertisableFeatures": [
                    "NO_NETWORK_ADS",
                    "UNLIMITED_HEARTS",
                    "LEGENDARY_LEVEL",
                    "MISTAKES_INBOX",
                    "MASTERY_QUIZ",
                    "NO_SUPER_PROMOS",
                    "LICENSED_SONGS",
                    "CAN_ADD_SECONDARY_MEMBERS"
                ],
                "periodLengthInMonths": 12,
                "planCurrency": "EGP",
                "priceInCents": 56999,
                "trialPeriodInDays": 0
            }
        };
    });
})();
