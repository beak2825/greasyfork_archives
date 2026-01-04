// ==UserScript==
// @name         Kour Contraband crate script
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Unlimited legendary crates
// @author       Jhonny-The
// @match        *://kour.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kour.io
// @grant        none
// @license      ISC <3
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/535612/Kour%20Contraband%20crate%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/535612/Kour%20Contraband%20crate%20script.meta.js
// ==/UserScript==

const _fetch = window.fetch;
window.fetch = function () {
    if (arguments[0].includes('/api/track')) {
        return Promise.reject();
    }
    return _fetch.apply(this, arguments);
}

function fixDailyRewards() {
    try {
        if (!window.firebase.auth()?.currentUser) return;

        let shouldSet = false;
        const rewardObj = { lastDailyReward: '24' };
        const refKey = 'users/' + window.firebase.auth().currentUser.uid;

        window.firebase.database().ref(refKey).once('value', e => {
            const obj = e.val();

            Object.keys(obj).forEach(key => {
                if (key.startsWith('dailyReward_')) {
                    rewardObj[key] = null;
                    shouldSet = true;
                }

                if (key === 'lastDailyReward' && obj[key] !== '24') {
                    shouldSet = true;
                }
            });

            if (shouldSet) {
                window.firebase.database().ref(refKey).update(rewardObj);
                window.showUserDetails('', window.firebase.auth().currentUser);
            }
        });

    } catch { }
}

function fakeSetDataNew(a) {
    window.unityInstance.SendMessage('FirebasePlayerPrefs2023', 'OnSetData', '{"err":null}&' + [...a].pop());
}

Object.defineProperty(window, 'unityInstance', {
    get() {
        return this._unityInstance;
    },
    set(v) {
        const _setDataNew = window.setDataNew;
        window.setDataNew = function () {
            if (arguments[1] === 'banned') {
                fakeSetDataNew(arguments);
                return;
            }

            if (arguments[1].includes("dailyReward_")) {
                fakeSetDataNew(arguments);
                window.showUserDetails('', window.firebase.auth().currentUser);
                return;
            }

            if (arguments[1] === 'lastDailyReward') {
                arguments[2] = '24';
            }

            return _setDataNew.apply(this, arguments);
        }

        this._unityInstance = v;

        const _SendMessage = this._unityInstance.SendMessage;
        this._unityInstance.SendMessage = function () {
            if (arguments[1] === 'OnLoggedInGoogle') fixDailyRewards();
            return _SendMessage.apply(this, arguments);
        }
    },
});
