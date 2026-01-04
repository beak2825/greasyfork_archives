// ==UserScript==
// @name         Auto collect community points
// @namespace    https://twitter.com/rin_jugatla
// @version      0.0.1
// @description  Twitchのコミュニティポイントを自動で取得します。Automatically get Twitch community points.
// @author       rin_jugatla
// @match        https://www.twitch.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451131/Auto%20collect%20community%20points.user.js
// @updateURL https://update.greasyfork.org/scripts/451131/Auto%20collect%20community%20points.meta.js
// ==/UserScript==

let is_success_watch_dog = false;
let try_count = 0;
const try_limit = 10;
const try_delay_ms = 5000;
const click_random_delay_ms = 5000;
const print_log = true;

function watchPointCollectButton() {
    const watch_selector = 'div[data-test-selector="community-points-summary"] > div:nth-child(2) > div';
    const watch_element = document.querySelector(watch_selector);
    if (watch_element == null) { return; }

    function virtualClick() {
        const point_collect_button_selector = 'div[data-test-selector="community-points-summary"] > div:nth-child(2) > div > div > div> button';
        const button = document.querySelector(point_collect_button_selector);

        if (button == null) { return; }
        setTimeout(() => {
            if (print_log) { console.log(); }
            button.click();
        }, Math.random() * click_random_delay_ms);
    }

    // ノードの監視
    const mutation = new MutationObserver(virtualClick);
    mutation.observe(watch_element, { childList: true, subtree: true });
    is_success_watch_dog = true;
}

window.addEventListener('load', () => {
    const timer = setInterval(() => {
        try_count++;
        watchPointCollectButton();

        const is_giveup_watch_dog = try_count > try_limit - 1;
        if (is_giveup_watch_dog || is_success_watch_dog) { clearInterval(timer); }
    }, try_delay_ms);
});