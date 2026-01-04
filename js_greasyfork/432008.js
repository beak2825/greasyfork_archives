// ==UserScript==
// @name         Mutual and suscribe to youself on osu!
// @namespace    osu
// @version      2.0.7
// @description  Allows you to mutual and subscribe to your own osu profile
// @author       Magnus Cosmos
// @match        https://osu.ppy.sh/*
// @match        https://lazer.ppy.sh/*
// @require      https://greasyfork.org/scripts/441010-osupageobserver/code/OsuPageObserver.js
// @downloadURL https://update.greasyfork.org/scripts/432008/Mutual%20and%20suscribe%20to%20youself%20on%20osu%21.user.js
// @updateURL https://update.greasyfork.org/scripts/432008/Mutual%20and%20suscribe%20to%20youself%20on%20osu%21.meta.js
// ==/UserScript==

function getReactFiber(el) {
    return el[Object.keys(el).filter(prop => /__reactFiber/.test(prop))[0]];
}

function getReactProps(el) {
    return el[Object.keys(el).filter(prop => /__reactProps/.test(prop))[0]];
}

function staticFn() {}

let osuCore, document;
if (unsafeWindow) {
  osuCore = unsafeWindow.osuCore;
  document = unsafeWindow.document;
}

const observer = new OsuWebObserver(staticFn, () => {
    if (osuCore.currentUser) {
        const friendButton = document.querySelector(".user-action-button");
        const subscribeButton = document.querySelectorAll(".user-action-button")[1];
        if (friendButton && !friendButton.classList.contains("user-action-button--mutual")) {
            const state = getReactProps(friendButton).children[1]._owner.stateNode;
            if (state.props.userId === osuCore.currentUser.id) {
                friendButton.classList.add("user-action-button--mutual");
                state.followersWithoutSelf++;
            }
        }
        if (subscribeButton && subscribeButton.disabled) {
            subscribeButton.removeAttribute("disabled");
            subscribeButton.onclick = getReactProps(subscribeButton).onClick;
        }
    }
});