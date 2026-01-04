// ==UserScript==
// @name         Speechify Premium Voices Helper
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Removes 1500 word limit on premium voices
// @author       You
// @match        https://app.speechify.com/*
// @match        https://dev.app.speechify.com/*
// @match        https://staging.app.speechify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=speechify.com
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499210/Speechify%20Premium%20Voices%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499210/Speechify%20Premium%20Voices%20Helper.meta.js
// ==/UserScript==

const mockedResponse = {
    "subscriptions": [
        {
            "id": "someId",
            "status": "active",
            "renewalStatus": "active",
            "plan": {
                "name": "google_play",
                "price": 0,
                "renewalFrequency": "annually",
                "conversionId": "1",
                "wordsLimit": 150_000,
                "hasTrial": false,
                "initialTrialDurationDays": 100,
                "audiobookCredits": 100,
                "discountIds": [],
                "source": "play_store",
                "productTypes": ["tts","audiobooks","voiceover","dubbing","voicecloning"],
                "labels": ["premium"]
            }
        }
    ],
    "entitlements": {
        "isPremium": true,
        "hdWordsLeft": 1500,
        "nextHDWordsGrant": 0,
        "nextHDWordsGrantDate": null,
        "lastHdWordsGrantDate": new Date().toISOString(),
        "audiobookCreditsLeft": 0,
        "lastAudiobookCreditsGrantDate": new Date().toISOString(),
        "voiceoverSeconds": 0,
        "dubbingSeconds": 0,
        "avatarsSeconds": 0,
        "ttsExportSeconds": 0
    }
}

const {fetch: origFetch} = unsafeWindow;
unsafeWindow.fetch = async (...args) => {
  if(`${args?.[0]}`?.includes?.("getAllSubscriptions")){
     return new Response(JSON.stringify(mockedResponse));
  }

  return await origFetch(...args);
};

(function() {
    'use strict';
    localStorage.setItem('currentWordCount','0');
    setInterval(()=>{
        localStorage.setItem('currentWordCount','0');
    },1000);
})();