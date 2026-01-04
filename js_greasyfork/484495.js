// ==UserScript==
// @name        Free forever
// @namespace   Violentmonkey Scripts
// @match       https://www.genschat.com/*
// @match       https://www.characterwaifu.com/*
// @include     https://characterwaifu.com/*
// @match       https://www.aicharacterwaifu.com/*
// @include     https://aicharacterwaifu.com/*
// @grant       none
// @version     3.22
// @author      -
// @run-at       document-start
// @license MIT
// @description chat as many times you want it wont tell you to pay
// @downloadURL https://update.greasyfork.org/scripts/484495/Free%20forever.user.js
// @updateURL https://update.greasyfork.org/scripts/484495/Free%20forever.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for Vue instance
    const vueObserver = new MutationObserver(() => {
        if (window._vInstance_ && window._vInstance_.$store) {
            vueObserver.disconnect();

            const store = window._vInstance_.$store;

            const permanentVIP = {
                isVip: true,
                level: "9",
                credit: 999999999,
                creditStr: "999999999",
                subscribe: {
                    level: "9",
                    endDate: 4102444800000,
                    goodsId: "gold_year",
                    message: true,
                    photo: true,
                    audio: true,
                    voice: true,
                    membership: true,
                    features: {
                      hdImages: true,
                      unblurredContent: true,
                      fullAccess: true
            }
                },
                lifetime: {
                    vip: true,
                    expiration: null
                },
                permissions: {
                  viewUnblurred: true,
                  premiumContent: true
                },
            };

            Object.assign(store.state, permanentVIP);

            Object.defineProperties(store.getters, {
                isVip: { get: () => true },
                subscribe: { get: () => permanentVIP.subscribe },
                level: { get: () => "9" }
            });

            store.subscribe((mutation) => {
                if (mutation.type === 'updateSubscribe') {
                    mutation.payload = permanentVIP.subscribe;
                }
            });


            setInterval(() => {
                Object.assign(store.state, permanentVIP);
                window.localStorage.setItem('vip_override', 'active');
            }, 3000);

            window._vInstance_.$forceUpdate();

            const removeElements = setInterval(() => {
                document.querySelectorAll('.vip-expired, .trial-notice, .lock.van-icon.van-icon-lock, .lockVip, .pay').forEach(el => el.remove());
              document.querySelectorAll('.blur.payMode').forEach(el => {
                el.classList.remove('blur', 'payMode');
                el.classList.add('NoBlur');
                console.log('Renamed classes on element:', el);
        });
            }, 1000);
        }
    });

    vueObserver.observe(document, {
        childList: true,
        subtree: true,
        attributes: true
    });

    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        if(args[0].includes('/vip/check') || args[0].includes('/subscription')) {
            return new Response(JSON.stringify({
                status: 'active',
                level: 9,
                expiration: null
            }), { headers: { 'Content-Type': 'application/json' }});
        }
        return originalFetch(...args);
    };
    const originalGetItem = localStorage.getItem;

    localStorage.getItem = function(key) {
        if (key === "isVip") {
            return 1;
        }
        return originalGetItem.apply(this, arguments);
    };
    const originalProgressFn = window.updateChatCount;
    window.updateChatCount = function(t, e) {
        t.chatCount = 0;
    };
    window.showSubscribe = function() {
        console.log("Subscription check bypassed");
        return false;
    };
    const originalSet = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (key === 'chtnum') return;
        return originalSet.apply(this, arguments);
    };
    function setVip() {
        try {
            if (window._vInstance_ && window._vInstance_.$store && window._vInstance_.$store.state) {
                window._vInstance_.$store.state.isVip = true;
            }
        } catch (e) {
            console.error("Error setting isVip:", e);
        }
    }
    const aiChat = JSON.parse(localStorage.getItem('aiChat'));

    if (aiChat) {

        aiChat.thinkCount = 0;
        localStorage.setItem('aiChat', JSON.stringify(aiChat));
    }

    function modifyIndexedDB() {
        const request = indexedDB.open("localforage");

        request.onerror = function(event) {
            console.error("Error opening IndexedDB:", event);
        };

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction(["keyvaluepairs"], "readwrite");
            const objectStore = transaction.objectStore("keyvaluepairs");

            objectStore.openCursor().onsuccess = function(event) {
                const cursor = event.target.result;
                if (cursor) {
                    const key = cursor.primaryKey;
                    let value = cursor.value;

                    try {
                        let jsonValue = JSON.parse(value);

                        if (jsonValue.tip && jsonValue.tip.c !== undefined) {
                            jsonValue.tip.c = 0;
                        }

                        if (jsonValue.tipCount !== undefined) {
                            jsonValue.tipCount = 0;
                        }

                        if (jsonValue.reply !== undefined) {
                            jsonValue.reply = 0;
                        }
                        if (jsonValue.thinkCount !== undefined) {
                            jsonValue.thinkCount = 0;
                        }

                        function replacePayMode(obj) {
                            for (let key in obj) {
                                if (obj.hasOwnProperty(key)) {
                                    if (typeof obj[key] === "object" && obj[key] !== null) {
                                        replacePayMode(obj[key]);
                                    } else if (key === "payMode") {
                                        obj[key] = "vip";
                                    }
                                }
                            }
                        }

                        replacePayMode(jsonValue);

                        const updatedValue = JSON.stringify(jsonValue);
                        const updateRequest = objectStore.put(updatedValue, key);


                        updateRequest.onerror = function() {
                            console.error("Error updating:", key);
                        };
                    } catch (e) {
                        console.error("Error parsing JSON for key:", key, e);
                    }

                    cursor.continue();
                } else {}
            };
        };
    }

    modifyIndexedDB();
    setInterval(modifyIndexedDB, 2000);
    function updateThinkCount() {
        const aiChat = JSON.parse(localStorage.getItem('aiChat'));

        if (aiChat) {
            aiChat.thinkCount = 0;

            localStorage.setItem('aiChat', JSON.stringify(aiChat));
        }
    }

    setInterval(updateThinkCount, 1000);
    setInterval(setVip, 1);
})();